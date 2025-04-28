import React, { useState, useEffect } from 'react';
import {
  Box, Paper, Typography, Avatar, IconButton, Tooltip, Chip,
  Divider, Menu, MenuItem, Button, Fade, TextField, InputAdornment,
  Pagination, Dialog, DialogTitle, DialogContent, DialogActions
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  FilterList as FilterIcon,
  Inventory as InventoryIcon,
  Search as SearchIcon
} from '@mui/icons-material';
import { grey } from '@mui/material/colors';

// Couleurs de catégories
const categoryColors = {
  'Electronique': '#3f51b5',
  'Alimentaire': '#43a047',
  'Vestimentaire': '#ec407a',
  'Bricolage': '#ff9800',
  'Informatique': '#2196f3',
  'Pharmaceutique': '#9c27b0',
  'Mobilier': '#795548',
  'Papeterie': '#607d8b',
  'Automobile': '#f44336',
  'Autres': '#9e9e9e',
  'Matériaux': '#9c27b0',
  'Outils': 'yellow'
};

const ShowProduct = ({ products, onEdit, onDelete, formatPrice }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage] = useState(5);
  const [selectedCategory, setSelectedCategory] = useState('Toutes');
  const [filterAnchorEl, setFilterAnchorEl] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null); // Ajouter un état pour le produit à supprimer

  useEffect(() => {
    if (searchTerm.trim() !== '') {
      setIsSearchActive(true);
    } else {
      setIsSearchActive(false);
    }
    setCurrentPage(1); // Reset la pagination
  }, [searchTerm]);

  useEffect(() => {
    setCurrentPage(1); // Reset la pagination
  }, [selectedCategory]);

  const handleFilterClick = (event) => {
    setFilterAnchorEl(event.currentTarget);
  };

  const handleFilterClose = () => {
    setFilterAnchorEl(null);
  };

  // Filtrer les produits selon la catégorie et le terme de recherche
  const filteredProducts = products.filter(product => {
    const matchCategory = selectedCategory === 'Toutes' || product.categorie === selectedCategory;
    const matchSearch = searchTerm.trim() === '' || 
      product.nom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.categorie?.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchCategory && matchSearch;
  });

  const indexOfLastProduct = currentPage * rowsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - rowsPerPage;
  
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);

  const totalPages = Math.ceil(filteredProducts.length / rowsPerPage);

  const uniqueCategories = ['Toutes', ...new Set(products.map(p => p.categorie))];

  const getCategoryColor = (category) => {
    return categoryColors[category] || categoryColors['Autres'];
  };

  const handleDeleteConfirmed = () => {
    if (productToDelete) {
      onDelete(productToDelete.id); // Utilisez l'ID du produit à supprimer
      setOpenDialog(false);
      setProductToDelete(null); // Reset après suppression
    }
  };

  return (
    <Box>
      <Paper 
        elevation={2}
        sx={{
          p: 2,
          mb: 3,
          display: 'flex',
          flexWrap: 'wrap',
          gap: 2,
          borderRadius: 2,
          alignItems: 'center',
          justifyContent: 'space-between'
        }}
      >
        <Button
          variant="outlined"
          startIcon={<FilterIcon />}
          onClick={handleFilterClick}
          sx={{ fontWeight: 'medium', borderRadius: 2 }}
        >
          {selectedCategory === 'Toutes' ? 'Toutes catégories' : selectedCategory}
        </Button>

        <Menu
          anchorEl={filterAnchorEl}
          open={Boolean(filterAnchorEl)}
          onClose={handleFilterClose}
        >
          {uniqueCategories.map((cat) => (
            <MenuItem
              key={cat}
              onClick={() => {
                setSelectedCategory(cat);
                handleFilterClose();
              }}
              sx={{
                fontWeight: selectedCategory === cat ? 'bold' : 'normal',
                color: cat !== 'Toutes' ? getCategoryColor(cat) : 'inherit'
              }}
            >
              {cat}
            </MenuItem>
          ))}
        </Menu>

        <TextField
          placeholder="Rechercher un produit..."
          size="small"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{
            borderRadius: 5,
            '& .MuiOutlinedInput-root': {
              borderRadius: 5
            },
            width: '250px'
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="action" />
              </InputAdornment>
            ),
          }}
        />
      </Paper>

      <Paper elevation={3} sx={{ borderRadius: 2, overflow: 'hidden' }}>
        {currentProducts.length > 0 ? (
          currentProducts.map((product, index) => (
            <React.Fragment key={product.id}>
              {index > 0 && <Divider />}
              <Fade in={true} style={{ transitionDelay: `${index * 50}ms` }}>
                <Box
                  sx={{
                    display: 'flex',
                    p: 2,
                    transition: 'background-color 0.2s',
                    '&:hover': { bgcolor: 'rgba(0, 0, 0, 0.04)' }
                  }}
                >
                  <Avatar
                    variant="rounded"
                    src={product.image}
                    sx={{ width: 70, height: 70, borderRadius: 1 }}
                  >
                    {!product.image && (product.nom?.charAt(0) || 'P')}
                  </Avatar>

                  <Box sx={{ flex: 1, ml: 2, overflow: 'hidden' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                      <Chip
                        label={product.categorie}
                        size="small"
                        sx={{
                          mr: 1,
                          color: 'white',
                          backgroundColor: getCategoryColor(product.categorie),
                          fontWeight: 'bold',
                          height: 20
                        }}
                      />
                      <Typography variant="h6" noWrap>
                        {product.nom}
                      </Typography>
                    </Box>

                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: '-webkit-box',
                        WebkitLineClamp: 1,
                        WebkitBoxOrient: 'vertical',
                      }}
                    >
                      {product.description}
                    </Typography>

                    <Box sx={{ display: 'flex', alignItems: 'center', mt: 1, gap: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <InventoryIcon fontSize="small" sx={{ mr: 0.5 }} />
                        <Typography variant="body2" fontWeight="bold">
                          {product.quantite_commande}
                        </Typography>
                      </Box>
                      <Box>
                        <Chip
                          label={product.code_bare}
                          size="small"
                          sx={{
                            mr: 1,
                            color: 'black',
                            backgroundColor: grey[500],
                            fontWeight: 'bold',
                            height: 20
                          }}
                        />
                      </Box>
                      <Typography variant="h6" color="primary" fontWeight="bold">
                        {formatPrice(product.prix_unitaire)}
                      </Typography>
                    </Box>
                  </Box>

                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Tooltip title="Modifier" arrow>
                      <IconButton
                        size="small"
                        color="primary"
                        onClick={() => onEdit(product)}
                        sx={{ boxShadow: 1 }}
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Supprimer" arrow>
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => {
                          setOpenDialog(true);
                          setProductToDelete(product); // Passer le produit à supprimer
                        }}
                        sx={{ boxShadow: 1 }}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </Box>
              </Fade>
            </React.Fragment>
          ))
        ) : (
          <Box sx={{ p: 4, textAlign: 'center' }}>
            <Typography variant="h6" color="text.secondary">
              Aucun produit trouvé
            </Typography>
          </Box>
        )}

        {!isSearchActive && filteredProducts.length > 0 && (
          <Box sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            pt: 2,
            borderTop: 1,
            borderColor: 'divider',
            px: 2,
            py: 1.5
          }}>
            <Typography variant="body2" color="text.secondary">
              Affichage de {indexOfFirstProduct + 1} à {Math.min(indexOfLastProduct, filteredProducts.length)} sur {filteredProducts.length} produits
            </Typography>
            <Pagination
              count={totalPages}
              color="primary"
              page={currentPage}
              onChange={(event, value) => setCurrentPage(value)}
              size="small"
            />
          </Box>
        )}
      </Paper>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle textAlign='center' fontWeight='bold'>Confirmer la suppression</DialogTitle>
        <DialogContent>
          <Typography>
            Êtes-vous sûr de vouloir supprimer cet emplacement ? Cette action est irréversible.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)} color="black" variant="outlined">
            Annuler
          </Button>
          <Button onClick={handleDeleteConfirmed} color="error"  variant="contained">
            Supprimer
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ShowProduct;
