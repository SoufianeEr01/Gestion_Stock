// src/pages/RegistrePage.jsx
import React, { useState, useRef } from "react";
import { 
  Container, 
  Typography, 
  Paper, 
  Button, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  Box,
  Divider,
  IconButton,
  useTheme,
  useMediaQuery
} from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import ShowRegistre from "../Registre/Compone/ShowRegistre";
import AddRegister from "../Registre/Compone/AddRegistre";

const RegistrePage = () => {
  const [open, setOpen] = useState(false);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
  // Référence pour accéder aux méthodes du ShowRegistre
  const registreRef = useRef(null);

  const handleOpenDialog = () => setOpen(true);
  const handleCloseDialog = () => setOpen(false);

  // Fonction pour rafraîchir la liste des utilisateurs
  const handleUserAdded = () => {
    // Utilise la référence pour appeler la méthode de rechargement
    if (registreRef.current) {
      registreRef.current.refreshUsers();
    }
    // Ferme la boîte de dialogue après l'ajout
    handleCloseDialog();
  };

  return (
    <Container maxWidth="lg">
      {/* Header Section with improved styling */}
      <Box 
        sx={{ 
          py: 3, 
          mb: 4,
          display: 'flex', 
          flexDirection: { xs: 'column', md: 'row' }, 
          justifyContent: 'space-between',
          alignItems: { xs: 'center', md: 'center' },
          gap: 2
        }}
      >
        <Typography 
          variant="h4" 
          component="h1" 
          sx={{ 
            fontWeight: 600,
            color: theme => theme.palette.primary.main,
            textAlign: { xs: 'center', md: 'left' }
          }}
        >
          Gestion des Registres
        </Typography>
        
        <Button 
          variant="contained" 
          color="primary" 
          onClick={handleOpenDialog}
          startIcon={<AddIcon />}
          sx={{ 
            px: 3, 
            py: 1,
            borderRadius: 2,
            boxShadow: 2
          }}
        >
          Ajouter un Registre
        </Button>
      </Box>
      
      <Divider sx={{ mb: 4 }} />
      
      {/* Main Content Section with ref */}
      <Box sx={{ mb: 4 }}>
        <ShowRegistre ref={registreRef} />
      </Box>

      {/* Improved Dialog */}
      <Dialog 
        open={open} 
        onClose={handleCloseDialog} 
        maxWidth="sm" 
        fullWidth
        fullScreen={fullScreen}
        PaperProps={{
          sx: {
            borderRadius: { xs: 0, sm: 2 },
            overflow: 'hidden'
          }
        }}
      >
        <DialogTitle sx={{ 
          bgcolor: 'primary.main', 
          color: 'primary.contrastText',
          position: 'relative',
          py: 2,
          textAlign: 'center',
        }}>
          Ajouter un nouveau gestionnaire
          <IconButton 
            onClick={handleCloseDialog}
            sx={{ 
              color: 'white', 
              position: 'absolute', 
              right: 8, 
              top: '50%', 
              transform: 'translateY(-50%)' 
            }}
            size="small"
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        
        <DialogContent sx={{ p: 3, pt: 4 }}>
          <AddRegister onClose={handleCloseDialog} onSuccess={handleUserAdded} />
        </DialogContent>
        
      
      </Dialog>
    </Container>
  );
};

export default RegistrePage;
