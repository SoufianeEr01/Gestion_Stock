import React, { useState, useEffect } from 'react';
import {
  TextField,
  Button,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import { createStock } from '../../Api/ApiStock';
import { getAllProduits } from '../../Api/ApiProduct';
import { getAllLocations } from '../../Api/ApiLocation';

const AddStock = ({ onStockAdded, onClose }) => {
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
      try {
        const produitsResponse = await getAllProduits();
        const emplacementsResponse = await getAllLocations();

        const produits = Array.isArray(produitsResponse?.data?.produits)
          ? produitsResponse.data.produits
          : Array.isArray(produitsResponse?.data)
          ? produitsResponse.data
          : Array.isArray(produitsResponse)
          ? produitsResponse
          : [];

        const emplacements = Array.isArray(emplacementsResponse?.data?.emplacements)
          ? emplacementsResponse.data.emplacements
          : Array.isArray(emplacementsResponse?.data)
          ? emplacementsResponse.data
          : Array.isArray(emplacementsResponse)
          ? emplacementsResponse
          : [];

        setProducts(produits);
        setLocations(emplacements);

        if (produits.length > 0) setProductId(produits[0].id);
        if (emplacements.length > 0) setLocationId(emplacements[0].id);
      } catch (error) {
        console.error('Erreur lors du chargement des données :', error);
      }
    };

    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!productId || !locationId || !quantiteImporte || !seuilReapprovisionnement || !dateExpiration) {
      alert('Tous les champs obligatoires doivent être remplis !');
      return;
    }

    try {
      const newStock = {
        produit: { id: Number(productId) },
        emplacement: { id: Number(locationId) },
        quantite_importe: Number(quantiteImporte),
        quantite_reserver: quantiteReserver ? Number(quantiteReserver) : 0,
        seuil_reapprovisionnement: Number(seuilReapprovisionnement),
        date_expiration: dateExpiration
      };

      await createStock(newStock);
      onStockAdded();
      onClose();
      console.log('Stock ajouté avec succès :', newStock);
    } catch (error) {
      console.error("Erreur lors de l'ajout du stock :", error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Box display="flex" flexDirection="column" gap={2}>
        <FormControl required fullWidth>
          <InputLabel id="product-select-label">Produit</InputLabel>
          <Select
            labelId="product-select-label"
            value={productId}
            onChange={(e) => setProductId(e.target.value)}
            label="Produit"
          >
            {products.length === 0 ? (
              <MenuItem disabled value="">Aucun produit</MenuItem>
            ) : (
              products.map((product) =>
                product?.id ? (
                  <MenuItem key={product.id} value={product.id}>
                    {product.nom}
                  </MenuItem>
                ) : null
              )
            )}
          </Select>
        </FormControl>

        <FormControl required fullWidth>
          <InputLabel id="location-select-label">Emplacement</InputLabel>
          <Select
            labelId="location-select-label"
            value={locationId}
            onChange={(e) => setLocationId(e.target.value)}
            label="Emplacement"
          >
            {locations.length === 0 ? (
              <MenuItem disabled value="">Aucun emplacement</MenuItem>
            ) : (
              locations.map((location) =>
                location?.id ? (
                  <MenuItem key={location.id} value={location.id}>
                    {location.nom}
                  </MenuItem>
                ) : null
              )
            )}
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
          <Button variant="contained" type="submit">Ajouter</Button>
        </Box>
      </Box>
    </form>
  );
};

export default AddStock;
