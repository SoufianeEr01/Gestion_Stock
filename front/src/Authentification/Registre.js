import React, { useState, useEffect } from 'react';
import {
  TextField, Button, Typography, Box, MenuItem, Select, InputLabel,
  FormControl, Grid, Paper, InputAdornment, IconButton, Fade,
  Alert, Divider, useTheme, useMediaQuery, Tab, Tabs
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Registre } from './Api/RegistreApi';
import { Login } from './Api/LoginApi';
import {
  Warehouse as WarehouseIcon,
  Person as PersonIcon,
  Email as EmailIcon,
  Lock as LockIcon,
  Badge as BadgeIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  ArrowForward as ArrowForwardIcon,
  Inventory as InventoryIcon,
  Login as LoginIcon
} from '@mui/icons-material';

const Register = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [activeTab, setActiveTab] = useState(0); // 0 pour inscription, 1 pour connexion

  // Pour garantir que le component prend toute la hauteur
  useEffect(() => {
    document.documentElement.style.height = '100%';
    document.body.style.height = '100%';
    document.body.style.margin = '0';
    
    const rootElement = document.getElementById('root');
    if (rootElement) {
      rootElement.style.height = '100%';
    }
    
    return () => {
      document.documentElement.style.height = '';
      document.body.style.height = '';
      document.body.style.margin = '';
      if (rootElement) {
        rootElement.style.height = '';
      }
    };
  }, []);

  // États pour le formulaire d'inscription
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'GESTIONNAIRE',
  });

  // États pour le formulaire de connexion
  const [loginData, setLoginData] = useState({
    username: '',
    password: ''
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
    setError('');
    setSuccess('');
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleLoginInputChange = (e) => {
    const { name, value } = e.target;
    setLoginData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const validateForm = () => {
    if (!formData.username || !formData.email || !formData.password || !formData.confirmPassword) {
      setError('Tous les champs sont obligatoires.');
      return false;
    }
    
    if (!formData.email.includes('@')) {
      setError('Veuillez fournir une adresse email valide.');
      return false;
    }
    
    if (formData.password !== formData.confirmPassword) {
      setError('Les mots de passe ne correspondent pas.');
      return false;
    }
    
    if (formData.password.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères.');
      return false;
    }
    
    return true;
  };

  const validateLoginForm = () => {
    if (!loginData.username || !loginData.password) {
      setError('Veuillez remplir tous les champs.');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (!validateForm()) return;
    setIsSubmitting(true);
    try {
      await Registre({
        username: formData.username,
        email: formData.email,
        password: formData.password,
        role: formData.role
      });
      setSuccess('Inscription réussie! Vous pouvez maintenant vous connecter.');
      setIsSubmitting(false);
      setTimeout(() => {
        setActiveTab(1);
        setLoginData({
          username: '',
          password: ''
        });
      }, 1200);
    } catch (err) {
      setError(err.message || "Erreur lors de l'inscription. Veuillez réessayer.");
      setIsSubmitting(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (!validateLoginForm()) return;
    setIsSubmitting(true);
    try {
      // Consomme l'API Login avec email et password
      await Login({
        email: loginData.username, // username ici est l'email pour l'API Login
        password: loginData.password
      });
      setSuccess('Connexion réussie! Redirection...');
      setTimeout(() => navigate('/dashboard'), 1200);
    } catch (err) {
      if (err=="Erreur HTTP: 403 -") {
        setError("Mot de passe ou email incorrect.");
      } else {
        setError(err.message || "Erreur lors de la connexion. Veuillez réessayer.");
      }
      setIsSubmitting(false);
    }
  };

  // Variants d'animation pour les formulaires
  const formVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1
      }
    },
    exit: { opacity: 0, y: -20, transition: { duration: 0.3 } }
  };

  const itemVariants = {
    hidden: { y: 15, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { type: "spring", stiffness: 300, damping: 24 }
    }
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
            md={3}  // Réduit de 4 à 3 pour donner encore plus d'espace au formulaire
            sx={{
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              position: 'relative',
              paddingLeft: 4, // Réduit de 6 à 4
              paddingRight: 2, // Réduit de 4 à 2
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
                {activeTab === 0 ? "Créez votre compte" : "Connectez-vous"}
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

        {/* Section droite - Formulaire d'inscription/connexion */}
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
              

              {/* Corps du formulaire */}
              <Box
                sx={{
                  p: { xs: 2, sm: 1 }, // Padding responsif
                  width: '80%',                      // Prend toute la largeur de la carte
                  mx: 'auto',                         // Centre le contenu si besoin
                  minWidth: 650,                      // Largeur minimale
                }}
              >
                <Tabs 
                  value={activeTab} 
                  onChange={handleTabChange} 
                  variant="fullWidth"
                  sx={{ mb: 3 }}
                >
                  <Tab 
                    icon={<PersonIcon />} 
                    label="Inscription" 
                    iconPosition="start"
                  />
                  <Tab 
                    icon={<LoginIcon />} 
                    label="Connexion" 
                    iconPosition="start"
                  />
                </Tabs>

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
                  {/* Formulaire d'inscription */}
                  {activeTab === 0 && (
                    <motion.form
                      key="register-form"
                      variants={formVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      onSubmit={handleSubmit}
                    >
                      <motion.div variants={itemVariants}>
                        <TextField
                          required
                          fullWidth
                          label="Nom d'utilisateur"
                          name="username"
                          value={formData.username}
                          onChange={handleInputChange}
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
                          label="Email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          margin="normal"
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <EmailIcon color="primary" />
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
                          type={showPassword ? 'text' : 'password'}
                          value={formData.password}
                          onChange={handleInputChange}
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
                                  onClick={() => setShowPassword((prev) => !prev)}
                                  edge="end"
                                >
                                  {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                                </IconButton>
                              </InputAdornment>
                            ),
                          }}
                        />
                      </motion.div>

                      <motion.div variants={itemVariants}>
                        <TextField
                          required
                          fullWidth
                          label="Confirmer le mot de passe"
                          name="confirmPassword"
                          type={showConfirmPassword ? 'text' : 'password'}
                          value={formData.confirmPassword}
                          onChange={handleInputChange}
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
                                  onClick={() => setShowConfirmPassword((prev) => !prev)}
                                  edge="end"
                                >
                                  {showConfirmPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                                </IconButton>
                              </InputAdornment>
                            ),
                          }}
                        />
                      </motion.div>

                      <motion.div variants={itemVariants}>
                        <FormControl fullWidth margin="normal" required>
                          <InputLabel>Rôle</InputLabel>
                          <Select
                            name="role"
                            value={formData.role}
                            onChange={handleInputChange}
                            label="Rôle"
                            startAdornment={
                              <InputAdornment position="start">
                                <BadgeIcon color="primary" />
                              </InputAdornment>
                            }
                          >
                            <MenuItem value="GESTIONNAIRE">Gestionnaire</MenuItem>
                            <MenuItem value="ADMIN">Administrateur</MenuItem>
                            <MenuItem value="DIRECTEUR">Directeur</MenuItem>
                          </Select>
                        </FormControl>
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
                          {isSubmitting ? "Inscription en cours..." : "S'inscrire"}
                        </Button>
                      </motion.div>

                      <motion.div variants={itemVariants} style={{ textAlign: 'center' }}>
                        <Button
                          onClick={() => setActiveTab(1)}
                          color="primary"
                          sx={{ textTransform: 'none' }}
                        >
                          Déjà un compte ? Se connecter
                        </Button>
                      </motion.div>
                    </motion.form>
                  )}

                  {/* Formulaire de connexion */}
                  {activeTab === 1 && (
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
                          label="Nom d'utilisateur"
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

                      <motion.div variants={itemVariants} style={{ textAlign: 'center' }}>
                        <Button
                          onClick={() => setActiveTab(0)}
                          color="primary"
                          sx={{ textTransform: 'none' }}
                        >
                          Pas de compte ? S'inscrire
                        </Button>
                      </motion.div>
                    </motion.form>
                  )}
                </AnimatePresence>
              </Box>
            </Paper>
            
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
          </motion.div>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Register;
