import React, { useEffect, useState, useRef } from 'react';
import {
  Container,
  Typography,
  Tabs,
  Tab,
  Box,
  Grid,
  Card,
  CardContent,
  Stack,
  Button,
  Paper,
  Divider,
  Chip,
  Alert,
  IconButton,
  Tooltip as MUITooltip,
  CircularProgress,
  Snackbar
} from '@mui/material';
import { Download, Print, Warning, Inventory, WarehouseOutlined, CalendarMonth } from '@mui/icons-material';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { getAllStocks } from '../Gestion_Stock/Api/ApiStock';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const ReportingStock = () => {
  const [stocks, setStocks] = useState([]);
  const [tabIndex, setTabIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [pdfLoading, setPdfLoading] = useState(false);
  const [notification, setNotification] = useState({ open: false, message: '' });
  
  const reportRef = useRef(null);
  const tabContentRef = useRef(null);

  useEffect(() => {
    setLoading(true);
    getAllStocks()
      .then(data => {
        setStocks(data);
        setLoading(false);
      })
      .catch(error => {
        console.error("Erreur lors du chargement des stocks:", error);
        setLoading(false);
        setNotification({
          open: true,
          message: "Erreur lors du chargement des données"
        });
      });
  }, []);

  const handlePrint = () => window.print();
  
  const handleDownload = async () => {
    if (!reportRef.current || !tabContentRef.current) return;
    
    try {
      setPdfLoading(true);
      
      // Titre du rapport basé sur l'onglet courant
      let reportTitle = "Rapport de Stock";
      switch (tabIndex) {
        case 0:
          reportTitle = "Rapport de Réapprovisionnement";
          break;
        case 1:
          reportTitle = "Rapport de Produits Expirés";
          break;
        case 2:
          reportTitle = "Rapport de Stock par Emplacement";
          break;
      }
      
      // Créer un nouveau document PDF
      const pdf = new jsPDF('p', 'mm', 'a4');
      
      // Ajouter un en-tête
      pdf.setFontSize(20);
      pdf.text(reportTitle, 105, 15, { align: 'center' });
      pdf.setFontSize(10);
      const today = new Date().toLocaleDateString();
      pdf.text(`Généré le ${today}`, 105, 22, { align: 'center' });
      pdf.line(20, 25, 190, 25);
      
      // Capturer l'en-tête du rapport
      const headerCanvas = await html2canvas(reportRef.current, {
        scale: 2,
        logging: false,
        useCORS: true
      });
      const headerImg = headerCanvas.toDataURL('image/png');
      pdf.addImage(headerImg, 'PNG', 10, 30, 190, 20);
      
      // Capturer le contenu de l'onglet
      const contentCanvas = await html2canvas(tabContentRef.current, {
        scale: 2,
        logging: false,
        useCORS: true,
        windowWidth: 1200,
        height: tabContentRef.current.scrollHeight
      });
      
      const contentImg = contentCanvas.toDataURL('image/png');
      const contentImgHeight = (contentCanvas.height * 190) / contentCanvas.width;
      
      // Si le contenu est trop grand, divisez-le en plusieurs pages
      if (contentImgHeight > 220) {
        // Hauteur disponible sur la première page après l'en-tête
        const firstPageHeight = 230;
        const ratio = contentCanvas.width / 190;
        
        // Ajouter la première partie du contenu
        pdf.addImage(contentImg, 'PNG', 10, 55, 190, firstPageHeight);
        
        // Calculer combien de hauteur du contenu a été utilisée
        let usedHeight = firstPageHeight * ratio;
        
        // Pour chaque page supplémentaire
        let remainingHeight = contentCanvas.height - usedHeight;
        let pageIndex = 1;
        
        while (remainingHeight > 0) {
          // Ajouter une nouvelle page
          pdf.addPage();
          
          // Hauteur disponible sur les pages suivantes
          const pageHeight = Math.min(remainingHeight / ratio, 270);
          
          // Calculer la position de départ dans l'image source
          const sourceY = usedHeight;
          
          // Ajouter une partie de l'image à la nouvelle page
          pdf.addImage(
            contentImg, 
            'PNG', 
            10, 10, 
            190, pageHeight, 
            undefined, 
            undefined, 
            undefined, 
            undefined, 
            -sourceY / ratio
          );
          
          // Mettre à jour les compteurs
          usedHeight += pageHeight * ratio;
          remainingHeight -= pageHeight * ratio;
          pageIndex++;
        }
      } else {
        // Si le contenu tient sur une seule page
        pdf.addImage(contentImg, 'PNG', 10, 55, 190, contentImgHeight);
      }
      
      // Ajouter un pied de page
      const pageCount = pdf.internal.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        pdf.setPage(i);
        pdf.setFontSize(8);
        pdf.text(`Page ${i} sur ${pageCount}`, 105, 290, { align: 'center' });
      }
      
      // Enregistrer le PDF
      pdf.save(`${reportTitle.replace(/\s/g, '_')}.pdf`);
      
      setNotification({
        open: true,
        message: "PDF généré avec succès"
      });
    } catch (error) {
      console.error("Erreur lors de la génération du PDF:", error);
      setNotification({
        open: true,
        message: "Erreur lors de la génération du PDF"
      });
    } finally {
      setPdfLoading(false);
    }
  };

  const today = new Date().toISOString().split('T')[0];

  const filtered = {
    reappro: stocks.filter(s => s.quantite_importe - s.quantite_reserver < s.seuil_reapprovisionnement),
    expires: stocks.filter(s => s.date_expiration < today),
  };

  const groupedByEmplacement = stocks.reduce((acc, stock) => {
    const type = stock.emplacement?.type || 'Inconnu';
    if (!acc[type]) acc[type] = [];
    acc[type].push(stock);
    return acc;
  }, {});

  const renderTabContent = () => {
    if (loading) {
      return (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <Typography>Chargement des données...</Typography>
        </Box>
      );
    }

    switch (tabIndex) {
      case 0:
        return renderReapproTab();
      case 1:
        return renderExpiresTab();
      case 2:
        return renderEmplacementTab();
      default:
        return null;
    }
  };

  const renderReapproTab = () => {
    if (filtered.reappro.length === 0) {
      return (
        <Alert severity="info" sx={{ mt: 3 }}>
          Aucun produit à réapprovisionner pour le moment.
        </Alert>
      );
    }

    return (
      <Paper elevation={3} sx={{ p: 3, mt: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Warning color="error" sx={{ mr: 1 }} />
          <Typography variant="h6">Produits à Réapprovisionner</Typography>
          <Chip 
            label={`${filtered.reappro.length} produits`} 
            color="error" 
            size="small" 
            sx={{ ml: 2 }} 
          />
        </Box>
        
        <Divider sx={{ mb: 3 }} />
        
        <ResponsiveContainer width="100%" height={400}>
          <BarChart 
            data={filtered.reappro}
            margin={{ top: 20, right: 30, left: 20, bottom: 70 }}
          >
            <XAxis 
              dataKey="produit.nom" 
              angle={-45} 
              textAnchor="end"
              height={70}
            />
            <YAxis />
            <Tooltip 
              formatter={(value, name) => [value, 'Quantité manquante']}
              labelFormatter={(label) => `Produit: ${label}`}
            />
            <Legend />
            <Bar 
              name="Quantité manquante" 
              dataKey={(s) => s.seuil_reapprovisionnement - (s.quantite_importe - s.quantite_reserver)} 
              fill="#f44336" 
            />
          </BarChart>
        </ResponsiveContainer>

        <Box sx={{ mt: 3 }}>
          <Typography variant="subtitle2" sx={{ mb: 2 }}>Liste détaillée</Typography>
          <Grid container spacing={2}>
            {filtered.reappro.map(s => (
              <Grid item xs={12} sm={6} md={4} key={s.id}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="h6" color="primary">{s.produit.nom}</Typography>
                    <Stack spacing={1} sx={{ mt: 1 }}>
                      <Typography variant="body2">
                        Stock disponible: <strong>{s.quantite_importe - s.quantite_reserver}</strong>
                      </Typography>
                      <Typography variant="body2">
                        Seuil d'alerte: <strong>{s.seuil_reapprovisionnement}</strong>
                      </Typography>
                      <Typography variant="body2">
                        Quantité à commander: <strong>{s.seuil_reapprovisionnement - (s.quantite_importe - s.quantite_reserver)}</strong>
                      </Typography>
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Paper>
    );
  };

  const renderExpiresTab = () => {
    if (filtered.expires.length === 0) {
      return (
        <Alert severity="success" sx={{ mt: 3 }}>
          Aucun produit expiré.
        </Alert>
      );
    }

    return (
      <Paper elevation={3} sx={{ p: 3, mt: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <CalendarMonth color="error" sx={{ mr: 1 }} />
          <Typography variant="h6">Produits Expirés</Typography>
          <Chip 
            label={`${filtered.expires.length} produits`} 
            color="error" 
            size="small" 
            sx={{ ml: 2 }} 
          />
        </Box>
        
        <Divider sx={{ mb: 3 }} />
        
        <Grid container spacing={2}>
          {filtered.expires.map(s => (
            <Grid item xs={12} sm={6} md={4} key={s.id}>
              <Card 
                variant="outlined" 
                sx={{ borderColor: 'error.light', backgroundColor: 'error.lightest' }}
              >
                <CardContent>
                  <Typography variant="h6" color="error">{s.produit.nom}</Typography>
                  <Stack spacing={1} sx={{ mt: 1 }}>
                    <Typography variant="body2">
                      Quantité disponible: <strong>{s.quantite_importe - s.quantite_reserver}</strong>
                    </Typography>
                    <Typography variant="body2">
                      Emplacement: <strong>{s.emplacement.nom}</strong>
                    </Typography>
                    <Typography variant="body2">
                      Date d'expiration: <strong>{new Date(s.date_expiration).toLocaleDateString()}</strong>
                    </Typography>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Paper>
    );
  };

  const renderEmplacementTab = () => {
    if (Object.keys(groupedByEmplacement).length === 0) {
      return (
        <Alert severity="info" sx={{ mt: 3 }}>
          Aucune donnée d'emplacement disponible.
        </Alert>
      );
    }

    return (
      <Paper elevation={3} sx={{ p: 3, mt: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <WarehouseOutlined sx={{ mr: 1 }} />
          <Typography variant="h6">Stock par Emplacement</Typography>
        </Box>
        
        <Divider sx={{ mb: 3 }} />
        
        {Object.entries(groupedByEmplacement).map(([type, group]) => (
          <Box key={type} mb={4}>
            <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
              <Typography variant="subtitle1" fontWeight="bold">
                {type}
                <Chip 
                  label={`${group.length} produits`} 
                  color="primary" 
                  size="small" 
                  sx={{ ml: 2 }} 
                />
              </Typography>
            </Paper>
            
            <ResponsiveContainer width="100%" height={300}>
              <BarChart 
                data={group}
                margin={{ top: 20, right: 30, left: 20, bottom: 70 }}
                barSize={20}
                barGap={2}
              >
                <XAxis 
                  dataKey="produit.nom" 
                  angle={-45} 
                  textAnchor="end"
                  height={70}
                />
                <YAxis />
                <Tooltip 
                  formatter={(value, name) => [value, name === "Quantité importée" ? "Quantité importée" : "Quantité réservée"]}
                  labelFormatter={(label) => `Produit: ${label}`}
                />
                <Legend verticalAlign="top" />
                <Bar 
                  name="Quantité importée" 
                  dataKey="quantite_importe" 
                  fill="#1976d2" 
                  minPointSize={3}
                />
                <Bar 
                  name="Quantité réservée" 
                  dataKey="quantite_reserver" 
                  fill="#ff9800" 
                  minPointSize={3}
                />
              </BarChart>
            </ResponsiveContainer>
          </Box>
        ))}
      </Paper>
    );
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 3, mb: 3 }} ref={reportRef}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h4" component="h1">
            <Inventory sx={{ mr: 1, verticalAlign: 'middle' }} />
            Rapports des Stocks
          </Typography>
          
          <Stack direction="row" spacing={1}>
            <MUITooltip title="Télécharger le rapport en PDF">
              <Button 
                variant="outlined" 
                startIcon={pdfLoading ? <CircularProgress size={20} /> : <Download />} 
                onClick={handleDownload}
                color="primary"
                disabled={pdfLoading}
              >
                {pdfLoading ? 'Génération...' : 'Télécharger PDF'}
              </Button>
            </MUITooltip>
            
            <MUITooltip title="Imprimer le rapport">
              <Button 
                variant="contained" 
                startIcon={<Print />} 
                onClick={handlePrint}
                color="primary"
              >
                Imprimer
              </Button>
            </MUITooltip>
          </Stack>
        </Box>
        
        <Divider sx={{ mb: 2 }} />
        
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs 
            value={tabIndex} 
            onChange={(e, newValue) => setTabIndex(newValue)} 
            aria-label="rapport de stock tabs"
            variant="fullWidth"
          >
            <Tab 
              label="Réapprovisionnement" 
              icon={<Warning />} 
              iconPosition="start" 
              sx={{ fontWeight: 'bold' }} 
            />
            <Tab 
              label="Produits Expirés" 
              icon={<CalendarMonth />} 
              iconPosition="start" 
              sx={{ fontWeight: 'bold' }} 
            />
            <Tab 
              label="Par Emplacement" 
              icon={<WarehouseOutlined />} 
              iconPosition="start" 
              sx={{ fontWeight: 'bold' }} 
            />
          </Tabs>
        </Box>
      </Paper>

      <div ref={tabContentRef}>
        {renderTabContent()}
      </div>
      
      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={() => setNotification({ ...notification, open: false })}
        message={notification.message}
      />
    </Container>
  );
};

export default ReportingStock;