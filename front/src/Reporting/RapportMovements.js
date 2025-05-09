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
  Divider
} from '@mui/material';
import { 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  Cell 
} from 'recharts';

import { format, parseISO, startOfMonth, endOfMonth, eachMonthOfInterval, subMonths } from 'date-fns';
import { fr } from 'date-fns/locale';
import { 
  GetApp as DownloadIcon, 
  CompareArrows as CompareArrowsIcon, 
  CalendarToday as CalendarTodayIcon, 
  Search as SearchIcon, 
  FilterList as FilterIcon,
  TrendingUp,
  TrendingDown
} from '@mui/icons-material';

import { getAllMovements } from '../Gestion_Stock/Api/ApiMovementStock';
import jsPDF from 'jspdf';
import 'jspdf-autotable'; // Pour générer des tableaux dans le PDF
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
    const monthName = format(date, 'MMMM', { locale: fr });

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

// Générer un PDF (simulation)
const generatePDF = (reportType, data) => {
  const doc = new jsPDF();

  // Titre du rapport
  doc.setFontSize(18);
  doc.text(`Rapport : ${reportType}`, 14, 20);

  if (reportType === 'transfer-report') {
    // Ajouter un tableau manuellement
    doc.setFontSize(12);
    const startX = 14;
    const startY = 30;
    const rowHeight = 10;
    const colWidths = [50, 50, 40, 40]; // Largeurs des colonnes

    // En-têtes du tableau
    const headers = ['Source', 'Destination', 'Nombre de Transferts', 'Quantité Totale'];
    headers.forEach((header, index) => {
      doc.text(header, startX + colWidths.slice(0, index).reduce((a, b) => a + b, 0), startY);
    });

    // Contenu du tableau
    data.forEach((transfer, rowIndex) => {
      const rowY = startY + (rowIndex + 1) * rowHeight;
      doc.text(transfer.source, startX, rowY);
      doc.text(transfer.destination, startX + colWidths[0], rowY);
      doc.text(transfer.count.toString(), startX + colWidths[0] + colWidths[1], rowY);
      doc.text(transfer.totalQuantity.toString(), startX + colWidths[0] + colWidths[1] + colWidths[2], rowY);
    });
  } else {
    doc.text('Aucune donnée disponible pour ce rapport.', 14, 30);
  }

  // Sauvegarder le fichier PDF
  doc.save(`${reportType}.pdf`);
};

// Composant principal
const StockMovementDashboard = () => {
  const [tabValue, setTabValue] = useState(0);
  const [movementsData, setMovementsData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [period, setPeriod] = useState('all');
  const [sourceLocation, setSourceLocation] = useState('all');
  const [destinationLocation, setDestinationLocation] = useState('all');
  const [productFilter, setProductFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1); // Page actuelle (1-based index)
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
      if (item.emplacement_source) {
        allLocations.add(item.emplacement_source.nom);
      }
      if (item.emplacement_destination) {
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
  }, [period, sourceLocation, destinationLocation, productFilter, movementsData]);

  // Préparer les données pour les graphiques
  const monthlyData = useMemo(() => generateMonthlyData(filteredData), [filteredData]);
  const movementTypeData = useMemo(() => generateMovementTypeData(filteredData), [filteredData]);
  const locationTransferData = useMemo(() => generateLocationTransferData(filteredData), [filteredData]);

  // Statistiques générales
  const totalMovements = filteredData.length;
  const totalQuantity = filteredData.reduce((sum, item) => sum + item.quantite, 0);
  const uniqueProducts = [...new Set(filteredData.map(item => item.stock.produit.id))].length;

  // Fonction pour gérer le changement d'onglet
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
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
        <Divider sx={{ mb: 2 }} />
      </Box>
      
      {/* Filtres */}
      <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" component="h2" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
          <FilterIcon size={24} sx={{ mr: 1 }} />
          Filtres
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth variant="outlined">
              <InputLabel>Période</InputLabel>
              <Select
                value={period}
                onChange={(e) => setPeriod(e.target.value)}
                label="Période"
              >
                <MenuItem value="all">Toutes les périodes</MenuItem>
                <MenuItem value="month">Dernier mois</MenuItem>
                <MenuItem value="quarter">Dernier trimestre</MenuItem>
                <MenuItem value="semester">Dernier semestre</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth variant="outlined">
              <InputLabel>Emplacement Source</InputLabel>
              <Select
                value={sourceLocation}
                onChange={(e) => setSourceLocation(e.target.value)}
                label="Emplacement Source"
              >
                <MenuItem value="all">Tous les emplacements</MenuItem>
                {locations.map(location => (
                  <MenuItem key={location} value={location}>{location}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth variant="outlined">
              <InputLabel>Emplacement Destination</InputLabel>
              <Select
                value={destinationLocation}
                onChange={(e) => setDestinationLocation(e.target.value)}
                label="Emplacement Destination"
              >
                <MenuItem value="all">Tous les emplacements</MenuItem>
                {locations.map(location => (
                  <MenuItem key={location} value={location}>{location}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              fullWidth
              label="Produit"
              variant="outlined"
              value={productFilter}
              onChange={(e) => setProductFilter(e.target.value)}
              InputProps={{
                startAdornment: <SearchIcon size={20} style={{ marginRight: 8 }} />,
              }}
            />
          </Grid>
        </Grid>
      </Paper>
      
      {/* Cartes de statistiques */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={3} sx={{ height: '100%', background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)' }}>
            <CardContent>
              <Typography variant="h6" component="div" sx={{ color: 'white', fontWeight: 'bold', display: 'flex', alignItems: 'center', mb: 2 }}>
                Total des Mouvements
              </Typography>
              <Typography variant="h3" component="div" sx={{ color: 'white', fontWeight: 'bold' }}>
                {totalMovements}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} spacing={3} sm={6} md={3}>
          <Card elevation={3} sx={{ height: '100%', background: 'linear-gradient(45deg, #FF9800 30%, #FFB74D 90%)' }}>
            <CardContent>
              <Typography variant="h6" component="div" sx={{ color: 'white', fontWeight: 'bold', display: 'flex', alignItems: 'center', mb: 2 }}>
                <TrendingUp sx={{ marginRight: 1 }} />
                Quantité Totale
              </Typography>
              <Typography variant="h3" component="div" sx={{ color: 'white', fontWeight: 'bold' }}>
                {totalQuantity}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={3} sx={{ height: '100%', background: 'linear-gradient(45deg, #4CAF50 30%, #81C784 90%)' }}>
            <CardContent>
              <Typography variant="h6" component="div" sx={{ color: 'white', fontWeight: 'bold', display: 'flex', alignItems: 'center', mb: 2 }}>
                <TrendingDown sx={{ marginRight: 1 }} />
                Produits Concernés
              </Typography>
              <Typography variant="h3" component="div" sx={{ color: 'white', fontWeight: 'bold' }}>
                {uniqueProducts}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={3} sx={{ height: '100%', background: 'linear-gradient(45deg, #9C27B0 30%, #BA68C8 90%)' }}>
            <CardContent>
              <Typography variant="h6" component="div" sx={{ color: 'white', fontWeight: 'bold', display: 'flex', alignItems: 'center', mb: 2 }}>
                <CompareArrowsIcon sx={{ marginRight: 1 }} />
                Transferts
              </Typography>
              <Typography variant="h3" component="div" sx={{ color: 'white', fontWeight: 'bold' }}>
                {filteredData.filter(item => item.type === "TRANSFERT").length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      
      {/* Onglets pour les différents rapports */}
      <Paper elevation={3} sx={{ mb: 4 }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
          variant="fullWidth"
        >
          <Tab label="Mouvements par Mois" icon={<CalendarTodayIcon size={20} />} iconPosition="start" />
          <Tab label="Transferts entre Emplacements" icon={<CompareArrowsIcon size={20} />} iconPosition="start" />
          {/* <Tab label="Détails des Mouvements" icon={<Inventory size={20} />} iconPosition="start" /> */}
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
                <Paper elevation={2} sx={{ p: 2, height: '400px', width:'600px'}} ref={chartRef}>
                  <Typography variant="subtitle1" gutterBottom fontWeight="bold">
                    Évolution des Mouvements par Type
                  </Typography>
                  <ResponsiveContainer width="100%" height="90%">
                    <LineChart data={monthlyData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      {/* Afficher uniquement les transferts */}
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
                    {locationTransferData.slice((page - 1) * rowsPerPage, page * rowsPerPage) // Pagination logic
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
                  count={locationTransferData.length} // Total number of rows
                  page={page - 1} // Current page (0-based index)
                  onPageChange={(event, newPage) => setPage(newPage + 1)} // Update page state
                  rowsPerPage={rowsPerPage} // Rows per page
                  onRowsPerPageChange={(event) => setRowsPerPage(parseInt(event.target.value, 10))} // Update rows per page
                  rowsPerPageOptions={[5, 10, 25]} // Options for rows per page
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

        {/* Contenu de l'onglet 3: Détails des Mouvements */}
        {tabValue === 2 && (
          <Box sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6" component="h3">
                Détails des Mouvements de Stock
              </Typography>
              <Button 
                variant="contained" 
                color="primary" 
                startIcon={<DownloadIcon />}
                onClick={() => generatePDF('movement-details')}
              >
                Exporter ce Rapport
              </Button>
            </Box>
            
            {filteredData.length > 0 ? (
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Date</TableCell>
                      <TableCell>Type</TableCell>
                      <TableCell>Produit</TableCell>
                      <TableCell>Source</TableCell>
                      <TableCell>Destination</TableCell>
                      <TableCell align="right">Quantité</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredData.map((movement, index) => (
                      <TableRow key={index}>
                        <TableCell>{formatDate(movement.date_mouvement)}</TableCell>
                        <TableCell>{movement.type}</TableCell>
                        <TableCell>{movement.stock.produit.nom}</TableCell>
                        <TableCell>{movement.emplacement_source?.nom || 'N/A'}</TableCell>
                        <TableCell>{movement.emplacement_destination?.nom || 'N/A'}</TableCell>
                        <TableCell align="right">{movement.quantite}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            ) : (
              <Box sx={{ p: 4, textAlign: 'center' }}>
                <Typography variant="body1">Aucun mouvement trouvé pour les filtres sélectionnés.</Typography>
              </Box>
            )}
          </Box>
        )}
      </Paper>
    </Container>
  );
};

export default StockMovementDashboard;