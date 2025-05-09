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
  IconButton,
  useTheme,
  alpha,
  Fade,
  Button,
  Tooltip,
  LinearProgress,
  AppBar,
  Toolbar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import {
  Phone as PhoneIcon,
  Email as EmailIcon,
  LocationOn as LocationIcon,
  ExpandMore as ExpandMoreIcon,
  ChevronRight as ChevronRightIcon,
  Store as StoreIcon,
  Refresh as RefreshIcon,
  KeyboardArrowUp as KeyboardArrowUpIcon,
  Business as BusinessIcon,
  Inventory2 as InventoryIcon,
  FilterList as FilterListIcon
} from '@mui/icons-material';

function ShowProviders() {
  const theme = useTheme();
  const [fournisseurs, setFournisseurs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [produits, setProduits] = useState([]);
  const [produitsLoading, setProduitsLoading] = useState(false);
  const [fournisseurSelectionne, setFournisseurSelectionne] = useState(null);
  const [error, setError] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const fetchFournisseurs = () => {
    setLoading(true);
    setError(null);
    
    fetch('https://f51dcef7-9501-4d82-8f54-e7c3a58b9e07.mock.pstmn.io/fournisseurs')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Erreur réseau');
        }
        return response.json();
      })
      .then((data) => {
        setFournisseurs(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Erreur lors du chargement des fournisseurs:', error);
        setError('Impossible de charger les fournisseurs. Veuillez réessayer.');
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchFournisseurs();
  }, []);

  const handleCardClick = (fournisseur) => {
    // Si le même fournisseur est cliqué à nouveau, on le désélectionne
    if (fournisseurSelectionne && fournisseurSelectionne.id === fournisseur.id) {
      setFournisseurSelectionne(null);
      setProduits([]);
      return;
    }
    
    setFournisseurSelectionne(fournisseur);
    setProduitsLoading(true);
    
    fetch('https://9d70f52b-163f-44c9-9342-c3633b305405.mock.pstmn.io/produits')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Erreur réseau');
        }
        return response.json();
      })
      .then((data) => {
        const produitsFiltrés = data.filter(
          (produit) => produit.fournisseurId === fournisseur.id
        );
        
        // Simuler un délai pour montrer le chargement
        setTimeout(() => {
          setProduits(produitsFiltrés);
          setProduitsLoading(false);
        }, 600);
      })
      .catch((error) => {
        console.error('Erreur lors du chargement des produits:', error);
        setError('Impossible de charger les produits. Veuillez réessayer.');
        setProduitsLoading(false);
      });
  };

  const handleProductDetails = (produit) => {
    setSelectedProduct(produit);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setSelectedProduct(null);
  };

  // Générer une couleur aléatoire stable pour un fournisseur
  const getSupplierColor = (id) => {
    const colors = [
      theme.palette.primary.main,
      theme.palette.secondary.main,
      '#009688',
      '#ff9800',
      '#673ab7',
      '#4caf50',
      '#e91e63'
    ];
    return colors[id % colors.length];
  };

  // Obtenir les initiales à partir du nom
  const getInitials = (name) => {
    return name.split(' ').map(word => word[0]).join('').toUpperCase();
  };

  // Formater la date en français
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('fr-FR', options);
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <>
      <AppBar position="sticky" elevation={0} color="default" sx={{ bgcolor: 'background.paper', borderBottom: `1px solid ${theme.palette.divider}` }}>
        <Toolbar>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <StoreIcon color="primary" />
            <Typography variant="h6" color="textPrimary" sx={{ fontWeight: 600 }}>
              Répertoire des Fournisseurs
            </Typography>
          </Box>
          <Box sx={{ flexGrow: 1 }} />
          <Tooltip title="Filtrer">
            <IconButton>
              <FilterListIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Actualiser">
            <IconButton onClick={fetchFournisseurs} disabled={loading}>
              <RefreshIcon />
            </IconButton>
          </Tooltip>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" component="h1" fontWeight="bold" gutterBottom>
            Découvrez nos fournisseurs
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Explorez notre réseau de partenaires commerciaux et leurs produits disponibles
          </Typography>
        </Box>

        {loading && (
          <Box sx={{ width: '100%', mb: 4 }}>
            <LinearProgress />
          </Box>
        )}

        {error && (
          <Paper 
            sx={{ 
              p: 3, 
              mb: 4, 
              bgcolor: alpha(theme.palette.error.main, 0.1),
              color: theme.palette.error.main,
              borderLeft: `4px solid ${theme.palette.error.main}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
          >
            <Typography>{error}</Typography>
            <Button 
              variant="outlined" 
              color="error" 
              startIcon={<RefreshIcon />}
              onClick={fetchFournisseurs}
            >
              Réessayer
            </Button>
          </Paper>
        )}

        {!loading && fournisseurs.length === 0 && !error && (
          <Paper sx={{ p: 5, textAlign: 'center', bgcolor: '#f9f9f9' }}>
            <BusinessIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2, opacity: 0.4 }} />
            <Typography variant="h6" color="text.secondary">
              Aucun fournisseur disponible
            </Typography>
          </Paper>
        )}

        {!loading && fournisseurs.length > 0 && (
          <>
            <Box sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
              <BusinessIcon sx={{ mr: 1, color: 'text.secondary' }} />
              <Typography variant="h6" component="h2" color="text.secondary">
                {fournisseurs.length} fournisseurs disponibles
              </Typography>
            </Box>

            <Grid container spacing={3}>
              {fournisseurs.map((fournisseur) => {
                const isSelected = fournisseurSelectionne?.id === fournisseur.id;
                const supplierColor = getSupplierColor(fournisseur.id);
                
                return (
                  <Grid item xs={12} sm={6} md={4} key={fournisseur.id}>
                    <Fade in={true} style={{ transitionDelay: `${fournisseur.id * 100}ms` }}>
                      <Card 
                        elevation={isSelected ? 6 : 1}
                        sx={{ 
                          borderRadius: 2,
                          height: '100%',
                          transition: 'all 0.3s ease',
                          transform: isSelected ? 'translateY(-4px)' : 'none',
                          position: 'relative',
                          overflow: 'visible',
                          ...(isSelected && {
                            '&:before': {
                              content: '""',
                              position: 'absolute',
                              top: 0,
                              left: 0,
                              right: 0,
                              height: '4px',
                              bgcolor: supplierColor,
                              borderRadius: '8px 8px 0 0'
                            }
                          })
                        }}
                      >
                        <CardActionArea 
                          onClick={() => handleCardClick(fournisseur)} 
                          sx={{ 
                            height: '100%',
                            p: isSelected ? 0.5 : 0
                          }}
                        >
                          <CardContent sx={{ p: 3 }}>
                            <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                              <Avatar
                                sx={{ 
                                  bgcolor: supplierColor,
                                  width: 60,
                                  height: 60,
                                  mr: 2,
                                  boxShadow: isSelected ? 3 : 1
                                }}
                              >
                                {getInitials(fournisseur.nom)}
                              </Avatar>
                              <Box>
                                <Typography variant="h6" fontWeight="bold">
                                  {fournisseur.nom}
                                </Typography>
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                                  <Typography variant="caption" sx={{ 
                                    color: 'text.secondary',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 0.5
                                  }}>
                                    Depuis {formatDate(fournisseur.dateEnregistrement)}
                                  </Typography>
                                </Box>
                                <Chip 
                                  label={fournisseur.pays} 
                                  size="small" 
                                  variant="outlined"
                                  icon={<LocationIcon style={{ fontSize: 14 }} />}
                                  sx={{ 
                                    height: 24,
                                    '& .MuiChip-label': { px: 1, fontSize: '0.7rem' }
                                  }} 
                                />
                              </Box>
                            </Box>
                            
                            <Divider sx={{ mb: 2 }} />
                            
                            <Stack spacing={2}>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <EmailIcon fontSize="small" sx={{ color: supplierColor, opacity: 0.8 }} />
                                <Typography variant="body2" noWrap>{fournisseur.email}</Typography>
                              </Box>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <PhoneIcon fontSize="small" sx={{ color: supplierColor, opacity: 0.8 }} />
                                <Typography variant="body2">{fournisseur.telephone}</Typography>
                              </Box>
                              <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                                <LocationIcon fontSize="small" sx={{ color: supplierColor, opacity: 0.8, mt: 0.5 }} />
                                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                  {fournisseur.adresse}
                                </Typography>
                              </Box>
                            </Stack>
                            
                            <Box sx={{ 
                              display: 'flex', 
                              justifyContent: 'space-between', 
                              alignItems: 'center',
                              mt: 2
                            }}>
                              <Chip 
                                label={isSelected ? "Sélectionné" : "Voir les produits"} 
                                size="small" 
                                color={isSelected ? "primary" : "default"}
                                variant={isSelected ? "filled" : "outlined"}
                                sx={{ 
                                  borderRadius: '16px',
                                  '& .MuiChip-label': { px: 1.5 }
                                }}
                                icon={isSelected ? <ExpandMoreIcon /> : <ChevronRightIcon />}
                              />
                              {isSelected && produitsLoading && (
                                <CircularProgress size={24} color="primary" />
                              )}
                            </Box>
                          </CardContent>
                        </CardActionArea>
                      </Card>
                    </Fade>
                  </Grid>
                );
              })}
            </Grid>

            <Collapse in={Boolean(fournisseurSelectionne)} sx={{ mt: 4 }}>
              <Paper 
                elevation={3} 
                sx={{ 
                  p: 0, 
                  borderRadius: 3, 
                  overflow: 'hidden',
                  boxShadow: theme => `0 10px 30px ${alpha(theme.palette.primary.main, 0.1)}`,
                  border: theme => `1px solid ${alpha(theme.palette.primary.main, 0.1)}`
                }}
              >
                <Box 
                  sx={{ 
                    p: 3, 
                    bgcolor: theme => alpha(theme.palette.primary.main, 0.05),
                    borderBottom: theme => `1px solid ${alpha(theme.palette.primary.main, 0.1)}`
                  }}
                >
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Avatar
                        sx={{ 
                          bgcolor: getSupplierColor(fournisseurSelectionne?.id || 0),
                          width: 48,
                          height: 48
                        }}
                      >
                        {getInitials(fournisseurSelectionne?.nom || "")}
                      </Avatar>
                      
                      <Box>
                        <Typography variant="h5" fontWeight="bold" color="primary">
                          {fournisseurSelectionne?.nom}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Catalogue de produits
                        </Typography>
                      </Box>
                    </Box>
                    
                    <IconButton onClick={() => setFournisseurSelectionne(null)}>
                      <ExpandMoreIcon />
                    </IconButton>
                  </Box>
                </Box>

                <Box sx={{ p: 3 }}>
                  {produitsLoading ? (
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 8 }}>
                      <CircularProgress size={40} />
                      <Typography sx={{ mt: 2, color: 'text.secondary' }}>
                        Chargement des produits...
                      </Typography>
                    </Box>
                  ) : produits.length === 0 ? (
                    <Box sx={{ 
                      textAlign: 'center', 
                      py: 8, 
                      px: 2,
                      color: 'text.secondary',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: 2
                    }}>
                      <InventoryIcon sx={{ fontSize: 60, opacity: 0.4 }} />
                      <Typography variant="h6">
                        Aucun produit disponible pour ce fournisseur.
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 500 }}>
                        Ce fournisseur n'a pas encore ajouté de produits à son catalogue 
                        ou tous ses produits sont temporairement indisponibles.
                      </Typography>
                    </Box>
                  ) : (
                    <>
                      <Box sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                        <InventoryIcon sx={{ mr: 1, color: 'text.secondary' }} />
                        <Typography variant="subtitle1" color="text.secondary">
                          {produits.length} produits disponibles
                        </Typography>
                      </Box>
                      
                      <Grid container spacing={3}>
                        {produits.map((produit) => {
                          const productColor = getSupplierColor(produit.id);
                          
                          return (
                            <Grid item xs={12} sm={6} md={4} key={produit.id}>
                              <Fade in={true}>
                                <Card
                                  sx={{
                                    height: '100%',
                                    display: 'flex',
                                    flexDirection: 'column', // Assure que le contenu est empilé verticalement
                                    justifyContent: 'space-between', // Équilibre le contenu verticalement
                                    borderRadius: 2,
                                    transition: 'all 0.2s ease',
                                    '&:hover': {
                                      transform: 'translateY(-4px)',
                                      boxShadow: 4,
                                    },
                                  }}
                                >
                                  <Box
                                    sx={{
                                      height: 8,
                                      bgcolor: productColor,
                                      borderRadius: '8px 8px 0 0',
                                    }}
                                  />
                                  <CardContent sx={{ flexGrow: 1, p: 3 }}>
                                    <Typography variant="h6" gutterBottom fontWeight="medium">
                                      {produit.nom}
                                    </Typography>

                                    <Chip
                                      label={produit.categorie}
                                      size="small"
                                      sx={{
                                        mb: 2,
                                        bgcolor: alpha(productColor, 0.1),
                                        color: productColor,
                                        fontWeight: 500,
                                      }}
                                    />

                                    <Typography
                                      variant="body2"
                                      color="text.secondary"
                                      sx={{
                                        mb: 2,
                                        minHeight: 60,
                                        display: '-webkit-box',
                                        WebkitLineClamp: 3,
                                        WebkitBoxOrient: 'vertical',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                      }}
                                    >
                                      {produit.description}
                                    </Typography>

                                    <Box
                                      sx={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        mt: 'auto',
                                        pt: 1,
                                      }}
                                    >
                                      <Typography variant="h6" fontWeight="bold" sx={{ color: productColor }}>
                                        {produit.prixUnitaire.toLocaleString('fr-FR')} MAD
                                      </Typography>
                                      <Tooltip title="Voir détails">
                                        <IconButton
                                          size="small"
                                          sx={{ bgcolor: alpha(productColor, 0.1) }}
                                          onClick={() => handleProductDetails(produit)} // Appel de la fonction avec le produit
                                        >
                                          <ChevronRightIcon fontSize="small" sx={{ color: productColor }} />
                                        </IconButton>
                                      </Tooltip>
                                    </Box>
                                  </CardContent>
                                </Card>
                              </Fade>
                            </Grid>
                          );
                        })}
                      </Grid>
                    </>
                  )}
                </Box>
              </Paper>
            </Collapse>
          </>
        )}
        
        <Fade in={Boolean(fournisseurSelectionne)}>
          <Box 
            sx={{ 
              position: 'fixed', 
              bottom: 20, 
              right: 20,
              zIndex: 10
            }}
          >
            <Tooltip title="Revenir en haut">
              <IconButton 
                onClick={scrollToTop}
                sx={{ 
                  bgcolor: theme.palette.primary.main, 
                  color: 'white',
                  boxShadow: 2,
                  '&:hover': {
                    bgcolor: theme.palette.primary.dark
                  }
                }}
              >
                <KeyboardArrowUpIcon />
              </IconButton>
            </Tooltip>
          </Box>
        </Fade>

        <Dialog open={isDialogOpen} onClose={handleCloseDialog}>
          <DialogTitle>Détails du produit</DialogTitle>
          <DialogContent>
            {selectedProduct && (
              <>
                <Typography variant="h6">{selectedProduct.nom}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {selectedProduct.description}
                </Typography>
                <Typography variant="body1" fontWeight="bold" sx={{ mt: 2 }}>
                  Prix : {selectedProduct.prixUnitaire.toLocaleString('fr-FR')} MAD
                </Typography>
              </>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog} color="primary">
              Fermer
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </>
  );
}

export default ShowProviders;