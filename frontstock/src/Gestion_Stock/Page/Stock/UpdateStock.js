import React, { useState, useEffect } from 'react';
import { TextField, Button, Box, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { updateStock } from '../../Api/ApiStock';
import { getAllProduits } from '../../Api/ApiProduct';
import { getAllLocations } from '../../Api/ApiLocation';

const UpdateStock = ({ selectedStock, onClose, fetchStocks }) => {
  const [productId, setProductId] = useState('');
  const [locationId, setLocationId] = useState('');
  const [quantiteImporte, setQuantiteImporte] = useState('');
  const [quantiteReserver, setQuantiteReserver] = useState('');
  const [seuilReapprovisionnement, setSeuilReapprovisionnement] = useState('');
  const [dateExpiration, setDateExpiration] = useState('');
  const [products, setProducts] = useState([]);
  const [locations, setLocations] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const produits = await getAllProduits();
      const emplacements = await getAllLocations();
      setProducts(produits);
      setLocations(emplacements);
    };
    fetchData();

    if (selectedStock) {
      setProductId(selectedStock.produit_id);
      setLocationId(selectedStock.emplacement_id);
      setQuantiteImporte(selectedStock.quantiteImporte);
      setQuantiteReserver(selectedStock.quantiteReserver);
      setSeuilReapprovisionnement(selectedStock.seuilReapprovisionnement);
      setDateExpiration(selectedStock.dateExpiration);
    }
  }, [selectedStock]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const updatedStock = {
        id: selectedStock.id,
        produit_id: Number(productId),
        emplacement_id: Number(locationId),
        quantite_importe: Number(quantiteImporte),
        quantite_reserver: Number(quantiteReserver),
        seuil_reapprovisionnement: Number(seuilReapprovisionnement),
        date_expiration: dateExpiration,
      };

      await updateStock(updatedStock);
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
        <FormControl required fullWidth>
          <InputLabel>Produit</InputLabel>
          <Select value={productId} onChange={(e) => setProductId(e.target.value)} label="Produit">
            {products.map((product) => (
              <MenuItem key={product.id} value={product.id}>
                {product.nom}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl required fullWidth>
          <InputLabel>Emplacement</InputLabel>
          <Select value={locationId} onChange={(e) => setLocationId(e.target.value)} label="Emplacement">
            {locations.map((location) => (
              <MenuItem key={location.id} value={location.id}>
                {location.nom}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

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
