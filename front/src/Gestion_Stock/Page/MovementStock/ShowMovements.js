import React, { useEffect, useState } from 'react';
import {
  Box, Card, Typography, Grid, Chip, Divider, Paper, IconButton,
  useTheme, List, ListItem, ListItemIcon, ListItemText,
  Badge, Collapse, TextField, InputAdornment, Button, Pagination
} from '@mui/material';
import {
  ArrowForward, CalendarToday, Person, Inventory, LocationOn,
  ExpandMore, ExpandLess, LocalShipping, TrendingUp, TrendingDown, Search
} from '@mui/icons-material';

const typeConfig = {
  entrée: { color: 'success', label: 'Entrée', icon: <TrendingUp fontSize="small" /> },
  entree: { color: 'success', label: 'Entrée', icon: <TrendingUp fontSize="small" /> },
  entry: { color: 'success', label: 'Entrée', icon: <TrendingUp fontSize="small" /> },
  sortie: { color: 'error', label: 'Sortie', icon: <TrendingDown fontSize="small" /> },
  exit: { color: 'error', label: 'Sortie', icon: <TrendingDown fontSize="small" /> },
  transfert: { color: 'info', label: 'Transfert', icon: <LocalShipping fontSize="small" /> },
  transfer: { color: 'info', label: 'Transfert', icon: <LocalShipping fontSize="small" /> }
};

const MovementTypeChip = ({ type }) => {
  const { color, label, icon } = typeConfig[type?.toLowerCase()] || { color: 'default', label: type, icon: null };
  return <Chip icon={icon} label={label} color={color} size="small" sx={{ fontWeight: 'medium' }} />;
};

const formatDate = (dateString) => new Date(dateString).toLocaleDateString();

const MovementCard = ({ movement, expanded, onToggleExpand }) => {
  const theme = useTheme();
  const type = movement?.type?.toLowerCase();
  const borderColor = type?.includes('entr')
    ? theme.palette.success.main
    : type?.includes('sort')
      ? theme.palette.error.main
      : theme.palette.info.main;

  return (
    <Card elevation={2} sx={{ position: 'relative', borderLeft: `4px solid ${borderColor}`, transition: '0.2s', '&:hover': { boxShadow: 4, transform: 'translateY(-2px)' } }}>
      <Box sx={{ p: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Badge badgeContent={movement?.id} color="primary" sx={{ mr: 2 }}>
              <Inventory color="action" />
            </Badge>
            <Typography variant="subtitle1" fontWeight="medium">{`Qté: ${movement?.quantite}`}</Typography>
          </Box>
          <MovementTypeChip type={movement?.type} />
        </Box>

        <Divider sx={{ my: 1 }} />

        <Grid container spacing={1} sx={{ mb: 1 }}>
          <Grid item xs={6}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <CalendarToday fontSize="small" color="action" sx={{ mr: 1 }} />
              <Typography variant="body2">{formatDate(movement?.date_mouvement)}</Typography>
            </Box>
          </Grid>
          <Grid item xs={6}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Person fontSize="small" color="action" sx={{ mr: 1 }} />
              <Typography variant="body2" noWrap>{movement?.utilisateur_id}</Typography>
            </Box>
          </Grid>
        </Grid>

        {!expanded && (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <LocationOn fontSize="small" color="action" sx={{ mr: 1 }} />
            <Typography variant="body2" noWrap>
              {movement?.stock?.emplacement?.nom || '—'}
              {movement?.emplacementDestination?.nom && (
                <>
                  <ArrowForward sx={{ fontSize: 12, mx: 0.5 }} />
                  {movement?.emplacementDestination.nom}
                </>
              )}
            </Typography>
          </Box>
        )}

        <Collapse in={expanded}>
          <Box sx={{ mt: 1, pb: 1 }}>
            <Typography variant="caption" color="text.secondary">Détails des emplacements</Typography>
            <List dense disablePadding>
              {movement?.stock?.emplacement?.nom && (
                <ListItem disablePadding sx={{ py: 0.5 }}>
                  <ListItemIcon sx={{ minWidth: 36 }}><LocationOn fontSize="small" color="action" /></ListItemIcon>
                  <ListItemText primary="Source" secondary={movement?.stock?.emplacement.nom} primaryTypographyProps={{ variant: 'caption' }} secondaryTypographyProps={{ variant: 'body2' }} />
                </ListItem>
              )}
              {movement?.emplacement_destination?.nom && (
                <ListItem disablePadding sx={{ py: 0.5 }}>
                  <ListItemIcon sx={{ minWidth: 36 }}><LocationOn fontSize="small" color="action" /></ListItemIcon>
                  <ListItemText primary="Destination" secondary={movement.emplacement_destination?.nom} primaryTypographyProps={{ variant: 'caption' }} secondaryTypographyProps={{ variant: 'body2' }} />
                </ListItem>
              )}
              {movement?.stock && (
                <Box sx={{ mt: 1 }}>
                  <Divider sx={{ my: 1 }} />
                  <Typography variant="caption" color="text.secondary">
                    Informations du stock
                  </Typography>
                  <Grid container spacing={1} sx={{ mt: 0.5 }}>
                    {movement?.stock?.id && (
                      <Grid item xs={6}>
                        <Typography variant="caption" color="text.secondary">Stock ID</Typography>
                        <Typography variant="body2">{movement?.stock?.id}</Typography>
                      </Grid>
                    )}
                    {movement?.stock?.produit?.nom && (
                      <Grid item xs={6}>
                        <Typography variant="caption" color="text.secondary">Produit</Typography>
                        <Typography variant="body2" noWrap title={movement?.stock?.produit?.nom}>
                          {movement?.stock?.produit?.nom}
                        </Typography>
                      </Grid>
                    )}
                    {movement?.quantite && (
                      <Grid item xs={6}>
                        <Typography variant="caption" color="text.secondary">Quantite</Typography>
                        <Typography variant="body2" noWrap title={movement?.quantite}>
                          {movement?.quantite}
                        </Typography>
                      </Grid>
                    )}
                  </Grid>
                </Box>
              )}
            </List>
          </Box>
        </Collapse>

        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 0.5 }}>
          <IconButton size="small" onClick={onToggleExpand} sx={{ bgcolor: 'action.hover', '&:hover': { bgcolor: 'action.selected' } }}>
            {expanded ? <ExpandLess fontSize="small" /> : <ExpandMore fontSize="small" />}
          </IconButton>
        </Box>
      </Box>
    </Card>
  );
};

const ShowMovements = ({ movements }) => {
  const [expandedMovement, setExpandedMovement] = useState(null);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const theme = useTheme();

  const toggleExpand = (id) => setExpandedMovement(expandedMovement === id ? null : id);

  const filteredMovements = movements.filter((m) => {
    const produit = m?.stock?.produit?.nom?.toLowerCase() || '';
    const utilisateur = m?.utilisateur_id?.toLowerCase() || '';
    return produit.includes(search.toLowerCase()) || utilisateur.includes(search.toLowerCase());
  });

  const totalPages = Math.ceil(filteredMovements.length / itemsPerPage);
  const displayedMovements = filteredMovements.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <Box sx={{ width: '100%' }}>
      <Paper elevation={2} sx={{ p: 2, mb: 3, display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderRadius: 2 }} fullwidth>
        <TextField
          variant="outlined"
          placeholder="Rechercher par produit ou utilisateur"
          size="small"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1); // reset page on search
          }}
          sx={{ width: 350 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            ),
          }}
        />
      </Paper>

      <Grid container spacing={2} justifyContent="center" alignItems="center">
        {displayedMovements.map((m) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={m.id}>
            <MovementCard
              movement={m}
              expanded={expandedMovement === m.id}
              onToggleExpand={() => toggleExpand(m.id)}
            />
          </Grid>
        ))}
      </Grid>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mt: 3 }}>
          <Pagination
            count={totalPages} // Nombre total de pages
            page={currentPage} // Page actuelle
            onChange={(event, value) => setCurrentPage(value)} // Gestion du changement de page
            color="primary" // Couleur des boutons
            shape="circular" // Forme circulaire des boutons
            size="medium" // Taille des boutons
            hidePrevButton // Masquer le bouton "Précédent"
            hideNextButton // Masquer le bouton "Suivant"
          />
        </Box>
      )}
    </Box>
  );
};

export default ShowMovements;
