import { useState, useEffect, useCallback } from 'react';
import {
  Box, Grid, Typography, Paper, IconButton, Button, Select,
  MenuItem, Divider, Collapse, Card, CardContent, Chip,
  TextField, InputAdornment, CircularProgress, Badge,
  ListItemButton, ListItemText, Skeleton, Dialog, Alert,
  Snackbar, Tooltip, Tab, Tabs, Avatar, useTheme, 
  AppBar, Toolbar
} from '@mui/material';
import {
  TrendingUp, Package, AlertCircle, DollarSign, ChevronRight, 
  ChevronDown, ChevronUp, Search, RefreshCw, Bell, Calendar,
  ShoppingCart, Filter, BarChart2, PieChart as PieChartIcon, LineChart as LineChartIcon,
  CheckCircle, Clock, ThumbsUp, ArrowUpRight, ArrowDownRight, Menu
} from 'lucide-react';
import {
  ResponsiveContainer, LineChart, Line, BarChart, Bar, 
  PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, 
  Tooltip as RechartsTooltip, Legend, Area, AreaChart
} from 'recharts';

// Import des API réelles du projet
import { getAllStocks, getStockById } from '../Gestion_Stock/Api/ApiStock';
import { getAllProduits } from '../Gestion_Stock/Api/ApiProduct';
import { getAllMovements } from '../Gestion_Stock/Api/ApiMovementStock';
import { getAllLocations } from '../Gestion_Stock/Api/ApiLocation';

const StockDashboard = () => {
  const theme = useTheme();
  const [loading, setLoading] = useState(true);
  const [statistiques, setStatistiques] = useState({
    totalStock: 0,
    lowStockCount: 0,
    valeurTotale: 0,
    topProduits: [],
  });
  const [previsions, setPrevisions] = useState([]);
  const [inventoryByCategory, setInventoryByCategory] = useState([]);
  const [expanded, setExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [timeRange, setTimeRange] = useState('6 mois');
  const [searchTerm, setSearchTerm] = useState('');
  const [notifications, setNotifications] = useState([]);
  const [notifOpen, setNotifOpen] = useState(false);
  const [lowStockItems, setLowStockItems] = useState([]);
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [stockHistory, setStockHistory] = useState([]);
  const [topSellers, setTopSellers] = useState([]);
  const [locations, setLocations] = useState([]);
  
  // Couleurs pour les graphiques
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

  // Récupération des données depuis les API réelles
  const fetchDashboardData = useCallback(async () => {
    setRefreshing(true);
    try {
      // Récupérer les données des stocks via l'API
      const stocksData = await getAllStocks();
      const produitsData = await getAllProduits();
      const mouvementsData = await getAllMovements();
      const locationsData = await getAllLocations();
      setLocations(locationsData);
      
      // Calcul des statistiques à partir des données réelles
      // 1. Stock total: somme des quantités importées de tous les stocks
      const totalStock = stocksData.reduce((acc, stock) => acc + stock.quantite_importe, 0);
      
      // 2. Nombre d'articles en stock critique (quantité < seuil de réapprovisionnement)
      const lowStockCount = stocksData.filter(
        stock => stock.quantite_importe < stock.seuil_reapprovisionnement
      ).length;
      
      // 3. Valeur totale du stock
      const valeurTotale = stocksData.reduce((acc, stock) => {
        const produit = produitsData.find(p => p.id === stock.produit?.id);
        return acc + (produit?.prix_unitaire || 0) * stock.quantite_importe;
      }, 0);
      
      // 4. Top produits (par quantité)
      const produitQuantites = {};
      stocksData.forEach(stock => {
        const produitId = stock.produit?.id;
        if (produitId) {
          if (!produitQuantites[produitId]) {
            produitQuantites[produitId] = {
              id: produitId,
              nom: produitsData.find(p => p.id === produitId)?.nom || "Produit inconnu",
              quantite: 0,
              tendance: "up",  // À calculer plus tard avec historique
              pourcentage: 0   // À calculer plus tard avec historique
            };
          }
          produitQuantites[produitId].quantite += stock.quantite_importe;
        }
      });
      
      const topProduits = Object.values(produitQuantites)
        .sort((a, b) => b.quantite - a.quantite)
        .slice(0, 5)
        .map((p, idx) => ({
          ...p,
          tendance: idx % 2 ? "down" : "up",  // Alternance pour la démo
          pourcentage: Math.floor(Math.random() * 15) + 1  // Valeur aléatoire pour la démo
        }));
      
      setStatistiques({
        totalStock,
        lowStockCount,
        valeurTotale,
        topProduits
      });
      
      
      // Calcul des produits en stock faible pour l'alerte
      const lowStockItems = stocksData
        .filter(stock => stock.quantite_importe < stock.seuil_reapprovisionnement)
        .map(stock => {
          const produit = produitsData.find(p => p.id === stock.produit?.id);
          return {
            id: stock.id,
            nom: produit?.nom || "Produit inconnu",
            quantite: stock.quantite_importe,
            seuil: stock.seuil_reapprovisionnement,
            fournisseur: produit?.id_fournisseur || "Fournisseur inconnu"
          };
        }).slice(0, 3);  // Limiter à 3 pour l'affichage
      
      setLowStockItems(lowStockItems);
      
      // Calculer la répartition par catégorie
      const categories = {};
      produitsData.forEach(produit => {
        if (!produit.categorie) return;
        
        // Trouver tous les stocks de ce produit
        const stocksProduit = stocksData.filter(s => s.produit?.id === produit.id);
        const quantiteTotale = stocksProduit.reduce((sum, s) => sum + s.quantite_importe, 0);
        
        if (!categories[produit.categorie]) {
          categories[produit.categorie] = 0;
        }
        categories[produit.categorie] += quantiteTotale;
      });
      
      // Convertir en format pour le graphique camembert
      const inventoryByCategory = Object.entries(categories).map(([name, value], idx) => ({
        name,
        value,
        color: COLORS[idx % COLORS.length]
      }));
      
      setInventoryByCategory(inventoryByCategory);
      
      // Historique des mouvements de stock (entrées/sorties par jour)
      // Organiser les mouvements par date
      const movementsByDate = {};
      mouvementsData.forEach(mvt => {
        const date = new Date(mvt.date_mouvement).toLocaleDateString();
        
        if (!movementsByDate[date]) {
          movementsByDate[date] = { date, entrees: 0, sorties: 0 };
        }
        
        if (mvt.type === 'ENTREE') {
          movementsByDate[date].entrees += mvt.quantite;
        } else if (mvt.type === 'SORTIE' || mvt.type === 'TRANSFERT') {
          movementsByDate[date].sorties += mvt.quantite;
        }
      });
      
      // Convertir en tableau trié par date (récent → ancien)
      const stockHistory = Object.values(movementsByDate)
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, 5);  // Limiter aux 5 derniers jours
      
      setStockHistory(stockHistory);
      
      // Notifications basées sur les états réels
      const notifications = [];
      
      // Ajouter des notifications pour les stocks critiques
      lowStockItems.forEach(item => {
        notifications.push({
          id: `low-${item.id}`,
          type: 'alert',
          message: `${item.nom} en stock critique (${item.quantite}/${item.seuil})`,
          time: new Date().toLocaleTimeString()
        });
      });
      
      // Ajouter des notifications pour les derniers mouvements
      const recentMovements = mouvementsData
        .sort((a, b) => new Date(b.date_mouvement) - new Date(a.date_mouvement))
        .slice(0, 2);
      
      recentMovements.forEach(mvt => {
        const produit = produitsData.find(p => p.id === mvt.stock?.produit?.id)?.nom || "Produit";
        notifications.push({
          id: `mvt-${mvt.id}`,
          type: mvt.type === 'ENTREE' ? 'success' : 'info',
          message: `${mvt.type === 'ENTREE' ? 'Entrée' : 'Sortie'} de ${mvt.quantite} ${produit}`,
          time: new Date(mvt.date_mouvement).toLocaleTimeString()
        });
      });
      
      setNotifications(notifications);
      
      // Calcul des meilleures ventes vs stock
      // Pour la démo, on va simuler les ventes à partir des mouvements de sortie
      const ventesParProduit = {};
      const stockParProduit = {};
      
      // Calculer le stock actuel par produit
      stocksData.forEach(stock => {
        if (stock.produit?.id) {
          if (!stockParProduit[stock.produit.id]) {
            stockParProduit[stock.produit.id] = 0;
          }
          stockParProduit[stock.produit.id] += stock.quantite_importe;
        }
      });
      
      // Calculer les "ventes" (sorties) par produit
      mouvementsData
        .filter(mvt => mvt.type === 'SORTIE')
        .forEach(mvt => {
          const produitId = mvt.stock?.produit?.id;
          if (!produitId) return;
          
          if (!ventesParProduit[produitId]) {
            ventesParProduit[produitId] = 0;
          }
          ventesParProduit[produitId] += mvt.quantite;
        });
      
      // Créer le tableau des meilleures ventes
      const topSellers = Object.keys(ventesParProduit)
        .filter(id => stockParProduit[id] > 0 || ventesParProduit[id] > 0)
        .map(id => {
          const produit = produitsData.find(p => p.id === parseInt(id));
          return {
            id,
            nom: produit?.nom || "Produit inconnu",
            ventes: ventesParProduit[id] || 0,
            stock: stockParProduit[id] || 0,
            ratio: ventesParProduit[id] / (stockParProduit[id] || 1)  // Éviter division par zéro
          };
        })
        .sort((a, b) => b.ventes - a.ventes)
        .slice(0, 3);  // Top 3
      
      setTopSellers(topSellers);
      
      // Simuler les données de prévision pour le graphique d'évolution
      // Dans un cas réel, ces données viendraient d'un algorithme prédictif
      const derniersMois = [];
      for (let i = 5; i >= 0; i--) {
        const d = new Date();
        d.setMonth(d.getMonth() - i);
        derniersMois.push({
          mois: d.toLocaleDateString('fr-FR', { month: 'short' }),
          date: d
        });
      }
      
      // Calculer les quantités par mois à partir de l'historique
      const stockParMois = derniersMois.map(({ mois, date }) => {
        // Dans un cas réel, vous utiliseriez des requêtes API avec des filtres de date
        // Pour la démo, nous générons des données cohérentes
        const quantite = Math.floor(Math.random() * 300) + 400;
        const variation = Math.floor(Math.random() * 50) - 25;
        
        return {
          mois,
          quantite,
          prevision: quantite + variation,
          demande: quantite + variation * 1.5
        };
      });
      
      setPrevisions(stockParMois);
      
      setLoading(false);
      setAlertMessage('Données actualisées avec succès');
      setAlertOpen(true);
    } catch (error) {
      console.error('Erreur lors du chargement des données:', error);
      setAlertMessage('Erreur lors du chargement des données');
      setAlertOpen(true);
    } finally {
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
    
    // Mettre en place une actualisation automatique toutes les 5 minutes
    const intervalId = setInterval(() => {
      fetchDashboardData();
    }, 300000);
    
    return () => clearInterval(intervalId);
  }, [fetchDashboardData]);

  // Fonction pour commander un produit en stock faible
  const handleOrder = (produit) => {
    // Ici vous appelleriez l'API pour créer une commande
    setAlertMessage(`Commande initiée pour ${produit.nom}`);
    setAlertOpen(true);
  };

  // Filtrer les résultats par le terme de recherche 
  const handleSearch = (term) => {
    setSearchTerm(term);
    // La recherche peut être implémentée sur les différentes sections au besoin
  };

  // Carte de statistique avec animation
  const StatCard = ({ title, value, icon, color, change, changeType }) => (
    <Paper 
      elevation={1} 
      sx={{ 
        p: 3, 
        display: 'flex', 
        flexDirection: 'column', 
        bgcolor: color.bg,
        borderRadius: 2,
        transition: 'transform 0.2s, box-shadow 0.2s',
        ':hover': { 
          transform: 'translateY(-5px)',
          boxShadow: 3
        }
      }}
    >
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
        <Typography variant="subtitle2" color="text.secondary" fontWeight={500}>{title}</Typography>
        <Box p={1} bgcolor={color.iconBg} borderRadius="50%">
          {icon}
        </Box>
      </Box>
      <Typography variant="h4" fontWeight="bold" mb={1}>{value}</Typography>
      {change && (
        <Box display="flex" alignItems="center">
          {changeType === 'up' ? 
            <ArrowUpRight size={14} color={theme.palette.success.main} /> : 
            <ArrowDownRight size={14} color={theme.palette.error.main} />
          }
          <Typography 
            variant="caption" 
            fontWeight="medium"
            color={changeType === 'up' ? 'success.main' : 'error.main'}
            ml={0.5}
          >
            {change} depuis le mois dernier
          </Typography>
        </Box>
      )}
    </Paper>
  );

  // Rendu conditionnel pour l'état de chargement
  if (loading) {
    return (
      <Box p={4} bgcolor="#f9fafb" minHeight="100vh" display="flex" flexDirection="column">
        <Box maxWidth="lg" mx="auto" width="100%">
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
            <Skeleton variant="text" width={300} height={40} />
            <Skeleton variant="rounded" width={200} height={40} />
          </Box>
          
          <Grid container spacing={3} mb={4}>
            {[1, 2, 3, 4].map(i => (
              <Grid item xs={12} sm={6} md={3} key={i}>
                <Skeleton variant="rounded" height={120} />
              </Grid>
            ))}
          </Grid>
          
          <Grid container spacing={3}>
            <Grid item xs={12} md={8}>
              <Skeleton variant="rounded" height={400} />
            </Grid>
            <Grid item xs={12} md={4}>
              <Skeleton variant="rounded" height={400} />
            </Grid>
          </Grid>
        </Box>
      </Box>
    );
  }

  return (
    <Box p={0} bgcolor="white" minHeight="100vh">
      <Box maxWidth="lg" mx="auto" px={3}>
        {/* Cartes de statistiques */}
        <Grid container spacing={3} mb={4}>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard 
              title="Stock Total" 
              value={statistiques.totalStock.toLocaleString()} 
              icon={<Package size={20} color="#3B82F6" />} 
              color={{ bg: 'white', iconBg: '#DBEAFE' }} 
              change="+8.2%" 
              changeType="up"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard 
              title="Articles à Commander" 
              value={statistiques.lowStockCount} 
              icon={<AlertCircle size={20} color="#EF4444" />} 
              color={{ bg: '#FFF1F2', iconBg: '#FECACA' }}
              change="+3 articles" 
              changeType="up" 
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard 
              title="Valeur Totale" 
              value={`${statistiques.valeurTotale.toLocaleString()} MAD`} 
              icon={<DollarSign size={20} color="#10B981" />} 
              color={{ bg: 'white', iconBg: '#D1FAE5' }}
              change="+12.5%" 
              changeType="up"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard 
              title="Emplacements" 
              value={locations.length > 0 ? locations.length : "N/A"} 
              icon={<TrendingUp size={20} color="#8B5CF6" />} 
              color={{ bg: 'white', iconBg: '#E9D5FF' }}
              change="Actifs" 
              changeType="up" 
            />
          </Grid>
        </Grid>

        {/* Tabs pour les différents graphiques */}
        <Paper elevation={1} sx={{ mb: 4, borderRadius: 2, overflow: 'hidden' }}>
          <Box p={2} bgcolor="#F9FAFB">
            <Tabs 
              value={activeTab} 
              onChange={(_, newValue) => setActiveTab(newValue)}
              variant="scrollable"
              scrollButtons="auto"
            >
              <Tab 
                label="Évolution du Stock" 
                icon={<LineChartIcon size={16} />} 
                iconPosition="start"
              />
              <Tab 
                label="Catégories" 
                icon={<PieChartIcon size={16} />} 
                iconPosition="start"
              />
              <Tab 
                label="Mouvements" 
                icon={<BarChart2 size={16} />} 
                iconPosition="start"
              />
            </Tabs>
          </Box>

          <Divider />
          
          <Box p={3}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
              <Typography variant="h6" fontWeight="medium">
                {activeTab === 0 && "Évolution et Prévisions du Stock"}
                {activeTab === 1 && "Répartition par Catégorie"}
                {activeTab === 2 && "Mouvements de Stock Récents"}
              </Typography>
              
              <Box display="flex" gap={2} alignItems="center">
                {activeTab === 0 && (
                  <Select
                    value={timeRange}
                    onChange={(e) => setTimeRange(e.target.value)}
                    size="small"
                    sx={{ minWidth: 120 }}
                  >
                    <MenuItem value="3 mois">3 mois</MenuItem>
                    <MenuItem value="6 mois">6 mois</MenuItem>
                    <MenuItem value="1 an">1 an</MenuItem>
                  </Select>
                )}
                <Tooltip title="Filtrer">
                  <IconButton size="small">
                    <Filter size={18} />
                  </IconButton>
                </Tooltip>
              </Box>
            </Box>

            <Box height={350}>
              <ResponsiveContainer width="100%" height="100%">
                {activeTab === 0 && (
                  <AreaChart data={previsions} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorStock" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#82ca9d" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorPrev" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorDemande" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#ffc658" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#ffc658" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="mois" />
                    <YAxis />
                    <RechartsTooltip contentStyle={{ borderRadius: 8, boxShadow: '0 0 10px rgba(0,0,0,0.1)' }} />
                    <Legend 
                      verticalAlign="top" 
                      height={36}
                      payload={[
                        { value: 'Stock Réel', type: 'line', color: '#82ca9d' },
                        { value: 'Prévision IA', type: 'line', color: '#8884d8' },
                        { value: 'Demande', type: 'line', color: '#ffc658' }
                      ]} 
                    />
                    <Area type="monotone" dataKey="quantite" stroke="#82ca9d" fillOpacity={1} fill="url(#colorStock)" name="Stock Réel" strokeWidth={2} />
                    <Area type="monotone" dataKey="prevision" stroke="#8884d8" fillOpacity={0.3} fill="url(#colorPrev)" name="Prévision IA" strokeWidth={2} />
                    <Line type="monotone" dataKey="demande" stroke="#ffc658" name="Demande" strokeWidth={2} />
                  </AreaChart>
                )}
                
                {activeTab === 1 && (
                  <PieChart>
                    <Pie
                      data={inventoryByCategory}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={130}
                      dataKey="value"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {inventoryByCategory.map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={COLORS[index % COLORS.length]} 
                          stroke="white"
                          strokeWidth={2}
                        />
                      ))}
                    </Pie>
                    <RechartsTooltip formatter={(value) => [`${value} unités`, 'Quantité']} />
                    <Legend 
                      formatter={(value, entry) => (
                        <span style={{ color: entry.color }}>{value}</span>
                      )}
                    />
                  </PieChart>
                )}
                
                {activeTab === 2 && (
                  <BarChart data={stockHistory} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <RechartsTooltip />
                    <Legend />
                    <Bar dataKey="entrees" name="Entrées" fill="#4ade80" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="sorties" name="Sorties" fill="#8884d8" radius={[4, 4, 0, 0]} />
                  </BarChart>
                )}
              </ResponsiveContainer>
            </Box>
          </Box>
        </Paper>
      </Box>
      
      {/* Alert pour les notifications système */}
      <Snackbar
        open={alertOpen}
        autoHideDuration={6000}
        onClose={() => setAlertOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          onClose={() => setAlertOpen(false)} 
          severity={alertMessage.includes('Erreur') ? 'error' : 'success'} 
          sx={{ width: '100%' }}
        >
          {alertMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default StockDashboard;
