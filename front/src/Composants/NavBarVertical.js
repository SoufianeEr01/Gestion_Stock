import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Drawer, 
  List, 
  ListItem, 
  ListItemText, 
  Toolbar, 
  Typography, 
  Divider, 
  IconButton,
  Box,
  Avatar,
  AppBar,
  CssBaseline,
  useTheme,
  Badge,
  Tooltip,
  Menu,
  MenuItem,
  ListItemButton,
  useMediaQuery,
  ListItemIcon,
  ListItemAvatar,
  ListSubheader,
  Chip,
  CircularProgress
} from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import StoreIcon from '@mui/icons-material/Store';
import TimelineIcon from '@mui/icons-material/Timeline';
import AddShoppingCartSharpIcon from '@mui/icons-material/AddShoppingCartSharp';
import CompareArrowsSharpIcon from '@mui/icons-material/CompareArrowsSharp';
import InventorySharpIcon from '@mui/icons-material/InventorySharp';
import BarChartIcon from '@mui/icons-material/BarChart';
import { styled } from '@mui/material/styles';
import HowToRegIcon from '@mui/icons-material/HowToReg';
import {
  Dashboard as DashboardIcon,
  Inventory as InventoryIcon,
  ShoppingCart as ShoppingCartIcon,
  Timeline as ForecastIcon,
  Business as SuppliersIcon,
  Assessment as ReportsIcon,
  Settings as SettingsIcon,
  Menu as MenuIcon,
  Notifications as NotificationsIcon,
  Person as PersonIcon,
  Logout as LogoutIcon,
  AccountCircle as AccountCircleIcon,
  Help as HelpIcon,
  Info as InfoIcon
} from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { useAuth } from '../Authentification/AuthContext';
import { useNavigate } from 'react-router-dom';
import ShoppingBasketIcon from '@mui/icons-material/ShoppingBasket';

// Largeur du drawer
const drawerWidth = 260;

// Drawer ouvert
const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
  backgroundColor: theme.palette.background.default,
  borderRight: '1px solid',
  borderColor: theme.palette.divider,
});

// Drawer fermé
const closedMixin = (theme) => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up('sm')]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
  backgroundColor: theme.palette.background.default,
  borderRight: '1px solid',
  borderColor: theme.palette.divider,
});

// Style pour la barre du drawer
const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
}));

// AppBar custom qui s'ajuste en fonction de l'état du drawer
const AppBarStyled = styled(AppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  boxShadow: '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)',
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

// Drawer custom qui s'ouvre et se ferme
const DrawerStyled = styled(Drawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
    boxSizing: 'border-box',
    ...(open && {
      ...openedMixin(theme),
      '& .MuiDrawer-paper': openedMixin(theme),
    }),
    ...(!open && {
      ...closedMixin(theme),
      '& .MuiDrawer-paper': closedMixin(theme),
    }),
  }),
);

const VerticalNavbar = ({ children }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [open, setOpen] = useState(!isMobile);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [anchorEl, setAnchorEl] = useState(null);
  const [notificationAnchorEl, setNotificationAnchorEl] = useState(null);
  const [headerTitle, setHeaderTitle] = useState("Système d'Inventaire");
  const [roleA, setRoleA] = useState("");
  const [commandes, setCommandes] = useState([]);
  const [loadingCommandes, setLoadingCommandes] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  // Gérer les changements de taille d'écran
  useEffect(() => {
    setOpen(!isMobile);
    setRoleA(JSON.parse(localStorage.getItem("roles")) || "");
  }, [isMobile]);

  // Fonction pour récupérer les commandes en attente
  const fetchCommandes = async () => {
    try {
      setLoadingCommandes(true);
      const response = await axios.get('http://localhost:8082/bonachats/en-attente');
      // Filtrer les commandes pour ne garder que celles avec le statut "En attente"
      const commandesEnAttente = response.data.filter(commande => commande.statut === "En attente");
      setCommandes(commandesEnAttente || []);
    } catch (error) {
      console.error('Erreur lors de la récupération des commandes en attente:', error);
    } finally {
      setLoadingCommandes(false);
    }
  };

  // Items du menu
  const menuItems = [
    { text: 'Tableau de bord', icon: <DashboardIcon />, path: '/dashboard' },
    { text: 'Fournisseurs', icon: <SuppliersIcon />, path: '/provider' },
    { text: 'Produits', icon: <AddShoppingCartSharpIcon />, path: '/product' },
    { text: 'Emplacement', icon: <LocationOnIcon />, path: '/location' },
    { text: 'Stock', icon: <StoreIcon />, path: '/stock' },
    { text: 'Mouvement Stock', icon: <CompareArrowsSharpIcon />, path: '/movement' },
    { text: 'Commandes', icon: <ShoppingCartIcon />, path: '/orders' },
    { text: 'Rapports Stock', icon: <BarChartIcon />, path: '/ReportingStock' },
    { text: 'Rapports Mouvement', icon: <InventorySharpIcon />, path: '/Reporting' },
    ...(roleA.includes("ROLE_ADMIN") ? [{ text: 'Registre', icon: <HowToRegIcon />, path: '/Registre' }] : [])
  ];

  const handleDrawerToggle = () => {
    setOpen(!open);
  };

  const handleListItemClick = (event, index, text) => {
    setSelectedIndex(index);
    setHeaderTitle(text); // Met à jour le titre avec le texte du bouton
  };

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleNotificationMenuOpen = (event) => {
    setNotificationAnchorEl(event.currentTarget);
  };

  const handleNotificationMenuClose = () => {
    setNotificationAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    handleMenuClose();
    navigate('/Login');
  };

  const handleProfile = () => {
    handleMenuClose();
    navigate('/profile');
  };

  const isProfileMenuOpen = Boolean(anchorEl);
  const isNotificationMenuOpen = Boolean(notificationAnchorEl);

  // Récupérer les commandes au chargement du composant
  useEffect(() => {
    fetchCommandes();
    
    // Rafraîchir les commandes périodiquement (toutes les 5 minutes)
    const intervalId = setInterval(fetchCommandes, 300000);
    
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="vertical-navbar">
      <Box sx={{ display: 'flex' }}>
        <CssBaseline />
        {/* AppBar (barre du haut) */}
        <AppBarStyled position="fixed" open={open}>
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="ouvrir menu"
              onClick={handleDrawerToggle}
              edge="start"
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
            <Typography 
              variant="h6" 
              noWrap 
              component="div" 
              sx={{  
                display: { xs: 'none', sm: 'block' }, 
                fontWeight: 600, 
                letterSpacing: '0.5px'
              }}
            >
              {headerTitle}
            </Typography>
            <Box sx={{ flexGrow: 1 }} />
            {/* Icônes de la barre du haut */}
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Tooltip title="Aide">
                <IconButton color="inherit">
                  <HelpIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Notifications">
                <IconButton
                  color="inherit"
                  onClick={handleNotificationMenuOpen}
                >
                  <Badge 
                    badgeContent={commandes.length} 
                    color="error"
                    max={99}
                  >
                    <NotificationsIcon />
                  </Badge>
                </IconButton>
              </Tooltip>
              <Tooltip title="Mon profil">
                <IconButton
                  edge="end"
                  color="inherit"
                  onClick={handleProfileMenuOpen}
                  sx={{ ml: 1 }}
                >
                  <Avatar
                    sx={{ 
                      width: 32, 
                      height: 32, 
                      bgcolor: theme.palette.secondary.main,
                      border: '2px solid white',
                    }}
                  >
                    {user?.email ? user.email[0].toUpperCase() : <PersonIcon fontSize="small" />}
                  </Avatar>
                </IconButton>
              </Tooltip>
            </Box>
          </Toolbar>
        </AppBarStyled>
        
        {/* Menu profil */}
        <Menu
          anchorEl={anchorEl}
          id="profile-menu"
          keepMounted
          open={isProfileMenuOpen}
          onClose={handleMenuClose}
          PaperProps={{
            elevation: 3,
            sx: { minWidth: 200 },
          }}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        >
          <Box sx={{ px: 2, py: 1.5, display: 'flex', alignItems: 'center' }}>
            <Avatar sx={{ bgcolor: theme.palette.secondary.main, mr: 1.5 }}>
              {user?.email ? user.email[0].toUpperCase() : <PersonIcon />}
            </Avatar>
            <Box>
              <Typography variant="subtitle1" fontWeight="medium">{user?.email || "Utilisateur"}</Typography>
              <Typography variant="body2" color="text.secondary">{user?.roles?.[0] || "Rôle inconnu"}</Typography>
            </Box>
          </Box>
          <Divider />
          <MenuItem onClick={handleProfile}>
            <ListItemIcon>
              <AccountCircleIcon fontSize="small" />
            </ListItemIcon>
            Mon profil
          </MenuItem>
          <Divider />
          <MenuItem onClick={handleLogout}>
            <ListItemIcon>
              <LogoutIcon fontSize="small" />
            </ListItemIcon>
            Déconnexion
          </MenuItem>
        </Menu>
        
        {/* Drawer (menu latéral) */}
        <DrawerStyled variant="permanent" open={open}>
          <DrawerHeader>
            {open && (
              <Box sx={{ display: 'flex', alignItems: 'center', ml: 1 }}>
                <Avatar 
                  sx={{ 
                    bgcolor: theme.palette.primary.main,
                    width: 36,
                    height: 36,
                  }}
                >
                  IS
                </Avatar>
                <Typography 
                  variant="h6" 
                  sx={{ 
                    ml: 1.5,
                    fontWeight: 600,
                    fontSize: '1.125rem',
                  }}
                >
                  Inventaire Pro
                </Typography>
              </Box>
            )}
          </DrawerHeader>
          <Divider />
          
          {/* Liste des éléments du menu */}
          <List sx={{ px: 1, py: 1 }}>
            {menuItems.map((item, index) => (
              <ListItem key={item.text} disablePadding sx={{ display: 'block', mb: 0.5, borderRadius: 1 }}>
                <ListItemButton
                  component={Link}
                  to={item.path}
                  selected={selectedIndex === index}
                  onClick={(event) => handleListItemClick(event, index, item.text)}
                  sx={{
                    minHeight: 48,
                    justifyContent: open ? 'initial' : 'center',
                    px: 2.5,
                    borderRadius: 1,
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      mr: open ? 3 : 'auto',
                      justifyContent: 'center',
                      color: selectedIndex === index ? theme.palette.primary.main : 'inherit',
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText 
                    primary={item.text} 
                    sx={{
                      opacity: open ? 1 : 0,
                      '& .MuiTypography-root': {
                        fontWeight: selectedIndex === index ? 500 : 400,
                        color: selectedIndex === index ? theme.palette.primary.main : 'inherit',
                      },
                    }}
                  />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
          
          {/* Infos en bas du menu */}
          {open && (
            <>
              <Box sx={{ flexGrow: 1 }} />
              <Divider />
              <Box sx={{ p: 2 }}>
                <Typography variant="body2" color="text.secondary" align="center">
                  Système d'Inventaire v1.0.0
                </Typography>
              </Box>
            </>
          )}
        </DrawerStyled>
        
        {/* Contenu principal */}
        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
          <DrawerHeader />
          {children}
        </Box>
      </Box>
      
      {/* Menu notifications */}
      <Menu
        anchorEl={notificationAnchorEl}
        id="notification-menu"
        keepMounted
        open={isNotificationMenuOpen}
        onClose={handleNotificationMenuClose}
        PaperProps={{
          elevation: 3,
          sx: {
            minWidth: 320,
            maxWidth: '90vw',
            maxHeight: '70vh',
            overflowY: 'auto'
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <ListSubheader sx={{
          bgcolor: 'primary.main',
          color: 'white',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          py: 1.5
        }}>
          Commandes en attente
          <Chip 
            label={commandes.length} 
            color="error" 
            size="small"
            sx={{ color: 'white', fontWeight: 'bold' }}
          />
        </ListSubheader>
        
        {loadingCommandes ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
            <CircularProgress size={24} />
          </Box>
        ) : commandes.length === 0 ? (
          <MenuItem disabled sx={{ opacity: 0.7 }}>
            <ListItemIcon>
              <InfoIcon fontSize="small" />
            </ListItemIcon>
            Aucune commande en attente
          </MenuItem>
        ) : (
          <>
            {commandes.slice(0, 5).map((commande) => (
              <MenuItem 
                key={commande.id}
                onClick={() => {
                  handleNotificationMenuClose();
                  navigate('/orders');
                }}
                sx={{
                  py: 1.5,
                  borderBottom: '1px solid',
                  borderColor: 'divider'
                }}
              >
                <ListItemAvatar>
                  <Avatar sx={{ bgcolor: 'warning.light' }}>
                    <ShoppingBasketIcon />
                  </Avatar>
                </ListItemAvatar>
                <Box>
                  <Typography variant="body1" noWrap sx={{ maxWidth: 220 }}>
                    {commande.nomProduit}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Qté: {commande.quantite} | {commande.nomFournisseur}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {new Date(commande.dateCreation).toLocaleDateString()}
                  </Typography>
                </Box>
              </MenuItem>
            ))}
            
            {commandes.length > 5 && (
              <MenuItem 
                onClick={() => {
                  handleNotificationMenuClose();
                  navigate('/orders');
                }}
                sx={{
                  justifyContent: 'center',
                  color: 'primary.main',
                  fontWeight: 'medium'
                }}
              >
                Voir toutes les {commandes.length} commandes
              </MenuItem>
            )}
          </>
        )}
      </Menu>
    </div>
  );
};

export default VerticalNavbar;