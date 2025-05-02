import { TextField, Box, Button, Typography, Avatar } from '@mui/material';
import React, { useState, useEffect } from 'react';
import { updateProduit } from '../../Api/ApiProduct';

const UpdateProduct = ({ selectedProduct, onClose, fetchProducts }) => {
  const [formData, setFormData] = useState({
    nom: selectedProduct?.nom || '',
    description: selectedProduct?.description || '',
    categorie: selectedProduct?.categorie || '',
    code_bare: selectedProduct?.code_bare || '',
    prix_unitaire: selectedProduct?.prix_unitaire || '',
    quantite_commande: selectedProduct?.quantite_commande || '',
    image: selectedProduct?.image || '',
  });

  const [previewUrl, setPreviewUrl] = useState(selectedProduct?.image || '');

  useEffect(() => {
    if (selectedProduct) {
      setFormData({
        nom: selectedProduct.nom || '',
        description: selectedProduct.description || '',
        categorie: selectedProduct.categorie || '',
        code_bare: selectedProduct.code_bare || '',
        prix_unitaire: selectedProduct.prix_unitaire || '',
        quantite_commande: selectedProduct.quantite_commande || '',
        image: selectedProduct.image || '',
      });
      setPreviewUrl(selectedProduct.image || '');
    }
  }, [selectedProduct]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));

    // Mettre à jour l'aperçu si l'utilisateur tape une URL d'image
    if (name === 'image') {
      setPreviewUrl(value);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await updateProduit(selectedProduct.id, formData);
      await fetchProducts(); 
      onClose();              
    } catch (error) {
      console.error('Erreur lors de la mise à jour du produit:', error);
    }
  };
  
  

  return (
    <Box component="form" noValidate sx={{ mt: 1 }} onSubmit={handleUpdate}>
      <TextField
        margin="normal"
        required
        fullWidth
        id="nom"
        label="Nom"
        name="nom"
        value={formData.nom}
        onChange={handleChange}
        disabled
      />

      <TextField
        margin="normal"
        fullWidth
        id="description"
        label="Description"
        name="description"
        multiline
        rows={3}
        value={formData.description}
        onChange={handleChange}
        disabled
      />

      <TextField
        fullWidth
        margin="normal"
        id="categorie"
        label="Catégorie"
        name="categorie"
        value={formData.categorie}
        onChange={handleChange}
        disabled
      />

      <TextField
        margin="normal"
        fullWidth
        id="code_bare"
        label="Code Barre"
        name="code_bare"
        value={formData.code_bare}
        onChange={handleChange}
        disabled
      />

      <TextField
        margin="normal"
        fullWidth
        type="number"
        id="prix_unitaire"
        label="Prix Unitaire"
        name="prix_unitaire"
        value={formData.prix_unitaire}
        onChange={handleChange}
        disabled
      />

      <TextField
        margin="normal"
        fullWidth
        type="number"
        id="quantite_commande"
        label="Quantité Commandée"
        name="quantite_commande"
        value={formData.quantite_commande}
        onChange={handleChange}
      />

      <TextField
        margin="normal"
        fullWidth
        id="image"
        label="URL de l'image"
        name="image"
        value={formData.image}
        onChange={handleChange}
      />

      {/* Aperçu de l'image */}
      <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
        <Avatar
          variant="rounded"
          src={previewUrl}
          sx={{ width: 64, height: 64 }}
        >
          {!previewUrl && (
            <Typography variant="body2" color="text.secondary">
              Aucune image
            </Typography>
          )}
        </Avatar>
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 4 }}>
        <Button
          variant="outlined"
          color="primary"
          type="button"
          sx={{ mr: 2 }}
          onClick={onClose}
        >
          Annuler
        </Button>
        <Button
          variant="contained"
          type="submit"
        >
          Modifier
        </Button>
      </Box>
    </Box>
  );
};

export default UpdateProduct;
