import React, { useState, useEffect } from 'react';
import { TextField, Button, MenuItem, Select, InputLabel, FormControl, Box } from '@mui/material';
import { createProduit } from '../../Api/ApiProduct'; // Assurez-vous que le chemin est correct

const AddProduct = ({ onProductAdded, onClose, fetchProducts }) => {
  const [product, setProduct] = useState({
    fournisseurId: '',
    produitId: '',
    quantite_commande: '',
    code_bare: '',
    id_fournisseur: '' // Ajout du champ id_fournisseur
  });

  const [fournisseurs, setFournisseurs] = useState([]);
  const [produitsFournisseur, setProduitsFournisseur] = useState([]);
  const [produitSelectionne, setProduitSelectionne] = useState(null);

  // Récupérer les fournisseurs
  useEffect(() => {
    fetch('https://f51dcef7-9501-4d82-8f54-e7c3a58b9e07.mock.pstmn.io/fournisseurs')
      .then(res => res.json())
      .then(data => setFournisseurs(data))
      .catch(err => console.error('Erreur chargement fournisseurs:', err));
  }, []);

  // Récupérer les produits du fournisseur sélectionné
  useEffect(() => {
    if (product.fournisseurId) {
      fetch('https://9d70f52b-163f-44c9-9342-c3633b305405.mock.pstmn.io/produits')
        .then(res => res.json())
        .then(data => {
          const filtres = data.filter(p => p.fournisseurId === Number(product.fournisseurId));
          setProduitsFournisseur(filtres);
        })
        .catch(err => console.error('Erreur chargement produits:', err));
    } else {
      setProduitsFournisseur([]);
    }
    setProduitSelectionne(null);
    setProduct(prev => ({ ...prev, produitId: '' }));
  }, [product.fournisseurId]);

  // Sélectionner le produit
  useEffect(() => {
    const selected = produitsFournisseur.find(p => p.id === Number(product.produitId));
    setProduitSelectionne(selected || null);
  }, [product.produitId, produitsFournisseur]);

  // Gérer les changements de formulaire
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct(prev => ({ ...prev, [name]: value }));
  };

  // Soumettre le formulaire
  // Modifié : fonction handleSubmit pour fermer le modal et rafraîchir la liste des produits
const handleSubmit = async (e) => {
  e.preventDefault();
  if (produitSelectionne && product.quantite_commande) {
    const newProduct = {
      nom: produitSelectionne.nom,
      description: produitSelectionne.description,
      id_fournisseur: product.fournisseurId,
      categorie: produitSelectionne.categorie,
      image: produitSelectionne.image,
      code_bare: produitSelectionne.code_bare,
      prix_unitaire: produitSelectionne.prixUnitaire,
      quantite_commande: Number(product.quantite_commande)
    };

    try {
      await createProduit(newProduct); // appel API pour ajouter un produit
      onProductAdded(newProduct);  // Callback après ajout
      await fetchProducts();  // Rafraîchir les produits
      onClose();  // Fermer le modal
    } catch (error) {
      console.error('Erreur création produit:', error);
    }
  }
};


  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
      <FormControl fullWidth margin="normal" required>
        <InputLabel id="fournisseur-label">Fournisseur</InputLabel>
        <Select
          labelId="fournisseur-label"
          name="fournisseurId"
          value={product.fournisseurId}
          onChange={handleChange}
          label="Fournisseur"
        >
          {fournisseurs.map((f) => (
            <MenuItem key={f.id} value={f.id}>
              {f.nom}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {produitsFournisseur.length > 0 && (
        <FormControl fullWidth margin="normal" required>
          <InputLabel id="produit-label">Produit</InputLabel>
          <Select
            labelId="produit-label"
            name="produitId"
            value={product.produitId}
            onChange={handleChange}
            label="Produit"
          >
            {produitsFournisseur.map((p) => (
              <MenuItem key={p.id} value={p.id}>
                {p.nom}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      )}

      {produitSelectionne && (
        <>
          <TextField label="Nom" value={produitSelectionne.nom} margin="normal" disabled fullWidth />
          <TextField label="Description" value={produitSelectionne.description} margin="normal" disabled fullWidth multiline />
          <TextField label="Catégorie" value={produitSelectionne.categorie} margin="normal" disabled fullWidth />
          <TextField label="Prix Unitaire (MAD)" value={produitSelectionne.prixUnitaire} margin="normal" disabled fullWidth />
          <TextField label="Code Barre" value={produitSelectionne.code_bare} margin="normal" disabled fullWidth />
          <TextField label="Image" value={produitSelectionne.image} margin="normal" disabled fullWidth />
        </>
      )}

      <TextField
        label="Quantité Commandée"
        name="quantite_commande"
        value={product.quantite_commande}
        onChange={handleChange}
        fullWidth
        margin="normal"
        required
      />

      <TextField
        label="ID Fournisseur"
        name="id_fournisseur"
        value={product.fournisseurId}
        onChange={handleChange}
        fullWidth
        margin="normal"
        required
        disabled
      />

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
        <Button variant="outlined" color="primary" type="reset" sx={{ mr: 2 }} onClick={onClose}>
          Annuler
        </Button>
        <Button variant="contained" type="submit">
          Ajouter
        </Button>
      </Box>
    </Box>
  );
};

export default AddProduct;
