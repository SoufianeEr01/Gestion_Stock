import React, { useState, useEffect } from 'react';
import {
  TextField, Button, Typography, Box,
  Grid, Paper, InputAdornment, IconButton, Alert, useTheme, useMediaQuery
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { Login as LoginApi } from './Api/LoginApi';
import { useAuth } from './AuthContext'; // Ajout de l'import du contexte
import {
  Warehouse as WarehouseIcon,
  Person as PersonIcon,
  Lock as LockIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  Badge as BadgeIcon,
  ArrowForward as ArrowForwardIcon,
  Inventory as InventoryIcon
} from '@mui/icons-material';

const Login = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const location = useLocation();
  const from = location.state?.from?.pathname || "/dashboard";
  const { login } = useAuth(); // Récupère la fonction login du contexte

  useEffect(() => {
    document.documentElement.style.height = '100%';
    document.body.style.height = '100%';
    document.body.style.margin = '0';
    const rootElement = document.getElementById('root');
    if (rootElement) rootElement.style.height = '100%';
    return () => {
      document.documentElement.style.height = '';
      document.body.style.height = '';
      document.body.style.margin = '';
      if (rootElement) rootElement.style.height = '';
    };
  }, []);

  // États pour le formulaire de connexion
  const [loginData, setLoginData] = useState({
    username: '',
    password: ''
  });
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLoginInputChange = (e) => {
    const { name, value } = e.target;
    setLoginData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const validateLoginForm = () => {
    if (!loginData.username || !loginData.password) {
      setError('Veuillez remplir tous les champs.');
      return false;
    }
    return true;
  };

  // Fonction appelée en cas de succès de connexion
  const handleLoginSuccess = (responseData) => {
    const userData = {
      email: responseData.email,
      roles: responseData.roles,
      token: responseData.token,
    };
    login(userData); // Met à jour le contexte utilisateur
    navigate('/dashboard'); // Redirige vers le dashboard ou utilisez: navigate(from, { replace: true })
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (!validateLoginForm()) return;
    setIsSubmitting(true);
    try {
      const response = await LoginApi({
        email: loginData.username,
        password: loginData.password
      });
      setSuccess('Connexion réussie! Redirection...');
      handleLoginSuccess(response); // Utilise la fonction de succès
    } catch (err) {
      let msg = err.message || "Erreur lors de la connexion. Veuillez réessayer.";
      if (msg.startsWith("Erreur HTTP:")) {
        const jsonStart = msg.indexOf('{');
        if (jsonStart !== -1) {
          try {
            const json = JSON.parse(msg.substring(jsonStart));
            msg = json.message || msg;
          } catch {
            msg = msg.substring(msg.indexOf('-') + 1).trim();
          }
        } else {
          msg = msg.substring(msg.indexOf('-') + 1).trim();
        }
      }
      setError(msg);
      setIsSubmitting(false);
    }
  };

  // Animation variants
  const formVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, staggerChildren: 0.1 }
    },
    exit: { opacity: 0, y: -20, transition: { duration: 0.3 } }
  };
  const itemVariants = {
    hidden: { y: 15, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  // Liste des fonctionnalités pour l'affichage dans la sidebar
  const features = [
    { icon: <InventoryIcon />, text: "Suivi d'inventaire en temps réel" },
    { icon: <BadgeIcon />, text: "Gestion des fournisseurs" },
    { icon: <ArrowForwardIcon />, text: "Traçabilité des mouvements" },
  ];

  return (
    <Box
      sx={{
        height: '100%',
        width: '100%',
        display: 'flex',
        position: 'relative',
        overflow: 'hidden',
        background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 100%)`,
        minWidth: 400, // Ajout d'une largeur minimale pour la box d'authentification
      }}
    >
      {/* Éléments décoratifs d'arrière-plan */}
      <Box
        component={motion.div}
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.4 }}
        transition={{ duration: 2 }}
        sx={{
          position: 'absolute',
          top: '-20%',
          right: '-10%',
          width: '500px',
          height: '500px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255,255,255,0.2) 0%, transparent 70%)',
        }}
      />

      <Box
        component={motion.div}
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.3 }}
        transition={{ duration: 2, delay: 0.5 }}
        sx={{
          position: 'absolute',
          bottom: '-10%',
          left: '5%',
          width: '400px',
          height: '400px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255,255,255,0.15) 0%, transparent 70%)',
        }}
      />

      {/* Cercles rotatifs */}
      <Box
        component={motion.div}
        animate={{
          rotate: 360,
          transition: { duration: 60, ease: "linear", repeat: Infinity }
        }}
        sx={{
          position: 'absolute',
          width: '600px',
          height: '600px',
          borderRadius: '50%',
          border: '1px solid rgba(255,255,255,0.1)',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          pointerEvents: 'none',
        }}
      />

      <Grid container sx={{ height: '100%', zIndex: 1 }}>
        {/* Section gauche - Branding et fonctionnalités */}
        {!isMobile && (
          <Grid
            item
            md={3}
            sx={{
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              position: 'relative',
              paddingLeft: 4,
              paddingRight: 2,
            }}
          >
            <Box
              component={motion.div}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              sx={{ mb: 6, color: 'white' }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <WarehouseIcon sx={{ fontSize: 42, mr: 2 }} />
                <Typography variant="h4" fontWeight="bold">
                  StockManager
                </Typography>
              </Box>
              <Typography variant="h3" fontWeight="bold" sx={{ mb: 2 }}>
                Connectez-vous
              </Typography>
              <Typography variant="h6" sx={{ opacity: 0.8 }}>
                Notre plateforme vous permet de gérer efficacement votre inventaire en temps réel
              </Typography>
            </Box>

            <Box sx={{ mt: 2, color: 'white' }}>
              {features.map((item, index) => (
                <Box
                  component={motion.div}
                  key={index}
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + index * 0.2, duration: 0.7 }}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    mb: 3,
                    p: 2,
                    borderRadius: 2,
                    backgroundColor: 'rgba(255, 255, 255, 0.08)',
                  }}
                  whileHover={{
                    backgroundColor: 'rgba(255, 255, 255, 0.15)',
                    x: 5,
                    transition: { duration: 0.2 }
                  }}
                >
                  <Box sx={{
                    p: 1,
                    borderRadius: '50%',
                    bgcolor: 'rgba(255,255,255,0.2)',
                    mr: 2
                  }}>
                    {item.icon}
                  </Box>
                  <Typography variant="body1">
                    {item.text}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Grid>
        )}

        {/* Section droite - Formulaire de connexion */}
        <Grid
                  item
                  xs={12}
                  sm={12}
                  md={9}  // Augmenté de 8 à 9
                  lg={9}  // Augmenté de 8 à 9
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    p: isMobile ? 2 : 4, // Réduit davantage le padding
                    position: 'relative',
                    zIndex: 5,
                              }}
                >
                  {/* Formulaire flottant */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    style={{ 
                      width: '100%', 
                      maxWidth: "1200px",  // Augmenté de 1000PX à 1200px
                      position: 'relative'
                    }}
                  >
                    <Paper
                      elevation={30}
                      sx={{
                        width: '100%',
                        borderRadius: 3,
                        overflow: 'hidden',
                        background: 'rgba(255, 255, 255, 0.95)',
                        backdropFilter: 'blur(10px)',
                        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
                      }}
                    >
              {/* En-tête du formulaire */}
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 2,
                  py: 3,
                  borderBottom: `2px solid ${theme.palette.primary.light}`,
                  background: `linear-gradient(90deg, ${theme.palette.primary.main} 60%, ${theme.palette.primary.light} 100%)`,
                  mb: 3,
                  borderTopLeftRadius: 12,
                  borderTopRightRadius: 12,
                }}
              >
                <LockIcon sx={{ fontSize: 36, color: 'white' }} />
                <Typography
                  variant="h5"
                  fontWeight="bold"
                  sx={{
                    color: 'white',
                    letterSpacing: 1,
                    textShadow: '0 2px 8px rgba(0,0,0,0.12)'
                  }}
                >
                  Connexion à votre espace
                </Typography>
              </Box>
              {/* Fin En-tête du formulaire */}
              <Box
                sx={{
                  p: { xs: 2, sm: 3 },
                  width: '80%',
                  mx: 'auto',
                  minWidth: 550,
                }}
              >
                {error && (
                  <Alert
                    severity="error"
                    variant="filled"
                    sx={{ mb: 3 }}
                  >
                    {error}
                  </Alert>
                )}
                {success && (
                  <Alert
                    severity="success"
                    variant="filled"
                    sx={{ mb: 3 }}
                  >
                    {success}
                  </Alert>
                )}

                <AnimatePresence mode="wait">
                  <motion.form
                    key="login-form"
                    variants={formVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    onSubmit={handleLogin}
                  >
                    <motion.div variants={itemVariants}>
                      <TextField
                        required
                        fullWidth
                        label="Email"
                        name="username"
                        value={loginData.username}
                        onChange={handleLoginInputChange}
                        margin="normal"
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <PersonIcon color="primary" />
                            </InputAdornment>
                          ),
                        }}
                      />
                    </motion.div>

                    <motion.div variants={itemVariants}>
                      <TextField
                        required
                        fullWidth
                        label="Mot de passe"
                        name="password"
                        type={showLoginPassword ? 'text' : 'password'}
                        value={loginData.password}
                        onChange={handleLoginInputChange}
                        margin="normal"
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <LockIcon color="primary" />
                            </InputAdornment>
                          ),
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton
                                onClick={() => setShowLoginPassword((prev) => !prev)}
                                edge="end"
                              >
                                {showLoginPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                              </IconButton>
                            </InputAdornment>
                          ),
                        }}
                      />
                    </motion.div>

                    <motion.div variants={itemVariants} style={{ display: 'flex', justifyContent: 'flex-end' }}>
                      <Button
                        size="small"
                        color="primary"
                        sx={{ textTransform: 'none' }}
                      >
                        Mot de passe oublié ?
                      </Button>
                    </motion.div>

                    <motion.div
                      variants={itemVariants}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        size="large"
                        disabled={isSubmitting}
                        sx={{
                          mt: 3,
                          mb: 2,
                          py: 1.5,
                          fontSize: '1rem',
                          fontWeight: 'bold',
                          borderRadius: 2,
                          background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                          position: 'relative',
                          overflow: 'hidden',
                          '&::before': {
                            content: '""',
                            position: 'absolute',
                            top: 0,
                            left: '-100%',
                            width: '100%',
                            height: '100%',
                            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
                            transition: 'all 0.6s',
                          },
                          '&:hover::before': {
                            left: '100%',
                          }
                        }}
                      >
                        {isSubmitting ? "Connexion en cours..." : "Se connecter"}
                      </Button>
                    </motion.div>
                  </motion.form>
                </AnimatePresence>
              </Box>
            </Paper>
          </motion.div>
        </Grid>
      </Grid>
      {/* Mobile uniquement: affichage des fonctionnalités sous le formulaire */}
      {isMobile && (
        <Box sx={{ mt: 3, color: 'white' }}>
          <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 2, textAlign: 'center' }}>
            Fonctionnalités principales
          </Typography>
          <Grid container spacing={2}>
            {features.map((item, index) => (
              <Grid item xs={12} key={index}>
                <Box
                  component={motion.div}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    p: 1.5,
                    borderRadius: 1,
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  }}
                >
                  <Box sx={{ mr: 1.5 }}>
                    {item.icon}
                  </Box>
                  <Typography variant="body2">
                    {item.text}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}
    </Box>
  );
};

export default Login;
