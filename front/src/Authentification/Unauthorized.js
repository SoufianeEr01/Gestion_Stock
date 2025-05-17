import React from 'react';
import { 
  Box, 
  Typography, 
  Button, 
  Container, 
  Paper, 
  Divider 
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import BlockIcon from '@mui/icons-material/Block';
import LockIcon from '@mui/icons-material/Lock';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import HomeIcon from '@mui/icons-material/Home';

const Unauthorized = () => {
  const navigate = useNavigate();

  return (
    <Container maxWidth="sm" sx={{ 
      height: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center' 
    }}>
      <Paper 
        elevation={4} 
        sx={{ 
          p: 4, 
          textAlign: 'center',
          borderRadius: 2,
          border: '1px solid #e0e0e0',
          backgroundColor: '#fff',
          width: '100%'
        }}
      >
        <Box 
          sx={{ 
            mb: 3,
            display: 'flex', 
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          <Box 
            sx={{
              backgroundColor: 'error.main',
              borderRadius: '50%',
              width: 80,
              height: 80,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              mb: 2
            }}
          >
            <LockIcon sx={{ fontSize: 40, color: 'white' }} />
          </Box>
        </Box>

        <Typography variant="h4" component="h1" gutterBottom color="error" fontWeight="bold">
          Accès Non Autorisé
        </Typography>

        <Divider sx={{ my: 3 }} />
        
        <Typography variant="body1" color="text.secondary" paragraph>
          Vous n'avez pas les droits nécessaires pour accéder à cette page.
        </Typography>
        
        <Typography variant="body2" color="text.secondary" paragraph>
          Veuillez contacter votre administrateur si vous pensez que c'est une erreur.
        </Typography>
        
        <Box sx={{ mt: 4, display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2, justifyContent: 'center' }}>
          <Button 
            variant="outlined" 
            color="primary" 
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate(-1)}
            sx={{ px: 3, py: 1 }}
          >
            Retour
          </Button>
          
          <Button 
            variant="contained" 
            color="primary" 
            startIcon={<HomeIcon />}
            onClick={() => navigate('/dashboard')}
            sx={{ px: 3, py: 1 }}
          >
            Tableau de Bord
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default Unauthorized;