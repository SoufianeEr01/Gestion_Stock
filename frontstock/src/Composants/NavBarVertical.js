import React, { useState, useEffect } from 'react';
import { 
  Drawer, 
  List, 
  ListItem, 
  ListItemIcon, 
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
  useMediaQuery
} from '@mui/material';
import { styled, alpha } from '@mui/material/styles';
import {
  Dashboard as DashboardIcon,
  Inventory as InventoryIcon,
  ShoppingCart as ShoppingCartIcon,
  Timeline as ForecastIcon,
  Business as SuppliersIcon,
  Assessment as ReportsIcon,
  Settings as SettingsIcon,
  Menu as MenuIcon,
  ChevronLeft as ChevronLeftIcon,
  Notifications as NotificationsIcon,
  Search as SearchIcon,
  Person as PersonIcon,
  Logout as LogoutIcon,
  AccountCircle as AccountCircleIcon,
  Help as HelpIcon,
  KeyboardArrowDown as KeyboardArrowDownIcon
} from '@mui/icons-material';
import { Link } from 'react-router-dom';

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


// Liste des éléments de navigation avec sous-menus
const menuItems = [
  { 
    text: 'Tableau de bord', 
    icon: <DashboardIcon />, 
    path: '/',
    badge: null 
  },
  { 
    text: 'Inventaire', 
    icon: <InventoryIcon />, 
    path: '/inventory',
    badge: null,
    subMenu: [
      { text: 'Product', path: '/product' },
      { text: ' Emplacement', path: '/forecasting/predictive' },
      { text: ' Stock', path: '/forecasting/reports' }
    ]
   
  },
  { 
    text: 'Commandes', 
    icon: <ShoppingCartIcon />, 
    path: '/orders',
    badge: null
  },
  { 
    text: 'Prévisions AI', 
    icon: <ForecastIcon />, 
    path: '/forecasting',
    badge: null,
    subMenu: [
      { text: 'Tendances', path: '/forecasting/trends' },
      { text: 'Analyse prédictive', path: '/forecasting/predictive' },
      { text: 'Rapports automatisés', path: '/forecasting/reports' }
    ]
  },
  { 
    text: 'Fournisseurs', 
    icon: <SuppliersIcon />, 
    path: '/suppliers',
    badge: null 
  },
  { 
    text: 'Rapports', 
    icon: <ReportsIcon />, 
    path: '/reports',
    badge: null,
    subMenu: [
      { text: 'Finances', path: '/reports/finances' },
      { text: 'Performance', path: '/reports/performance' },
      { text: 'Historique', path: '/reports/history' }
    ]
  },
  { 
    text: 'Paramètres', 
    icon: <SettingsIcon />, 
    path: '/settings',
    badge: null 
  }
];

const VerticalNavbar = ({ children }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [open, setOpen] = useState(!isMobile);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [expandedItem, setExpandedItem] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [notificationAnchorEl, setNotificationAnchorEl] = useState(null);
  
  // Gérer les changements de taille d'écran
  useEffect(() => {
    setOpen(!isMobile);
  }, [isMobile]);

  const handleDrawerToggle = () => {
    setOpen(!open);
  };

  const handleListItemClick = (event, index, hasSubmenu) => {
    setSelectedIndex(index);
    if (hasSubmenu) {
      setExpandedItem(expandedItem === index ? null : index);
    } else {
      setExpandedItem(null);
    }
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
  
  const isProfileMenuOpen = Boolean(anchorEl);
  const isNotificationMenuOpen = Boolean(notificationAnchorEl);

  return (
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
            Inventory AI System
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
                <Badge badgeContent={4} color="error">
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
                    border: '2px solid white'
                  }}
                >
                  <PersonIcon fontSize="small" />
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
          sx: { minWidth: 200 }
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <Box sx={{ px: 2, py: 1.5, display: 'flex', alignItems: 'center' }}>
          <Avatar sx={{ bgcolor: theme.palette.secondary.main, mr: 1.5 }}>
            <PersonIcon />
          </Avatar>
          <Box>
            <Typography variant="subtitle1" fontWeight="medium">Martin Dubois</Typography>
            <Typography variant="body2" color="text.secondary">Admin</Typography>
          </Box>
        </Box>
        <Divider />
        <MenuItem onClick={handleMenuClose}>
          <ListItemIcon>
            <AccountCircleIcon fontSize="small" />
          </ListItemIcon>
          Mon profil
        </MenuItem>
        <MenuItem onClick={handleMenuClose}>
          <ListItemIcon>
            <SettingsIcon fontSize="small" />
          </ListItemIcon>
          Paramètres
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleMenuClose}>
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
                  height: 36
                }}
              >
                IA
              </Avatar>
              <Typography 
                variant="h6" 
                sx={{ 
                  ml: 1.5, 
                  fontWeight: 600,
                  fontSize: '1.125rem'
                }}
              >
                Inventory AI
              </Typography>
            </Box>
          )}
          {/* <IconButton onClick={handleDrawerToggle}>
            <ChevronLeftIcon />
          </IconButton> */}
        </DrawerHeader>
        <Divider />
        
        {/* Liste des éléments du menu */}
        <List sx={{ px: 1 }}>
          {menuItems.map((item, index) => (
            <Box key={item.text}>
              <ListItem 
                disablePadding
                sx={{ 
                  display: 'block', 
                  mb: 0.5,
                  borderRadius: 1,
                  bgcolor: selectedIndex === index ? alpha(theme.palette.primary.main, 0.1) : 'transparent',
                  '&:hover': {
                    bgcolor: alpha(theme.palette.primary.main, 0.05)
                  }
                }}
              >
                <ListItemButton
                    component={Link} // ← très important
                    to={item.path}   
                    selected={selectedIndex === index}
                    onClick={(event) => handleListItemClick(event, index, Boolean(item.subMenu))}
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
                      color: selectedIndex === index ? theme.palette.primary.main : 'inherit'
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
                        color: selectedIndex === index ? theme.palette.primary.main : 'inherit'
                      }
                    }} 
                  />
                  {open && item.badge && (
                    <Badge 
                      badgeContent={item.badge} 
                      color="error" 
                      sx={{ ml: 1 }}
                    />
                  )}
                  {open && item.subMenu && (
                    <KeyboardArrowDownIcon 
                      sx={{ 
                        transform: expandedItem === index ? 'rotate(180deg)' : 'rotate(0)',
                        transition: '0.3s',
                        ml: 1,
                        fontSize: '1.2rem'
                      }} 
                    />
                  )}
                </ListItemButton>
              </ListItem>
              
              {/* Sous-menu */}
              {open && item.subMenu && expandedItem === index && (
                <Box sx={{ pl: 4, mb: 1 }}>
                  {item.subMenu.map((subItem, subIndex) => (
                    <ListItem 
                      key={subItem.text}
                      disablePadding
                      sx={{ 
                        borderRadius: 1,
                        '&:hover': {
                          bgcolor: alpha(theme.palette.primary.main, 0.05)
                        }
                      }}
                    >
                      <ListItemButton
                        sx={{
                          py: 0.75,
                          minHeight: 36,
                          borderRadius: 1,
                        }}
                      >
                        <ListItemText 
                          primary={subItem.text}
                          primaryTypographyProps={{
                            fontSize: '0.875rem',
                            fontWeight: 400
                          }}
                        />
                      </ListItemButton>
                    </ListItem>
                  ))}
                </Box>
              )}
            </Box>
          ))}
        </List>
        
        {/* Infos en bas du menu */}
        {open && (
          <>
            <Box sx={{ flexGrow: 1 }} />
            <Divider />
            <Box sx={{ p: 2 }}>
              <Typography variant="body2" color="text.secondary" align="center">
                Inventory AI v1.0.0
              </Typography>
            </Box>
          </>
        )}
      </DrawerStyled>
      
      {/* Contenu principal */}
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <DrawerHeader /> {/* Espace pour que le contenu commence sous l'AppBar */}
        {children}
      </Box>
    </Box>
  );
};

export default VerticalNavbar;