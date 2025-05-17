import React, { useEffect, useState } from 'react';
import axios from 'axios';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

// Material UI imports
import { 
  Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Typography, Button, Chip, CircularProgress, Box, Container, Card, CardHeader,
  TablePagination, ThemeProvider, createTheme
} from '@mui/material';

// Material UI icons
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import InventoryIcon from '@mui/icons-material/Inventory';
import InboxIcon from '@mui/icons-material/Inbox';

// Create a theme with custom primary and secondary colors
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#f57c00',
    },
    success: {
      main: '#2e7d32',
    },
    warning: {
      main: '#ed6c02',
    },
  },
  typography: {
    fontFamily: [
      'Roboto',
      'Arial',
      'sans-serif',
    ].join(','),
  },
});

const Commande = () => {
  const [bons, setBons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    fetchPurchaseOrders();
  }, []);

  const fetchPurchaseOrders = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:8082/bonachats/en-attente');
      setBons(response.data);
    } catch (error) {
      console.error('Error fetching purchase orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const generatePDF = (bon) => {
    const doc = new jsPDF();
    
    // Add company logo/header with better styling
    doc.setFillColor(25, 118, 210); // Primary blue color
    doc.rect(0, 0, doc.internal.pageSize.width, 40, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text('ERRAAD AND FADDANI Inventory IA', 14, 20);
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text('Adresse: Les orangers Oulfa Casa   |   Tél: 05 22 00 00 00   |   Email: contact@societe.com', 14, 30);
    
    // Purchase order details with improved layout
    doc.setTextColor(0, 0, 0);
    doc.setFillColor(240, 240, 240);
    doc.rect(10, 50, doc.internal.pageSize.width - 20, 10, 'F');
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('BON D\'ACHAT', 14, 58);
    
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    
    // Create a better layout for details
    doc.text(`Produit: ${bon.nomProduit}`, 14, 80);
    doc.text(`Catégorie: ${bon.categorie}`, 120, 80);
    doc.text(`Description: ${bon.description}`, 14, 90);
    doc.text(`Quantité: ${bon.quantite}`, 14, 100);
    doc.text(`Prix Unitaire: ${bon.prixUnitaire} MAD`, 120, 100);
    doc.text(`Emplacement: ${bon.emplacement}`, 14, 110);
    
    // Draw a line to separate sections
    doc.line(10, 130, doc.internal.pageSize.width - 10, 130);
    
    // Supplier details with better formatting
    doc.setFillColor(240, 240, 240);
    doc.rect(10, 140, doc.internal.pageSize.width - 20, 10, 'F');
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('FOURNISSEUR', 14, 148);
    
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.text(`Nom: ${bon.nomFournisseur}`, 14, 160);
    doc.text(`Adresse: ${bon.adresseFournisseur}`, 14, 170);
    doc.text(`Email: ${bon.emailFournisseur}`, 14, 180);
    doc.text(`Téléphone: ${bon.telephoneFournisseur}`, 14, 190);
    
    // Status with better styling
    if (bon.statut === 'Approuvé') {
      doc.setFillColor(230, 255, 230); // Light green for approved
      doc.setTextColor(0, 125, 0); // Dark green text
    } else {
      doc.setFillColor(255, 240, 220); // Light orange for pending
      doc.setTextColor(175, 85, 0); // Dark orange text
    }

    // Calculate width based on text length
    const textWidth = doc.getStringUnitWidth(`Statut: ${bon.statut}`) * doc.internal.getFontSize();
    doc.rect(10, 200, textWidth + 10, 15, 'F');
    doc.setFont('helvetica', 'bold');
    doc.text(`Statut: ${bon.statut}`, 14, 210);
    
    // Add date and reference number
    doc.setTextColor(100, 100, 100);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'italic');
    doc.text(`Date de Création: ${bon.dateCreation}`, 120, 210);
    doc.text(`Référence: BON-${bon.id}`, 120, 220);
    
    doc.save(`Bon_Achat_${bon.id}.pdf`);
  };

  const approuverBonAchat = async (id) => {
    try {
      await axios.put(`http://localhost:8082/bonachats/approuver/${id}`);
      setBons(bons.map(bon => bon.id === id ? { ...bon, statut: 'Approuvé' } : bon));
    } catch (error) {
      console.error('Error approving purchase order:', error);
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <ThemeProvider theme={theme}>
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Card elevation={2} sx={{ mb: 3 }}>
          <CardHeader 
            title={
              <Box display="flex" alignItems="center">
                <InventoryIcon sx={{ mr: 1, color: 'primary.main' }}/>
                <Typography variant="h5">Bons d'Achat</Typography>
              </Box>
            }
            sx={{ 
              bgcolor: 'background.paper',
              borderBottom: '1px solid',
              borderColor: 'divider'
            }}
          />
          
          {loading ? (
            <Box display="flex" justifyContent="center" alignItems="center" p={4}>
              <CircularProgress />
              <Typography variant="body1" sx={{ ml: 2 }}>Chargement des bons d'achat...</Typography>
            </Box>
          ) : bons.length === 0 ? (
            <Box display="flex" flexDirection="column" alignItems="center" py={6} px={2}>
              <InboxIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2, opacity: 0.6 }} />
              <Typography variant="h6" color="text.secondary">Aucun bon d'achat en attente</Typography>
            </Box>
          ) : (
            <>
              <TableContainer component={Paper} elevation={0}>
                <Table sx={{ minWidth: 650 }} aria-label="bons d'achat table">
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 'bold' }}>Produit</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Catégorie</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Quantité</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Prix</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Statut</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Fournisseur</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Date</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {bons
                      .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                      .map((bon) => (
                      <TableRow key={bon.id} hover>
                        <TableCell>{bon.nomProduit}</TableCell>
                        <TableCell>{bon.categorie}</TableCell>
                        <TableCell>{bon.quantite}</TableCell>
                        <TableCell>{bon.prixUnitaire} MAD</TableCell>
                        <TableCell>
                          <Chip
                            icon={bon.statut === 'Approuvé' ? 
                              <CheckCircleIcon fontSize="small" /> : 
                              <HourglassEmptyIcon fontSize="small" />}
                            label={bon.statut}
                            color={bon.statut === 'Approuvé' ? 'success' : 'warning'}
                            variant="outlined"
                            size="small"
                          />
                        </TableCell>
                        <TableCell>{bon.nomFournisseur}</TableCell>
                        <TableCell>{bon.dateCreation}</TableCell>
                        <TableCell>
                          <Button
                            variant="contained"
                            size="small"
                            color="primary"
                            startIcon={<FileDownloadIcon />}
                            onClick={() => generatePDF(bon)}
                            sx={{ mr: 1, mb: { xs: 1, sm: 0 } }}
                          >
                            PDF
                          </Button>
                          {bon.statut === 'En attente' && (
                            <Button
                              variant="contained"
                              size="small"
                              color="secondary"
                              startIcon={<CheckCircleIcon />}
                              onClick={() => approuverBonAchat(bon.id)}
                            >
                              Approuver
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={bons.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                labelRowsPerPage="Lignes par page:"
                labelDisplayedRows={({ from, to, count }) => `${from}-${to} sur ${count}`}
              />
            </>
          )}
        </Card>
      </Container>
    </ThemeProvider>
  );
};

export default Commande;
