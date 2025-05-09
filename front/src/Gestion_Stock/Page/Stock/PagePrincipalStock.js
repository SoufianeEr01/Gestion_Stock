import React, { useState, useEffect } from 'react';
import {
  Container, Box, Typography, Button, CircularProgress, Dialog, DialogTitle,
  DialogContent, IconButton
} from '@mui/material';
import { Add as AddIcon, Close as CloseIcon } from '@mui/icons-material';
import { getAllStocks, deleteStock } from '../../Api/ApiStock';
import AddStock from './AddStock';
import ShowStock from './ShowStock';
import UpdateStock from './UpdateStock';

const PagePrincipalStock = () => {
  const [stocks, setStocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [selectedStock, setSelectedStock] = useState(null);

  const fetchStocks = async () => {
    setLoading(true);
    try {
      const data = await getAllStocks();
      setStocks(data);
    } catch (error) {
      console.error("Erreur lors de la récupération des stocks :", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStocks();
  }, []);

  const handleAddStock = () => {
    setSelectedStock(null);
    setIsAddModalOpen(true);
  };

  const handleEditStock = (stock) => {
    setSelectedStock(stock);
    setIsUpdateModalOpen(true);
  };

  const handleDeleteStock = async (id) => {
    try {
      await deleteStock(id);
      fetchStocks();
    } catch (error) {
      console.error('Erreur lors de la suppression du stock :', error);
    }
  };

  const closeAddModal = () => {
    setIsAddModalOpen(false);
  };

  const closeUpdateModal = () => {
    setIsUpdateModalOpen(false);
    setSelectedStock(null);
  };

  return (
    <Container>
      <Box sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
          <Typography variant="h5" fontWeight="bold">Gestion des Stocks</Typography>
          <Button variant="contained" color="primary" startIcon={<AddIcon />} onClick={handleAddStock}>
            Ajouter un Stock
          </Button>
        </Box>

        {loading ? (
          <Box display="flex" justifyContent="center" py={5}>
            <CircularProgress />
          </Box>
        ) : (
          <ShowStock stocks={stocks} onEdit={handleEditStock} onDelete={handleDeleteStock} />
        )}
      </Box>

      {/* Modal Ajouter */}
      <Dialog open={isAddModalOpen} onClose={closeAddModal} fullWidth maxWidth="md">
        <DialogTitle>
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            Ajouter un Stock
            <IconButton edge="end" onClick={closeAddModal} sx={{ ml: 'auto' }}>
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent dividers>
          <AddStock onStockAdded={fetchStocks} onClose={closeAddModal} />
        </DialogContent>
      </Dialog>

      {/* Modal Modifier */}
      <Dialog open={isUpdateModalOpen} onClose={closeUpdateModal} fullWidth maxWidth="md">
        <DialogTitle>
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            Modifier un Stock
            <IconButton edge="end" onClick={closeUpdateModal} sx={{ ml: 'auto' }}>
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent dividers>
          <UpdateStock selectedStock={selectedStock} onClose={closeUpdateModal} fetchStocks={fetchStocks} />
        </DialogContent>
      </Dialog>
    </Container>
  );
};

export default PagePrincipalStock;
