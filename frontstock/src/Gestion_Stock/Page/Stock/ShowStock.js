import React, { useState, useEffect } from 'react';
import {
  Box, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, IconButton,
  TextField, InputAdornment, Pagination, Typography,
  Dialog, DialogTitle, DialogContent, DialogActions, Button
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon, Search as SearchIcon } from '@mui/icons-material';

const ShowStock = ({ stocks, onEdit, onDelete }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 5;
  
  const [openDialog, setOpenDialog] = useState(false); // Dialog state
  const [selectedStockId, setSelectedStockId] = useState(null); // Stock ID to delete

  // Filtrage des stocks en fonction du terme de recherche
  const filteredStocks = stocks.filter(stock => {
    const produitNom = stock.produit?.nom?.toLowerCase() || '';
    const emplacementNom = stock.emplacement?.nom?.toLowerCase() || '';
    const term = searchTerm.toLowerCase();
    return produitNom.includes(term) || emplacementNom.includes(term);
  });

  // Calcul des pages
  const indexOfLast = currentPage * rowsPerPage;
  const indexOfFirst = indexOfLast - rowsPerPage;
  const currentStocks = filteredStocks.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredStocks.length / rowsPerPage);

  useEffect(() => {
    setCurrentPage(1); // Réinitialiser la pagination lors de la recherche
  }, [searchTerm]);

  // Variable pour savoir si la recherche est active
  const isSearchActive = searchTerm.length > 0;

  // Fonction pour ouvrir la boîte de dialogue avec l'ID du stock à supprimer
  const confirmDelete = (id) => {
    setSelectedStockId(id);
    setOpenDialog(true);
  };

  // Fonction qui se déclenche lorsque l'utilisateur confirme la suppression
  const handleDeleteConfirmed = () => {
    onDelete(selectedStockId);
    setOpenDialog(false);
  };

  return (
    <Box>
      {/* Barre de recherche */}
      <Paper elevation={2} sx={{ p: 2, mb: 3, display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderRadius: 2 }}>
        <TextField
          size="small"
          placeholder="Rechercher par produit ou emplacement..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="action" />
              </InputAdornment>
            ),
          }}
        />
      </Paper>

      {/* Tableau des stocks */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Produit</TableCell>
              <TableCell>Emplacement</TableCell>
              <TableCell>Quantité Importée</TableCell>
              <TableCell>Quantité Réservée</TableCell>
              <TableCell>Seuil Réapprovisionnement</TableCell>
              <TableCell>Date d'expiration</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {currentStocks.map((stock) => (
              <TableRow key={stock.id}>
                <TableCell>{stock.produit?.nom}</TableCell>
                <TableCell>{stock.emplacement?.nom}</TableCell>
                <TableCell>{stock.quantite_importe}</TableCell>
                <TableCell>{stock.quantite_reserver}</TableCell>
                <TableCell>{stock.seuil_reapprovisionnement}</TableCell>
                <TableCell>{stock.date_expiration}</TableCell>
                <TableCell align="right">
                  <IconButton onClick={() => onEdit(stock)}>
                    <EditIcon color="primary" />
                  </IconButton>
                  <IconButton onClick={() => confirmDelete(stock.id)}>
                    <DeleteIcon color="error" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
            {currentStocks.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  Aucun stock trouvé.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        {/* Pagination */}
        {(!isSearchActive || totalPages > 0) && (
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
              Affichage de {indexOfFirst + 1} à {Math.min(indexOfLast, filteredStocks.length)} sur {filteredStocks.length} produits
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
      </TableContainer>

      {/* Dialog de confirmation de suppression */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle textAlign="center" fontWeight="bold">
          Confirmer la suppression
        </DialogTitle>
        <DialogContent>
          <Typography>
            Êtes-vous sûr de vouloir supprimer ce stock ? Cette action est irréversible.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)} variant="outlined" color='black'>
            Annuler
          </Button>
          <Button onClick={handleDeleteConfirmed} color="error" variant="contained">
            Supprimer
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ShowStock;
