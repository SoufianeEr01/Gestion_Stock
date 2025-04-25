import React, { useEffect, useState } from 'react';
import {
  Grid, Card, CardContent, Typography, Box, Divider
} from '@mui/material';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';

const StockDashboard = () => {
  const [statistiques, setStatistiques] = useState({
    totalStock: 0,
    lowStockCount: 0,
    valeurTotale: 0,
    topProduits: [],
  });

  const [previsions, setPrevisions] = useState([
    { mois: "Jan", quantite: 400 },
    { mois: "Fév", quantite: 300 },
    { mois: "Mar", quantite: 500 },
    { mois: "Avr", quantite: 700 },
  ]);

  useEffect(() => {
    // Simuler les stats via des appels API fictifs
    setStatistiques({
      totalStock: 1530,
      lowStockCount: 3,
      valeurTotale: 91200,
      topProduits: ["Ciment", "Peinture", "Béton"]
    });
  }, []);

  const StatCard = ({ title, value, color = 'primary.main', bg = '#fff' }) => (
    <Card sx={{ minWidth: 200, boxShadow: 3, backgroundColor: bg }}>
      <CardContent>
        <Typography variant="subtitle1" fontWeight="bold">{title}</Typography>
        <Typography variant="h4" color={color}>{value}</Typography>
      </CardContent>
    </Card>
  );

  return (
    <Box sx={{ p: 3 }}>
      <Grid container spacing={3}>

        {/* Cartes statistiques */}
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="Stock total" value={statistiques.totalStock} />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="Faible stock" value={statistiques.lowStockCount} color="error.main" bg="#ffebee" />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="Valeur totale du stock" value={`${statistiques.valeurTotale} MAD`} color="success.main" />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ minWidth: 200, boxShadow: 3 }}>
            <CardContent>
              <Typography variant="subtitle1" fontWeight="bold">Top produits</Typography>
              <Divider sx={{ my: 1 }} />
              {statistiques.topProduits.map((prod, idx) => (
                <Typography key={idx} variant="body2">• {prod}</Typography>
              ))}
            </CardContent>
          </Card>
        </Grid>

        {/* Graphique de prévision IA */}
        <Grid item xs={12} md={12}>
          <Card sx={{ height: 350, boxShadow: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>📈 Prévisions IA - Demande prochaine</Typography>
              <ResponsiveContainer width="100%" height={280}>
                <LineChart data={previsions}>
                  <CartesianGrid stroke="#e0e0e0" strokeDasharray="5 5" />
                  <XAxis dataKey="mois" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="quantite" stroke="#1976d2" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

      </Grid>
    </Box>
  );
};

export default StockDashboard;
