import React, { useState } from 'react';
import { 
  Paper, 
  Typography, 
  IconButton,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Box,
  Tooltip,
  TextField,
  InputAdornment,
  Menu,
  MenuItem,
  Button,
  useTheme,
  Pagination,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import { 
  Edit as EditIcon, 
  Delete as DeleteIcon, 
  LocationOn as LocationIcon,
  Category as CategoryIcon,
  FilterList as FilterIcon,
  Search as SearchIcon
} from '@mui/icons-material';
import { b } from 'framer-motion/client';

const ShowLocation = ({ locations, onEdit, onDelete }) => {
  const theme = useTheme();
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Toutes');
  const [filterAnchorEl, setFilterAnchorEl] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [locationToDelete, setLocationToDelete] = useState(null);

  if (!locations || locations.length === 0) {
    return (
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column',
        alignItems: 'center', 
        justifyContent: 'center', 
        p: 6,
        height: '40vh'
      }}>
        <LocationIcon sx={{ fontSize: 60, color: 'text.disabled', mb: 2 }} />
        <Typography variant="h6" color="text.secondary">
          Aucun emplacement disponible
        </Typography>
      </Box>
    );
  }

  const handleFilterClick = (event) => {
    setFilterAnchorEl(event.currentTarget);
  };

  const handleFilterClose = () => {
    setFilterAnchorEl(null);
  };

  const handleConfirmDelete = (id) => {
    setLocationToDelete(id);
    setOpenDialog(true);
  };

  const handleDeleteConfirmed = async () => {
    if (locationToDelete) {
      await onDelete(locationToDelete);
      setOpenDialog(false);
      setLocationToDelete(null);
    }
  };

  const uniqueCategories = ['Toutes', ...Array.from(new Set(locations.map(loc => loc.type)))];

  const filteredLocations = locations.filter((location) => {
    const matchCategory = selectedCategory === 'Toutes' || location.type === selectedCategory;
    const matchSearch = searchTerm.trim() === '' || 
      (location.nom && location.nom.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchCategory && matchSearch;
  });

  const totalPages = Math.ceil(filteredLocations.length / rowsPerPage);
  const indexOfLastLocation = page * rowsPerPage;
  const indexOfFirstLocation = indexOfLastLocation - rowsPerPage;
  const currentLocations = filteredLocations.slice(indexOfFirstLocation, indexOfLastLocation);

  const getTypeColor = (type) => {
    const typeMap = {
      'entrepot': 'primary',
      'magasin': 'success',
      'boutique': 'warning',
      'depot_temporaire': 'info'
    };
    return typeMap[type?.toLowerCase()] || 'default';
  };

  return (
    <>
      {/* Barre de filtre et recherche */}
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
                setPage(1);
                handleFilterClose();
              }}
              sx={{
                fontWeight: selectedCategory === cat ? 'bold' : 'normal',
                color: cat !== 'Toutes' ? theme.palette.text.primary : 'blue'
              }}
            >
              {cat}
            </MenuItem>
          ))}
        </Menu>

        <TextField
          placeholder="Rechercher un emplacement..."
          size="small"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setPage(1);
          }}
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

      {/* Tableau d'affichage */}
      <Paper 
        elevation={3}
        sx={{
          overflow: 'hidden',
          borderRadius: 2,
          border: `1px solid ${theme.palette.divider}`,
        }}
      >
        <TableContainer sx={{ maxHeight: 440 }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell width="40%" sx={{ fontWeight: 'bold' }}>Nom</TableCell>
                <TableCell width="30%" sx={{ fontWeight: 'bold' }}>Adresse</TableCell>
                <TableCell width="15%" sx={{ fontWeight: 'bold' }}>Type</TableCell>
                <TableCell width="15%" align="right" sx={{ fontWeight: 'bold' }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {currentLocations.length > 0 ? (
                currentLocations.map((location) => (
                  <TableRow 
                    key={location.id}
                    hover
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  >
                    <TableCell>
                      <Typography variant="subtitle1" sx={{ fontWeight: 'medium' }}>
                        {location.nom}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <LocationIcon fontSize="small" color="action" sx={{ mr: 1 }} />
                        <Typography variant="body2">
                          {location.adresse}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip 
                        icon={<CategoryIcon fontSize="small" />}
                        label={location.type} 
                        size="small" 
                        color={getTypeColor(location.type)}
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell align="right">
                      <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <Tooltip title="Modifier" placement="top">
                          <IconButton 
                            size="small" 
                            color="primary"
                            onClick={() => onEdit(location)}
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Supprimer" placement="top">
                          <IconButton 
                            size="small" 
                            color="error"
                            onClick={() => handleConfirmDelete(location.id)}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4}>
                    <Box sx={{ p: 4, textAlign: 'center' }}>
                      <Typography variant="h6" color="text.secondary" fontWeight='bold'>
                        Aucun emplacement trouvé
                      </Typography>
                    </Box>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Pagination */}
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
            Affichage de {filteredLocations.length === 0 ? 0 : indexOfFirstLocation + 1} à {Math.min(indexOfLastLocation, filteredLocations.length)} sur {filteredLocations.length} emplacements
          </Typography>
          <Pagination 
            count={totalPages} 
            page={page} 
            onChange={(e, value) => setPage(value)}
            color="primary"
            size="small"
          />
        </Box>
      </Paper>

      {/* Dialog de confirmation */}
      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
      >
        <DialogTitle>Confirmer la suppression</DialogTitle>
        <DialogContent>
          <Typography>Êtes-vous sûr de vouloir supprimer cet emplacement ? Cette action est irréversible.</Typography>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => setOpenDialog(false)} 
            color="inherit"
            variant="outlined"
          >
            Annuler
          </Button>
          <Button
            onClick={handleDeleteConfirmed}
            color="error"
            variant="contained"
          >
            Supprimer
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ShowLocation;
