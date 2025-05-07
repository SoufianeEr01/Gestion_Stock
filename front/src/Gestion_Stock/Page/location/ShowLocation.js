import React, { useEffect, useState } from 'react';
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

const ShowLocation = ({ locations, onEdit, onDelete }) => {
  const theme = useTheme();
  const [page, setPage] = useState(1);
  const [rowsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Toutes');
  const [filterAnchorEl, setFilterAnchorEl] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [locationToDelete, setLocationToDelete] = useState(null);

  // Extraction des catégories uniques
  const uniqueCategories = ['Toutes', ...new Set(locations.map(loc => loc.type))];

  // Filtrage

  useEffect(() => {
  }, [locations]);

  const filtered = locations.filter((loc) => {
    const matchCat = selectedCategory === 'Toutes' || loc.type === selectedCategory;
    const matchSearch = loc.nom?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchCat && matchSearch;
  });

  const totalPages = Math.ceil(filtered.length / rowsPerPage);
  const paginated = filtered.slice((page - 1) * rowsPerPage, page * rowsPerPage);

  const getColor = (type) => {
    const map = {
      entrepot: 'primary',
      magasin: 'success',
      boutique: 'warning',
      depot_temporaire: 'info'
    };
    return map[type?.toLowerCase()] || 'default';
  };

  const handleDelete = async () => {
    if (locationToDelete) {
      await onDelete(locationToDelete);
      setLocationToDelete(null);
      setOpenDialog(false);
    }
  };

  return (
    <>
      {/* Barre de filtre */}
      <Paper sx={{ p: 2, mb: 3, display: 'flex', flexWrap: 'wrap', gap: 2, alignItems: 'center', justifyContent: 'space-between' }}>
        <Button
          variant="outlined"
          startIcon={<FilterIcon />}
          onClick={(e) => setFilterAnchorEl(e.currentTarget)}
        >
          {selectedCategory === 'Toutes' ? 'Toutes catégories' : selectedCategory}
        </Button>

        <Menu
          anchorEl={filterAnchorEl}
          open={Boolean(filterAnchorEl)}
          onClose={() => setFilterAnchorEl(null)}
        >
          {uniqueCategories.map((cat) => (
            <MenuItem
              key={cat}
              selected={cat === selectedCategory}
              onClick={() => {
                setSelectedCategory(cat);
                setPage(1);
                setFilterAnchorEl(null);
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
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            )
          }}
        />
      </Paper>

      {/* Tableau */}
      <Paper elevation={3}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell><strong>Nom</strong></TableCell>
                <TableCell><strong>Adresse</strong></TableCell>
                <TableCell><strong>Type</strong></TableCell>
                <TableCell align="right"><strong>Actions</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginated.length > 0 ? paginated.map((loc) => (
                <TableRow key={loc.id} hover>
                  <TableCell>{loc.nom}</TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <LocationIcon fontSize="small" sx={{ mr: 1 }} />
                      {loc.adresse}
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip
                      icon={<CategoryIcon fontSize="small" />}
                      label={loc.type}
                      size="small"
                      color={getColor(loc.type)}
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell align="right">
                    <Tooltip title="Modifier">
                      <IconButton onClick={() => onEdit(loc)} color="primary">
                        <EditIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Supprimer">
                      <IconButton onClick={() => { setLocationToDelete(loc.id); setOpenDialog(true); }} color="error">
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              )) : (
                <TableRow>
                  <TableCell colSpan={4}>
                    <Typography align="center" color="text.secondary" sx={{ p: 3 }}>
                      Aucun emplacement trouvé.
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Pagination */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', p: 2 }}>
          <Typography variant="body2">
            {filtered.length === 0
              ? '0 résultat'
              : `Affichage de ${(page - 1) * rowsPerPage + 1} à ${Math.min(page * rowsPerPage, filtered.length)} sur ${filtered.length} emplacements`}
          </Typography>
          <Pagination
            count={totalPages}
            page={page}
            onChange={(e, val) => setPage(val)}
            color="primary"
            size="small"
          />
        </Box>
      </Paper>

      {/* Dialog de suppression */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Confirmer la suppression</DialogTitle>
        <DialogContent>
          <Typography>Êtes-vous sûr de vouloir supprimer cet emplacement ?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Annuler</Button>
          <Button color="error" variant="contained" onClick={handleDelete}>Supprimer</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ShowLocation;
