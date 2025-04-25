import React, { useState, useRef, useEffect } from 'react';
import {
  TextField,
  Button,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Typography,
  Box,
} from '@mui/material';

const AddProductForm = () => {
  const [product, setProduct] = useState({
    barcode: '',
    fournisseurId: '',
    produitId: '',
  });

  const [fournisseurs, setFournisseurs] = useState([]);
  const [produitsFournisseur, setProduitsFournisseur] = useState([]);
  const [produitSelectionne, setProduitSelectionne] = useState(null);

  const [scanning, setScanning] = useState(false);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [stream, setStream] = useState(null);

  useEffect(() => {
    fetch('https://f51dcef7-9501-4d82-8f54-e7c3a58b9e07.mock.pstmn.io/fournisseurs')
      .then(res => res.json())
      .then(data => setFournisseurs(data))
      .catch(err => console.error('Erreur chargement fournisseurs:', err));
  }, []);

  useEffect(() => {
    if (product.fournisseurId) {
      fetch('https://f51dcef7-9501-4d82-8f54-e7c3a58b9e07.mock.pstmn.io/produits')
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

  useEffect(() => {
    const selected = produitsFournisseur.find(p => p.id === Number(product.produitId));
    setProduitSelectionne(selected || null);
  }, [product.produitId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Product à enregistrer:', { ...product, ...produitSelectionne });
    // Appel API ici
  };

  const handleCancel = () => {
    setProduct({ barcode: '', fournisseurId: '', produitId: '' });
    setProduitSelectionne(null);
    setProduitsFournisseur([]);
  };

  const startScanning = async () => {
    try {
      const constraints = { video: { facingMode: 'environment' } };
      const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        videoRef.current.play();
      }
      setScanning(true);
    } catch (err) {
      console.error("Erreur caméra:", err);
    }
  };

  const stopScanning = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setScanning(false);
  };

  const simulateBarcodeScan = () => {
    setTimeout(() => {
      const fakeBarcode = Math.floor(Math.random() * 9000000000000) + 1000000000000;
      setProduct(prev => ({ ...prev, barcode: fakeBarcode.toString() }));
      stopScanning();
    }, 2000);
  };

  useEffect(() => {
    if (scanning) {
      simulateBarcodeScan();
    }
  }, [scanning]);

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Ajouter un produit existant (par fournisseur)
      </Typography>

      <form onSubmit={handleSubmit}>
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
            <TextField
              label="Nom"
              value={produitSelectionne.nom}
              fullWidth
              margin="normal"
              disabled
            />
            <TextField
              label="Description"
              value={produitSelectionne.description}
              fullWidth
              margin="normal"
              multiline
              rows={3}
              disabled
            />
            <TextField
              label="Catégorie"
              value={produitSelectionne.categorie}
              fullWidth
              margin="normal"
              disabled
            />
            <TextField
              label="Prix Unitaire (MAD)"
              value={produitSelectionne.prixUnitaire}
              fullWidth
              margin="normal"
              disabled
            />
          </>
        )}

        <TextField
          label="Code-barres"
          name="barcode"
          value={product.barcode}
          onChange={handleChange}
          fullWidth
          margin="normal"
          required
        />

        <Button
          variant="outlined"
          onClick={scanning ? stopScanning : startScanning}
          sx={{ mb: 2 }}
        >
          {scanning ? 'Arrêter le scan' : 'Scanner'}
        </Button>

        {scanning && (
          <Box sx={{ mb: 2 }}>
            <video ref={videoRef} style={{ width: '100%' }}></video>
            <canvas ref={canvasRef} style={{ display: 'none' }}></canvas>
            <Typography variant="body2" color="text.secondary">
              Scannez le code-barres avec votre caméra...
            </Typography>
          </Box>
        )}

        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
          <Button variant="outlined" color="secondary" onClick={handleCancel}>
            Annuler
          </Button>
          <Button variant="contained" type="submit">
            Enregistrer le produit
          </Button>
        </Box>
      </form>
    </Box>
  );
};

export default AddProductForm;
