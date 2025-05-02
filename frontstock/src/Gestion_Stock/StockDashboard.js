import { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Typography,
  Paper,
  IconButton,
  Button,
  Select,
  MenuItem,
  Divider,
  Collapse,
  Card,
  CardContent,
  Chip,
} from '@mui/material';
import {
  TrendingUp, Package, AlertCircle, DollarSign,
  ChevronRight, ChevronDown, ChevronUp
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart, Line,
  BarChart, Bar,
  XAxis, YAxis, CartesianGrid,
  Tooltip, Legend,
} from 'recharts';

const StockDashboard = () => {
  const [statistiques, setStatistiques] = useState({
    totalStock: 0,
    lowStockCount: 0,
    valeurTotale: 0,
    topProduits: [],
  });

  const [previsions, setPrevisions] = useState([
    { mois: "Jan", quantite: 400, prevision: 420 },
    { mois: "Fév", quantite: 300, prevision: 320 },
    { mois: "Mar", quantite: 500, prevision: 520 },
    { mois: "Avr", quantite: 700, prevision: 650 },
    { mois: "Mai", quantite: 600, prevision: 630 },
    { mois: "Juin", quantite: 800, prevision: 820 },
  ]);

  const [inventoryByCategory, setInventoryByCategory] = useState([
    { name: 'Ciment', value: 350 },
    { name: 'Peinture', value: 275 },
    { name: 'Béton', value: 210 },
    { name: 'Bois', value: 190 },
    { name: 'Acier', value: 180 },
  ]);

  const [expanded, setExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState('previsions');

  useEffect(() => {
    setStatistiques({
      totalStock: 1530,
      lowStockCount: 3,
      valeurTotale: 91200,
      topProduits: [
        { nom: "Ciment", quantite: 124, tendance: "up" },
        { nom: "Peinture", quantite: 98, tendance: "down" },
        { nom: "Béton", quantite: 87, tendance: "up" }
      ]
    });
  }, []);

  const StatCard = ({ title, value, icon, color }) => (
    <Paper elevation={2} sx={{ p: 2, display: 'flex', flexDirection: 'column', bgcolor: color.bg }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
        <Typography variant="subtitle2" color="text.secondary">{title}</Typography>
        <Box p={1} bgcolor={color.iconBg} borderRadius="50%">
          {icon}
        </Box>
      </Box>
      <Typography variant="h5" fontWeight="bold">{value}</Typography>
    </Paper>
  );

  const TopProductItem = ({ product }) => {
    const trendIcon = product.tendance === "up"
      ? <ChevronUp size={16} color="green" />
      : <ChevronDown size={16} color="red" />;

    return (
      <Box display="flex" justifyContent="space-between" py={1}>
        <Box display="flex" alignItems="center">
          <Box width={8} height={8} borderRadius="50%" bgcolor="primary.main" mr={1} />
          <Typography>{product.nom}</Typography>
        </Box>
        <Box display="flex" alignItems="center">
          <Typography mr={0.5}>{product.quantite}</Typography>
          {trendIcon}
        </Box>
      </Box>
    );
  };

  return (
    <Box p={4} bgcolor="#f9fafb" minHeight="100vh">
      <Box maxWidth="lg" mx="auto">

        {/* Header */}
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
          <Typography variant="h5" fontWeight="bold">Tableau de Bord Stock</Typography>
          <Paper elevation={1} sx={{ px: 2, py: 1, display: 'flex', alignItems: 'center' }}>
            <Typography variant="body2" color="text.secondary" mr={1}>Dernière mise à jour: Aujourd'hui</Typography>
            <Button size="small" color="primary">Actualiser</Button>
          </Paper>
        </Box>

        {/* Stat Cards */}
        <Grid container spacing={3} mb={4}>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard title="Stock Total" value={statistiques.totalStock} icon={<Package size={20} color="#3B82F6" />} color={{ bg: 'white', iconBg: '#DBEAFE' }} />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard title="Faible Stock" value={statistiques.lowStockCount} icon={<AlertCircle size={20} color="#EF4444" />} color={{ bg: '#FFF1F2', iconBg: '#FECACA' }} />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard title="Valeur Totale" value={`${statistiques.valeurTotale} MAD`} icon={<DollarSign size={20} color="#10B981" />} color={{ bg: 'white', iconBg: '#D1FAE5' }} />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard title="Prévision Demande" value="↑ 12%" icon={<TrendingUp size={20} color="#8B5CF6" />} color={{ bg: 'white', iconBg: '#E9D5FF' }} />
          </Grid>
        </Grid>

        {/* Graph & Top Produits */}
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Paper elevation={2} sx={{ p: 2 }}>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Box>
                  <Button size="small" variant={activeTab === 'previsions' ? 'contained' : 'outlined'} onClick={() => setActiveTab('previsions')} sx={{ mr: 1 }}>
                    Prévisions
                  </Button>
                  <Button size="small" variant={activeTab === 'categorie' ? 'contained' : 'outlined'} onClick={() => setActiveTab('categorie')}>
                    Par Catégorie
                  </Button>
                </Box>
                <Select defaultValue="6 mois" size="small">
                  <MenuItem value="6 mois">6 mois</MenuItem>
                  <MenuItem value="1 an">1 an</MenuItem>
                  <MenuItem value="2 ans">2 ans</MenuItem>
                </Select>
              </Box>
              <Box height={300}>
                <ResponsiveContainer width="100%" height="100%">
                  {activeTab === 'previsions' ? (
                    <LineChart data={previsions}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="mois" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="quantite" stroke="#3B82F6" name="Réel" strokeWidth={2} />
                      <Line type="monotone" dataKey="prevision" stroke="#10B981" name="IA Prédit" strokeWidth={2} strokeDasharray="5 5" />
                    </LineChart>
                  ) : (
                    <BarChart data={inventoryByCategory}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="value" fill="#3B82F6" name="Quantité" />
                    </BarChart>
                  )}
                </ResponsiveContainer>
              </Box>
            </Paper>
          </Grid>

          <Grid item xs={12} md={4}>
            <Paper elevation={2} sx={{ p: 2 }}>
              <Box display="flex" justifyContent="space-between" mb={2}>
                <Typography fontWeight="medium">Top Produits</Typography>
                <Button size="small" endIcon={<ChevronRight size={14} />} onClick={() => setExpanded(!expanded)}>
                  {expanded ? "Voir moins" : "Voir plus"}
                </Button>
              </Box>

              {statistiques.topProduits.map((product, idx) => (
                <TopProductItem key={idx} product={product} />
              ))}

              <Collapse in={expanded}>
                <TopProductItem product={{ nom: "Bois", quantite: 65, tendance: "down" }} />
                <TopProductItem product={{ nom: "Acier", quantite: 54, tendance: "up" }} />
              </Collapse>

              <Divider sx={{ my: 2 }} />
              <Typography variant="body2" fontWeight="medium" color="text.secondary" mb={1}>
                Produits en Stock Faible
              </Typography>
              <Card sx={{ bgcolor: '#FEE2E2' }}>
                <CardContent sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2 }}>
                  <Box>
                    <Typography fontWeight="medium">Peinture Extérieure</Typography>
                    <Typography variant="body2" color="text.secondary">5 unités restantes</Typography>
                  </Box>
                  <Button size="small" color="primary">Commander</Button>
                </CardContent>
              </Card>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default StockDashboard;
