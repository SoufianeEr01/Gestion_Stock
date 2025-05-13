import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Paper, 
  Grid, 
  Button, 
  Tabs, 
  Tab, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  CircularProgress,
  Card,
  CardContent,
  TablePagination,
  Divider,
  useTheme,
  Chip,
  alpha 
} from '@mui/material';
import autoTable from 'jspdf-autotable'; // ✅ l'import correct

// Import toutes les icônes sans duplication
import { 
  GetApp as DownloadIcon, 
  CompareArrows as CompareArrowsIcon, 
  CalendarToday as CalendarTodayIcon, 
  Search as SearchIcon, 
  FilterList as FilterIcon,
  TrendingUp,
  TrendingDown,
  Inventory,
  Refresh as RefreshIcon
} from '@mui/icons-material';

// Imports pour date-fns
import { format, parseISO, startOfMonth, endOfMonth, eachMonthOfInterval, subMonths } from 'date-fns';
import { fr } from 'date-fns/locale';

// Imports pour Recharts
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip as RechartsTooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';

// Imports pour l'API et les outils PDF
import { getAllMovements } from '../Gestion_Stock/Api/ApiMovementStock';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import html2canvas from 'html2canvas';

// Fonction pour formater une date
const formatDate = (dateString) => {
  try {
    const date = parseISO(dateString);
    return format(date, 'dd/MM/yyyy', { locale: fr });
  } catch (error) {
    console.error("Erreur lors du formatage de la date :", error);
    return dateString;
  }
};

// Générer des données pour les transferts entre emplacements
const generateLocationTransferData = (data) => {
  const transfers = data.filter(item => item.type === "TRANSFERT");
  const locationPairs = {};

  transfers.forEach(transfer => {
    const source = transfer.emplacement_source?.nom || 'Inconnu';
    const destination = transfer.emplacement_destination?.nom || 'Inconnu';
    const key = `${source} -> ${destination}`;

    if (!locationPairs[key]) {
      locationPairs[key] = {
        source,
        destination,
        count: 0,
        totalQuantity: 0
      };
    }

    locationPairs[key].count += 1;
    locationPairs[key].totalQuantity += transfer.quantite;
  });

  return Object.values(locationPairs);
};

// Générer des données mensuelles
const generateMonthlyData = (data) => {
  const today = new Date();
  const sixMonthsAgo = subMonths(today, 6);
  const months = eachMonthOfInterval({ start: sixMonthsAgo, end: today });

  return months.map(date => {
    const monthStart = startOfMonth(date);
    const monthEnd = endOfMonth(date);
    const monthName = format(date, 'MMM yy', { locale: fr });

    const monthItems = data.filter(item => {
      try {
        const itemDate = parseISO(item.date_mouvement);
        return itemDate >= monthStart && itemDate <= monthEnd;
      } catch (e) {
        console.error("Format de date invalide :", item.date_mouvement);
        return false;
      }
    });

    const entrances = monthItems.filter(item => item.type === "ENTREE").reduce((sum, item) => sum + item.quantite, 0);
    const exits = monthItems.filter(item => item.type === "SORTIE").reduce((sum, item) => sum + item.quantite, 0);
    const transfers = monthItems.filter(item => item.type === "TRANSFERT").reduce((sum, item) => sum + item.quantite, 0);

    return {
      month: monthName,
      entrées: entrances,
      sorties: exits,
      transferts: transfers,
      total: entrances + exits + transfers
    };
  });
};

// Générer des données par type de mouvement
const generateMovementTypeData = (data) => {
  const counts = { ENTREE: 0, SORTIE: 0, TRANSFERT: 0 };
  const quantities = { ENTREE: 0, SORTIE: 0, TRANSFERT: 0 };

  data.forEach(item => {
    counts[item.type] += 1;
    quantities[item.type] += item.quantite;
  });

  return [
    { name: 'Entrées', count: counts.ENTREE, quantity: quantities.ENTREE, fill: '#4caf50' },
    { name: 'Sorties', count: counts.SORTIE, quantity: quantities.SORTIE, fill: '#f44336' },
    { name: 'Transferts', count: counts.TRANSFERT, quantity: quantities.TRANSFERT, fill: '#2196f3' }
  ];
};

export const generatePDF = (reportType, data, chartRef) => {
  try {
    const doc = new jsPDF();

    // En-tête
    const today = format(new Date(), 'dd/MM/yyyy', { locale: fr });
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text(`Généré le ${today}`, 14, 10);

    doc.setFontSize(18);
    doc.setTextColor(0, 0, 0);
    doc.setFont(undefined, 'bold');
    doc.text('Rapport des Mouvements de Stock', 14, 20);

    doc.setFontSize(14);
    doc.setFont(undefined, 'normal');
    doc.text(reportType === 'monthly-report' ? 'Évolution Mensuelle' : 'Transferts entre Emplacements', 14, 30);

    // Graphique si rapport mensuel
    if (reportType === 'monthly-report' && chartRef?.current) {
      html2canvas(chartRef.current).then((canvas) => {
        const imgData = canvas.toDataURL('image/png');
        doc.addImage(imgData, 'PNG', 14, 40, 180, 100);

        finalizePDF();
      });
    } 
    // Tableau si rapport de transfert
    else if (reportType === 'transfer-report' && Array.isArray(data)) {
      autoTable(doc, {
        startY: 40,
        head: [['Source', 'Destination', 'Nombre de Transferts', 'Quantité Totale']],
        body: data.map((item) => [
          item.source,
          item.destination,
          item.count,
          item.totalQuantity,
        ]),
        headStyles: { fillColor: [33, 150, 243], textColor: 255 },
        alternateRowStyles: { fillColor: [245, 245, 245] },
      });

      finalizePDF();
    } 
    // Si aucune donnée
    else {
      doc.text('Aucune donnée disponible pour ce rapport.', 14, 40);
      finalizePDF();
    }

    function finalizePDF() {
      const pageCount = doc.internal.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(10);
        doc.setTextColor(150);
        doc.text(`Page ${i} sur ${pageCount}`, doc.internal.pageSize.getWidth() / 2, doc.internal.pageSize.getHeight() - 10, { align: 'center' });
      }

      doc.save(`rapport-mouvements-${reportType}.pdf`);
    }
  } catch (error) {
    console.error('Erreur lors de la génération du PDF:', error);
    alert('Erreur lors de la génération du rapport PDF');
  }
};

// Composant principal
const RapportMovements = () => {
  const theme = useTheme();
  const [tabValue, setTabValue] = useState(0);
  const [movementsData, setMovementsData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [period, setPeriod] = useState('all');
  const [sourceLocation, setSourceLocation] = useState('all');
  const [destinationLocation, setDestinationLocation] = useState('all');
  const [productFilter, setProductFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0); // Page actuelle (0-based pour Material-UI)
  const [rowsPerPage, setRowsPerPage] = useState(5); // Nombre de lignes par page
  const chartRef = useRef(null); // Référence pour le graphique

  // Charger les données au montage du composant
  useEffect(() => {
    const fetchMovements = async () => {
      try {
        setLoading(true);
        const data = await getAllMovements();
        setMovementsData(data);
        setFilteredData(data);
        setLoading(false);
      } catch (err) {
        console.error('Erreur lors du chargement des mouvements :', err);
        setError('Impossible de charger les données des mouvements');
        setLoading(false);
      }
    };

    fetchMovements();
  }, []);

  // Obtenir les emplacements uniques
  const locations = useMemo(() => {
    const allLocations = new Set();

    movementsData.forEach(item => {
      if (item.emplacement_source && item.emplacement_source.nom) {
        allLocations.add(item.emplacement_source.nom);
      }
      if (item.emplacement_destination && item.emplacement_destination.nom) {
        allLocations.add(item.emplacement_destination.nom);
      }
    });

    return Array.from(allLocations);
  }, [movementsData]);

  // Appliquer les filtres
  useEffect(() => {
    if (movementsData.length === 0) return;

    let result = [...movementsData];

    // Filtre par période
    if (period !== 'all') {
      const today = new Date();
      let startDate;

      switch (period) {
        case 'month':
          startDate = subMonths(today, 1);
          break;
        case 'quarter':
          startDate = subMonths(today, 3);
          break;
        case 'semester':
          startDate = subMonths(today, 6);
          break;
        default:
          startDate = new Date(0); // Début des temps
      }

      result = result.filter(item => {
        try {
          const itemDate = parseISO(item.date_mouvement);
          return itemDate >= startDate;
        } catch (e) {
          console.error("Format de date invalide :", item.date_mouvement);
          return false;
        }
      });
    }

    // Filtre par emplacement source
    if (sourceLocation !== 'all') {
      result = result.filter(item => 
        item.emplacement_source && item.emplacement_source.nom === sourceLocation
      );
    }

    // Filtre par emplacement destination
    if (destinationLocation !== 'all') {
      result = result.filter(item => 
        item.emplacement_destination && item.emplacement_destination.nom === destinationLocation
      );
    }

    // Filtre par produit
    if (productFilter) {
      result = result.filter(item => 
        item.stock.produit.nom.toLowerCase().includes(productFilter.toLowerCase())
      );
    }

    setFilteredData(result);
    setPage(0); // Réinitialiser à la première page quand les filtres changent
  }, [period, sourceLocation, destinationLocation, productFilter, movementsData]);

  // Préparer les données pour les graphiques
  const monthlyData = useMemo(() => generateMonthlyData(filteredData), [filteredData]);
  const movementTypeData = useMemo(() => generateMovementTypeData(filteredData), [filteredData]);
  const locationTransferData = useMemo(() => generateLocationTransferData(filteredData), [filteredData]);

  // Statistiques générales
  const totalMovements = filteredData.length;
  const totalQuantity = filteredData.reduce((sum, item) => sum + item.quantite, 0);
  const uniqueProducts = useMemo(() => {
    const productIds = new Set();
    filteredData.forEach(item => {
      if (item.stock && item.stock.produit && item.stock.produit.id) {
        productIds.add(item.stock.produit.id);
      }
    });
    return productIds.size;
  }, [filteredData]);

  // Fonction pour gérer le changement d'onglet
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  // Gestion de la pagination
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Afficher le chargement
  if (loading) {
    return (
      <Container maxWidth="xl" sx={{ mt: 4, mb: 4, display: 'flex', justifyContent: 'center', alignItems: 'center', height: '70vh' }}>
        <Box sx={{ textAlign: 'center' }}>
          <CircularProgress size={60} thickness={4} />
          <Typography variant="h6" sx={{ mt: 2 }}>Chargement des données...</Typography>
        </Box>
      </Container>
    );
  }

  // Afficher l'erreur
  if (error) {
    return (
      <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
        <Paper elevation={3} sx={{ p: 4, textAlign: 'center', bgcolor: '#fff3f3' }}>
          <Typography variant="h5" color="error" gutterBottom>Erreur</Typography>
          <Typography variant="body1">{error}</Typography>
          <Button variant="contained" sx={{ mt: 3 }} onClick={() => window.location.reload()}>
            Réessayer
          </Button>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
          Rapports des Mouvements de Stock
        </Typography>
      </Box>
      
      <Divider sx={{ mb: 2 }} />
{/*       
      {/* Filtres */}
      
      
      {/* Cartes de statistiques améliorées */}
      {/* <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card 
            elevation={2} 
            sx={{ 
              height: '100%', 
              borderRadius: 2,
              position: 'relative',
              overflow: 'hidden',
              background: `linear-gradient(135deg, ${theme.palette.primary.light} 30%, ${theme.palette.primary.main} 90%)`,
              boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
            }}
          >
            <CardContent sx={{ p: 2.5, height: '100%' }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                <Typography 
                  variant="subtitle1" 
                  component="div" 
                  sx={{ 
                    color: 'white', 
                    fontWeight: 600, 
                    mb: 1.5,
                    display: 'flex',
                    alignItems: 'center'
                  }}
                >
                  <Box 
                    sx={{ 
                      bgcolor: 'rgba(255,255,255,0.2)', 
                      borderRadius: '50%', 
                      p: 0.8, 
                      mr: 1.5,
                      display: 'flex' 
                    }}
                  >
                    <CompareArrowsIcon sx={{ fontSize: '1.2rem' }} />
                  </Box>
                  Total des Mouvements
                </Typography>
                
                <Typography 
                  variant="h3" 
                  component="div" 
                  sx={{ 
                    color: 'white', 
                    fontWeight: 700, 
                    my: 'auto',
                    textShadow: '0 2px 4px rgba(0,0,0,0.2)'
                  }}
                >
                  {new Intl.NumberFormat('fr-FR').format(totalMovements)}
                </Typography>
                
                <Typography 
                  variant="body2" 
                  sx={{ 
                    color: 'rgba(255,255,255,0.8)', 
                    mt: 1,
                    fontSize: '0.85rem'
                  }}
                >
                  {filteredData.length < movementsData.length 
                    ? `${((filteredData.length / movementsData.length) * 100).toFixed(0)}% du total`
                    : 'Tous les mouvements'}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card 
            elevation={2} 
            sx={{ 
              height: '100%', 
              borderRadius: 2,
              position: 'relative',
              overflow: 'hidden',
              background: `linear-gradient(135deg, ${theme.palette.warning.light} 30%, ${theme.palette.warning.main} 90%)`,
              boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
            }}
          >
            <CardContent sx={{ p: 2.5, height: '100%' ,width: '150PX'}}>
              <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                <Typography 
                  variant="subtitle1" 
                  component="div" 
                  sx={{ 
                    color: 'white', 
                    fontWeight: 600, 
                    mb: 1.5,
                    display: 'flex',
                    alignItems: 'center'
                  }}
                >
                  <Box 
                    sx={{ 
                      bgcolor: 'rgba(255,255,255,0.2)', 
                      borderRadius: '50%', 
                      p: 0.8, 
                      mr: 1.5,
                      display: 'flex' 
                    }}
                  >
                    <TrendingUp sx={{ fontSize: '1.2rem' }} />
                  </Box>
                  Quantité Totale
                </Typography>
                
                <Typography 
                  variant="h3" 
                  component="div" 
                  sx={{ 
                    color: 'white', 
                    fontWeight: 700, 
                    my: 'auto',
                    textShadow: '0 2px 4px rgba(0,0,0,0.2)'
                  }}
                >
                  {new Intl.NumberFormat('fr-FR').format(totalQuantity)}
                </Typography>
                
                <Typography 
                  variant="body2" 
                  sx={{ 
                    color: 'rgba(255,255,255,0.8)', 
                    mt: 1,
                    fontSize: '0.85rem'
                  }}
                >
                  Somme de tous les mouvements
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card 
            elevation={2} 
            sx={{ 
              height: '100%', 
              borderRadius: 2,
              position: 'relative',
              overflow: 'hidden',
              background: `linear-gradient(135deg, ${theme.palette.success.light} 30%, ${theme.palette.success.main} 90%)`,
              boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
            }}
          >
            <CardContent sx={{ p: 2.5, height: '100%' }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                <Typography 
                  variant="subtitle1" 
                  component="div" 
                  sx={{ 
                    color: 'white', 
                    fontWeight: 600, 
                    mb: 1.5,
                    display: 'flex',
                    alignItems: 'center'
                  }}
                >
                  <Box 
                    sx={{ 
                      bgcolor: 'rgba(255,255,255,0.2)', 
                      borderRadius: '50%', 
                      p: 0.8, 
                      mr: 1.5,
                      display: 'flex' 
                    }}
                  >
                    <Inventory sx={{ fontSize: '1.2rem' }} />
                  </Box>
                  Produits Concernés
                </Typography>
                
                <Typography 
                  variant="h3" 
                  component="div" 
                  sx={{ 
                    color: 'white', 
                    fontWeight: 700, 
                    my: 'auto',
                    textShadow: '0 2px 4px rgba(0,0,0,0.2)'
                  }}
                >
                  {uniqueProducts}
                </Typography>
                
                <Typography 
                  variant="body2" 
                  sx={{ 
                    color: 'rgba(255,255,255,0.8)', 
                    mt: 1,
                    fontSize: '0.85rem'
                  }}
                >
                  {uniqueProducts === 1 ? '1 produit impacté' : `${uniqueProducts} produits différents`}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card 
            elevation={2} 
            sx={{ 
              height: '100%', 
              borderRadius: 2,
              position: 'relative',
              overflow: 'hidden',
              background: `linear-gradient(135deg, ${theme.palette.info.light} 30%, ${theme.palette.info.main} 90%)`,
              boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
            }}
          >
            <CardContent sx={{ p: 2.5, height: '100%' }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                <Typography 
                  variant="subtitle1" 
                  component="div" 
                  sx={{ 
                    color: 'white', 
                    fontWeight: 600, 
                    mb: 1.5,
                    display: 'flex',
                    alignItems: 'center'
                  }}
                >
                  <Box 
                    sx={{ 
                      bgcolor: 'rgba(255,255,255,0.2)', 
                      borderRadius: '50%', 
                      p: 0.8, 
                      mr: 1.5,
                      display: 'flex' 
                    }}
                  >
                    <CompareArrowsIcon sx={{ fontSize: '1.2rem' }} />
                  </Box>
                  Transferts
                </Typography>
                
                <Typography 
                  variant="h3" 
                  component="div" 
                  sx={{ 
                    color: 'white', 
                    fontWeight: 700, 
                    my: 'auto',
                    textShadow: '0 2px 4px rgba(0,0,0,0.2)'
                  }}
                >
                  {new Intl.NumberFormat('fr-FR').format(filteredData.filter(item => item.type === "TRANSFERT").length)}
                </Typography>
                
                <Typography 
                  variant="body2" 
                  sx={{ 
                    color: 'rgba(255,255,255,0.8)', 
                    mt: 1,
                    fontSize: '0.85rem'
                  }}
                >
                  {`${((filteredData.filter(item => item.type === "TRANSFERT").length / totalMovements) * 100).toFixed(0)}% des mouvements`}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid> */}
      {/* </Grid>  */}
      <Paper 
        elevation={2} 
        sx={{ 
          p: 3, 
          mb: 4, 
          borderRadius: 2,
          background: `linear-gradient(to right, ${alpha(theme.palette.background.paper, 0.9)}, ${alpha(theme.palette.background.paper, 0.97)})`,
          border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography 
            variant="h6" 
            component="h2" 
            sx={{ 
              display: 'flex', 
              alignItems: 'center',
              color: theme.palette.text.primary,
              fontWeight: 600
            }}
          >
            <FilterIcon sx={{ mr: 1.5, color: theme.palette.primary.main }} />
            Options de filtrage
          </Typography>
          
          <Button 
            size="small" 
            variant="outlined" 
            color="inherit"
            startIcon={<RefreshIcon />}
            onClick={() => {
              setPeriod('all');
              setSourceLocation('all');
              setDestinationLocation('all');
              setProductFilter('');
            }}
            sx={{ 
              borderRadius: 1.5, 
              textTransform: 'none',
              fontSize: '0.8rem'
            }}
          >
            Réinitialiser
          </Button>
        </Box>
        
        <Divider sx={{ mb: 2, opacity: 0.6 }} />
        
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={3}>
            <FormControl 
              fullWidth 
              variant="outlined" 
              size="small"
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 1.5,
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: theme.palette.primary.main,
                    borderWidth: 2
                  }
                }
              }}
            >
              <InputLabel>Période</InputLabel>
              <Select
                value={period}
                onChange={(e) => setPeriod(e.target.value)}
                label="Période"
                startAdornment={
                  <CalendarTodayIcon fontSize="small" sx={{ mr: 1, opacity: 0.7 }} />
                }
              >
                <MenuItem value="all">Toutes les périodes</MenuItem>
                <MenuItem value="month">Dernier mois</MenuItem>
                <MenuItem value="quarter">Dernier trimestre</MenuItem>
                <MenuItem value="semester">Dernier semestre</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <FormControl 
              fullWidth 
              variant="outlined" 
              size="small"
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 1.5,
                }
              }}
            >
              <InputLabel>Emplacement Source</InputLabel>
              <Select
                value={sourceLocation}
                onChange={(e) => setSourceLocation(e.target.value)}
                label="Emplacement Source"
                startAdornment={
                  sourceLocation !== 'all' ? (
                    <Box 
                      sx={{ 
                        width: 8, 
                        height: 8, 
                        borderRadius: '50%', 
                        bgcolor: theme.palette.success.main,
                        mr: 1.5
                      }}
                    />
                  ) : null
                }
              >
                <MenuItem value="all">Tous les emplacements</MenuItem>
                {locations.map(location => (
                  <MenuItem key={location} value={location}>{location}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <FormControl 
              fullWidth 
              variant="outlined"
              size="small" 
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 1.5,
                }
              }}
            >
              <InputLabel>Emplacement Destination</InputLabel>
              <Select
                value={destinationLocation}
                onChange={(e) => setDestinationLocation(e.target.value)}
                label="Emplacement Destination"
                startAdornment={
                  destinationLocation !== 'all' ? (
                    <Box 
                      sx={{ 
                        width: 8, 
                        height: 8, 
                        borderRadius: '50%', 
                        bgcolor: theme.palette.error.main,
                        mr: 1.5
                      }}
                    />
                  ) : null
                }
              >
                <MenuItem value="all">Tous les emplacements</MenuItem>
                {locations.map(location => (
                  <MenuItem key={location} value={location}>{location}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          
          
        </Grid>
        
        {/* Afficher les filtres actifs */}
        {(period !== 'all' || sourceLocation !== 'all' || destinationLocation !== 'all' || productFilter) && (
          <Box sx={{ mt: 2, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {period !== 'all' && (
              <Chip 
                label={`Période: ${
                  period === 'month' ? 'Dernier mois' : 
                  period === 'quarter' ? 'Dernier trimestre' : 
                  'Dernier semestre'
                }`}
                size="small"
                variant="outlined"
                color="primary"
                onDelete={() => setPeriod('all')}
              />
            )}
            
            {sourceLocation !== 'all' && (
              <Chip 
                label={`Source: ${sourceLocation}`}
                size="small"
                variant="outlined"
                color="success"
                onDelete={() => setSourceLocation('all')}
              />
            )}
            
            {destinationLocation !== 'all' && (
              <Chip 
                label={`Destination: ${destinationLocation}`}
                size="small"
                variant="outlined"
                color="error"
                onDelete={() => setDestinationLocation('all')}
              />
            )}
            
            {productFilter && (
              <Chip 
                label={`Produit: ${productFilter}`}
                size="small"
                variant="outlined"
                color="info"
                onDelete={() => setProductFilter('')}
              />
            )}
          </Box>
        )}
      </Paper>
      {/* Onglets pour les différents rapports */}
      <Paper elevation={3} sx={{ mb: 4 }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
          variant="fullWidth"
        >
          <Tab label="Mouvements par Mois" icon={<CalendarTodayIcon />} iconPosition="start" />
          <Tab label="Transferts entre Emplacements" icon={<CompareArrowsIcon />} iconPosition="start" />
        </Tabs>
        
        {/* Contenu de l'onglet 1: Mouvements par Mois */}
        {tabValue === 0 && (
          <Box sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6" component="h3">
                Rapport des Mouvements de Stock par Mois
              </Typography>
              <Button 
                variant="contained" 
                color="primary" 
                startIcon={<DownloadIcon />}
                onClick={() => generatePDF('monthly-report', null, chartRef)}
              >
                Exporter ce Rapport
              </Button>
            </Box>
            
            <Grid container spacing={4}>
              <Grid item xs={12} lg={8}>
                <Paper elevation={2} sx={{ p: 2, height: '400px',width:'600px'}} ref={chartRef}>
                  <Typography variant="subtitle1" gutterBottom fontWeight="bold">
                    Évolution des Mouvements par Type
                  </Typography>
                  <ResponsiveContainer width="100%" height="90%">
                    <LineChart data={monthlyData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <RechartsTooltip />
                      <Legend />
                      
                      <Line type="monotone" dataKey="transferts" stroke="#2196f3" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </Paper>
              </Grid>
            </Grid>
          </Box>
        )}

        {/* Contenu de l'onglet 2: Transferts entre Emplacements */}
        {tabValue === 1 && (
          <Box sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6" component="h3">
                Rapport des Transferts entre Emplacements
              </Typography>
              <Button
                variant="contained"
                color="primary"
                startIcon={<DownloadIcon />}
                onClick={() => generatePDF('transfer-report', locationTransferData)}
              >
                Exporter ce Rapport
              </Button>
            </Box>
            
            {locationTransferData.length > 0 ? (
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Source</TableCell>
                      <TableCell>Destination</TableCell>
                      <TableCell align="right">Nombre de Transferts</TableCell>
                      <TableCell align="right">Quantité Totale</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {locationTransferData
                      .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                      .map((transfer, index) => (
                        <TableRow key={index}>
                          <TableCell>{transfer.source}</TableCell>
                          <TableCell>{transfer.destination}</TableCell>
                          <TableCell align="right">{transfer.count}</TableCell>
                          <TableCell align="right">{transfer.totalQuantity}</TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
                <TablePagination
                  component="div"
                  count={locationTransferData.length}
                  page={page}
                  onPageChange={handleChangePage}
                  rowsPerPage={rowsPerPage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                  rowsPerPageOptions={[5, 10, 25]}
                  labelRowsPerPage="Lignes par page"
                />
              </TableContainer>
            ) : (
              <Box sx={{ p: 4, textAlign: 'center' }}>
                <Typography variant="body1">Aucun transfert trouvé pour les filtres sélectionnés.</Typography>
              </Box>
            )}
          </Box>
        )}
      </Paper>
    </Container>
  );
};

export default RapportMovements;