import React, { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  Card,
  CardContent,
  CircularProgress,
  Grid,
  Box,
  Chip,
  Divider,
  Avatar,
  Paper,
  Stack,
  CardActionArea,
  Collapse,
  IconButton
} from '@mui/material';
import {
  Phone as PhoneIcon,
  Email as EmailIcon,
  LocationOn as LocationIcon,
  ExpandMore as ExpandMoreIcon,
  Store as StoreIcon
} from '@mui/icons-material';

function ShowProviders() {
  const [fournisseurs, setFournisseurs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [produits, setProduits] = useState([]);
  const [fournisseurSelectionne, setFournisseurSelectionne] = useState(null);

  useEffect(() => {
    fetch('https://f51dcef7-9501-4d82-8f54-e7c3a58b9e07.mock.pstmn.io/fournisseurs')
      .then((response) => response.json())
      .then((data) => {
        setFournisseurs(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Erreur lors du chargement des fournisseurs:', error);
        setLoading(false);
      });
  }, []);

  const handleCardClick = (fournisseur) => {
    // Si le même fournisseur est cliqué à nouveau, on le désélectionne
    if (fournisseurSelectionne && fournisseurSelectionne.id === fournisseur.id) {
      setFournisseurSelectionne(null);
      setProduits([]);
      return;
    }
    
    setFournisseurSelectionne(fournisseur);
    fetch('https://9d70f52b-163f-44c9-9342-c3633b305405.mock.pstmn.io/produits')
      .then((response) => response.json())
      .then((data) => {
        const produitsFiltrés = data.filter(
          (produit) => produit.fournisseurId === fournisseur.id
        );
        setProduits(produitsFiltrés);
      })
      .catch((error) => {
        console.error('Erreur lors du chargement des produits:', error);
      });
  };

  // Générer une couleur aléatoire stable pour un fournisseur
  const getSupplierColor = (id) => {
    const colors = ['#3f51b5', '#f50057', '#009688', '#ff9800', '#673ab7', '#4caf50', '#e91e63'];
    return colors[id % colors.length];
  };

  // Obtenir les initiales à partir du nom
  const getInitials = (name) => {
    return name.split(' ').map(word => word[0]).join('').toUpperCase();
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 2 }}>
        <StoreIcon fontSize="large" color="primary" />
        <Typography variant="h4" component="h1" fontWeight="bold">
          Répertoire des Fournisseurs
        </Typography>
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 8 }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          <Grid container spacing={3}>
            {fournisseurs.map((fournisseur) => (
              <Grid item xs={12} sm={6} md={4} key={fournisseur.id}>
                <Card 
                  elevation={fournisseurSelectionne?.id === fournisseur.id ? 4 : 1}
                  sx={{ 
                    borderRadius: 2,
                    height: '100%',
                    transition: 'all 0.3s ease',
                    border: fournisseurSelectionne?.id === fournisseur.id ? `2px solid ${getSupplierColor(fournisseur.id)}` : 'none'
                  }}
                >
                  <CardActionArea onClick={() => handleCardClick(fournisseur)} sx={{ height: '100%' }}>
                    <CardContent sx={{ p: 3 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Avatar
                          sx={{ 
                            bgcolor: getSupplierColor(fournisseur.id),
                            width: 56,
                            height: 56,
                            mr: 2
                          }}
                        >
                          {getInitials(fournisseur.nom)}
                        </Avatar>
                        <Box>
                          <Typography variant="h6" fontWeight="bold">
                            {fournisseur.nom}
                          </Typography>
                          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                            Depuis {new Date(fournisseur.dateEnregistrement).toLocaleDateString()}
                          </Typography>
                        </Box>
                      </Box>
                      
                      <Divider sx={{ mb: 2 }} />
                      
                      <Stack spacing={1.5}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <EmailIcon fontSize="small" color="action" />
                          <Typography variant="body2" noWrap>{fournisseur.email}</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <PhoneIcon fontSize="small" color="action" />
                          <Typography variant="body2">{fournisseur.telephone}</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <LocationIcon fontSize="small" color="action" />
                          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                            {fournisseur.adresse}, {fournisseur.pays}
                          </Typography>
                        </Box>
                      </Stack>
                      
                      <Chip 
                        label={fournisseurSelectionne?.id === fournisseur.id ? "Sélectionné" : "Voir les produits"} 
                        size="small" 
                        color={fournisseurSelectionne?.id === fournisseur.id ? "primary" : "default"}
                        sx={{ mt: 2 }} 
                      />
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Grid>
            ))}
          </Grid>

          <Collapse in={Boolean(fournisseurSelectionne)} sx={{ mt: 4 }}>
            <Paper elevation={2} sx={{ p: 3, borderRadius: 2, bgcolor: '#f9f9f9' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h5" fontWeight="bold" color="primary">
                  Produits de {fournisseurSelectionne?.nom}
                </Typography>
                <IconButton onClick={() => setFournisseurSelectionne(null)}>
                  <ExpandMoreIcon />
                </IconButton>
              </Box>

              {produits.length === 0 ? (
                <Typography sx={{ textAlign: 'center', py: 4, color: 'text.secondary' }}>
                  Aucun produit disponible pour ce fournisseur.
                </Typography>
              ) : (
                <Grid container spacing={2}>
                  {produits.map((produit) => (
                    <Grid item xs={12} sm={6} md={4} key={produit.id}>
                      <Card sx={{ height: '100%', borderRadius: 2 }}>
                        <CardContent>
                          <Typography variant="h6" gutterBottom fontWeight="medium">
                            {produit.nom}
                          </Typography>
                          
                          <Chip 
                            label={produit.categorie} 
                            size="small" 
                            sx={{ mb: 2, bgcolor: getSupplierColor(produit.id), color: 'white' }}
                          />
                          
                          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                            {produit.description}
                          </Typography>
                          
                          <Typography variant="h6" color="primary" fontWeight="bold">
                            {produit.prixUnitaire} MAD
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              )}
            </Paper>
          </Collapse>
        </>
      )}
    </Container>
  );
}

export default ShowProviders;