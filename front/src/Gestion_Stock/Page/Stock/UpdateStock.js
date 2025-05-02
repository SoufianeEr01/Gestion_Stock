import React, { useState, useEffect } from 'react';
import { TextField, Button, Box } from '@mui/material';
import { updateStock } from '../../Api/ApiStock';

const UpdateStock = ({ selectedStock, onClose, fetchStocks }) => {
  const [quantiteImporte, setQuantiteImporte] = useState('');
  const [quantiteReserver, setQuantiteReserver] = useState('');
  const [seuilReapprovisionnement, setSeuilReapprovisionnement] = useState('');
  const [dateExpiration, setDateExpiration] = useState('');

  useEffect(() => {
    if (selectedStock) {
      setQuantiteImporte(selectedStock.quantite_importe);
      setQuantiteReserver(selectedStock.quantite_reserver);
      setSeuilReapprovisionnement(selectedStock.seuil_reapprovisionnement);
      setDateExpiration(selectedStock.date_expiration);
    }
    console.log('selectedStock:', selectedStock);
  }, [selectedStock]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const updatedStock = {
        produit :{ id: selectedStock.produit?.id},
        emplacement :{ id : selectedStock.emplacement?.id} ,
        quantite_importe: Number(quantiteImporte),
        quantite_reserver: Number(quantiteReserver),
        seuil_reapprovisionnement: Number(seuilReapprovisionnement),
        date_expiration: dateExpiration,
      };

      await updateStock(selectedStock.id,updatedStock);
      fetchStocks();
      onClose();
      console.log('Stock mis à jour :', updatedStock);
    } catch (error) {
      console.error('Erreur lors de la mise à jour du stock :', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Box display="flex" flexDirection="column" gap={2}>

        <TextField
          label="Produit"
          value={selectedStock?.produit?.nom || ''}
          InputProps={{ readOnly: true }}
          fullWidth
          disabled
        />

        <TextField
          label="Emplacement"
          value={selectedStock?.emplacement?.nom || ''}
          InputProps={{ readOnly: true }}
          fullWidth
          disabled
        />

        <TextField
          label="Quantité Importée"
          type="number"
          value={quantiteImporte}
          onChange={(e) => setQuantiteImporte(e.target.value)}
          required
          fullWidth
        />

        <TextField
          label="Quantité Réservée"
          type="number"
          value={quantiteReserver}
          onChange={(e) => setQuantiteReserver(e.target.value)}
          required
          fullWidth
        />

        <TextField
          label="Seuil de Réapprovisionnement"
          type="number"
          value={seuilReapprovisionnement}
          onChange={(e) => setSeuilReapprovisionnement(e.target.value)}
          required
          fullWidth
        />

        <TextField
          label="Date d'Expiration"
          type="date"
          value={dateExpiration}
          onChange={(e) => setDateExpiration(e.target.value)}
          InputLabelProps={{ shrink: true }}
          required
          fullWidth
        />

        <Box display="flex" justifyContent="flex-end" gap={2} mt={3}>
          <Button variant="outlined" onClick={onClose}>Annuler</Button>
          <Button variant="contained" type="submit">Modifier</Button>
        </Box>
      </Box>
    </form>
  );
};

export default UpdateStock;
