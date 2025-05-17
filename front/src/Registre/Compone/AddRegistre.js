import React, { useState } from 'react';
import { 
  TextField, 
  Button, 
  Typography, 
  Stack, 
  Alert, 
  Box, 
  Paper,
  InputAdornment,
  Divider,
  Fade,
  Chip,
  CircularProgress
} from '@mui/material';
import { registerUser } from '../Api/ApiRegistre';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';

const AddRegister = ({ onSuccess, onClose }) => {
  const [user, setUser] = useState({
    username: '',
    email: '',
    password: '',
    role: 'GESTIONNAIRE',  // Valeur par défaut pour le rôle
    enabled: true,         // Valeur par défaut pour 'enabled'
  });

  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage('');
    setIsSubmitting(true);

    try {
      await registerUser(user);
      setSuccessMessage('Utilisateur enregistré avec succès !');
      setUser({
        username: '',
        email: '',
        password: '',
        role: 'GESTIONNAIRE',
        enabled: true,
      });
      
      if (onSuccess) onSuccess();
      setTimeout(() => {
        onClose && onClose();
      }, 2000);
      
    } catch (err) {
      setError("Une erreur est survenue lors de l'enregistrement.");
      console.log("Erreur:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box sx={{ p: 1 }}>
     
 
      
      <Box component="form" onSubmit={handleSubmit}>
        <Stack spacing={3}  mt={4} mb={2}>
          <TextField
            label="Nom d'utilisateur"
            name="username"
            value={user.username}
            onChange={handleChange}
            required
            fullWidth
            variant="outlined"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <PersonAddIcon color="action" />
                </InputAdornment>
              ),
            }}
            helperText="Entrez le nom d'utilisateur"
          />
          
          <TextField
            label="Email"
            name="email"
            type="email"
            value={user.email}
            onChange={handleChange}
            required
            fullWidth
            variant="outlined"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <EmailIcon color="action" />
                </InputAdornment>
              ),
            }}
            helperText="Entrez une adresse email valide"
          />
          
          <TextField
            label="Mot de passe"
            name="password"
            type="password"
            value={user.password}
            onChange={handleChange}
            required
            fullWidth
            variant="outlined"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LockIcon color="action" />
                </InputAdornment>
              ),
            }}
            helperText="6 caractères minimum"
          />
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <AdminPanelSettingsIcon color="action" />
            <Typography variant="body2" color="text.secondary" sx={{ mr: 2 }}>
              Rôle:
            </Typography>
            <Chip 
              label="GESTIONNAIRE" 
              color="primary" 
              variant="outlined"
              size="small"
            />
          </Box>
        </Stack>
        
        <Box sx={{ mt: 4 }}>
          {error && (
            <Fade in={!!error}>
              <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>
            </Fade>
          )}
          
          {successMessage && (
            <Fade in={!!successMessage}>
              <Alert 
                severity="success" 
                sx={{ mb: 2 }}
                icon={<CheckCircleOutlineIcon fontSize="inherit" />}
              >
                {successMessage}
              </Alert>
            </Fade>
          )}
          
          <Stack direction="row" spacing={2} justifyContent="flex-end" sx={{ mt: 2 }}>
            <Button 
              onClick={onClose} 
              color="inherit" 
              variant="outlined"
              disabled={isSubmitting}
            >
              Annuler
            </Button>
            
            <Button 
              type="submit" 
              variant="contained" 
              color="primary"
              disabled={isSubmitting}
              sx={{ 
                px: 3,
                boxShadow: 2,
                '&:hover': {
                  boxShadow: 4,
                }
              }}
              endIcon={isSubmitting && <CircularProgress size={20} color="inherit" />}
            >
              {isSubmitting ? 'Enregistrement...' : 'Enregistrer'}
            </Button>
          </Stack>
        </Box>
      </Box>
    </Box>
  );
};

export default AddRegister;
