import React, { useState, useEffect } from 'react';
import {
  TextField, Button, MenuItem, Grid, InputLabel,
  Select, FormControl, Typography, Paper, Box, 
  Divider, Chip, Alert, CircularProgress, Container, CardActions
} from '@mui/material';
import {
  Close, Save, CompareArrows
} from '@mui/icons-material';

import { getAllStocks } from '../../Api/ApiStock';
import { getAllLocations } from '../../Api/ApiLocation';
import { createMovement } from '../../Api/ApiMovementStock';
import { toast } from 'react-toastify';

const AddMovement = ({ onMovementAdded, onClose }) => {
  const [stocks, setStocks] = useState([]);
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    utilisateur_id: 'admin123',
    date_mouvement: new Date().toISOString().split('T')[0],
    quantite: '',
    type: 'TRANSFERT',
    stock: null,
    emplacement_source: null,
    emplacement_destination: ''
  });

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [stocksData, locationsData] = await Promise.all([
          getAllStocks(),
          getAllLocations()
        ]);
        setStocks(stocksData);
        setLocations(locationsData);
        setError(null);
      } catch (err) {
        setError("Erreur lors du chargement des données");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleStockChange = (e) => {
    const stockId = parseInt(e.target.value);
    const selectedStock = stocks.find(s => s.id === stockId);
    setFormData(prev => ({
      ...prev,
      stock: { id: stockId },
      emplacement_source: selectedStock?.emplacement || null,
      emplacement_destination: ''
    }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    try {
      const payload = {
        ...formData,
        quantite: parseInt(formData.quantite),
        stock: { id: formData.stock.id },
        emplacement_source: { id: formData.emplacement_source?.id },
        emplacement_destination: { id: parseInt(formData.emplacement_destination) }
      };
      await createMovement(payload);
      setSuccess(true);
      toast.success('Mouvement ajouté avec succès');
      setTimeout(() => {
        onMovementAdded();
        onClose();
      }, 1500);
    } catch (err) {
      setError("Erreur lors de l'ajout du mouvement");
      toast.error("Échec de l'ajout du mouvement");
    } finally {
      setLoading(false);
    }
  };

  const isFormValid = () =>
    formData.stock && formData.emplacement_source && formData.emplacement_destination !== '' && formData.quantite > 0;

  if (loading && !error && !success) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="300px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="md">
      <FormControl fullWidth sx={{ mb: 2 }}>
        <InputLabel id="stock-label">Stock</InputLabel>
        <Select
          labelId="stock-label"
          name="stock"
          value={formData.stock?.id || ''}
          onChange={handleStockChange}
          label="Stock"
          disabled={loading}
        >
          {stocks.map(stock => (
            <MenuItem key={stock.id} value={stock.id}>
              {stock.produit?.nom || 'Produit'} (ID: {stock.id}) - QT: {stock.quantite_importe}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <TextField
        label="Date du Mouvement"
        type="date"
        name="date_mouvement"
        value={formData.date_mouvement}
        onChange={handleChange}
        fullWidth
        sx={{ mt: 2 }}
        InputLabelProps={{ shrink: true }}
        disabled={loading}
      />


     
          
            <TextField 
              label="Emplacement Source"
              value={formData.emplacement_source?.nom || ''}
              disabled
              width="40%"
              sx={{ mt: 3, mr: 2.5 }}
              helperText="Emplacement actuel du stock"
            />
          

            <CompareArrows sx={{ fontSize: 40 ,mt:3,mr:2.5 }}  />

          
            <FormControl sx={{  width: '40%' ,mt: 3 }}>
            <InputLabel id="Emplacement-label">Emplacement Destination</InputLabel>
              <Select
                labelId="destination-label"
                name="emplacement_destination"
                value={formData.emplacement_destination}
                onChange={handleChange}
                label="Emplacement Destination"
                disabled={loading || !formData.emplacement_source}
                
              >
                {locations
                  .filter(loc => loc.id !== formData.emplacement_source?.id)
                  .map(loc => (
                    <MenuItem key={loc.id} value={loc.id}>
                      {loc.nom}
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>
          

      <TextField
        label="Quantité"
        type="number"
        name="quantite"
        value={formData.quantite}
        onChange={handleChange}
        fullWidth
        sx={{ mt: 3 }}
        error={formData.quantite !== '' && parseInt(formData.quantite) <= 0}
        helperText={formData.quantite !== '' && parseInt(formData.quantite) <= 0 ? "La quantité doit être > 0" : ""}
        disabled={loading}
      />

      <FormControl fullWidth sx={{ mt: 4,justifyContent: 'flex-end' }}>
        <InputLabel id="type-label">Type</InputLabel>
        <Select
          labelId="type-label"
          name="type"
          value={formData.type}
          onChange={handleChange}
          label="Type"
          disabled
        >
          <MenuItem value="TRANSFERT">Transfert</MenuItem>
        </Select>
      </FormControl>

      <CardActions sx={{ p: 3, justifyContent: 'flex-end' }}>
        <Button 
          variant="outlined" 
          color="primary" 
          onClick={onClose}
          startIcon={<Close />}
          disabled={loading}
        >
          Annuler
        </Button>
        <Button 
          variant="contained" 
          color="primary" 
          onClick={handleSubmit}
          startIcon={<Save />}
          disabled={loading || !isFormValid()}
          sx={{ ml: 2 }}
        >
          Enregistrer
        </Button>
      </CardActions>
    </Container>
  );
};

export default AddMovement;
