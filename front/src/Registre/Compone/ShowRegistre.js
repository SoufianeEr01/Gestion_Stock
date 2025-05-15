// src/pages/ShowRegsitre.jsx
import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { getAllUsers, updateUserStatus } from '../Api/ApiRegistre';
import {
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  CircularProgress,
  Alert,
  TablePagination,
  Box,
  Switch,
  FormControlLabel,
  Container
} from '@mui/material';

// Utilisation de forwardRef pour pouvoir recevoir une référence du parent
const ShowRegistre = forwardRef((props, ref) => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const usersData = await getAllUsers();
      setUsers(usersData);
      setError(null);
    } catch (err) {
      setError('Impossible de récupérer les utilisateurs.');
    } finally {
      setLoading(false);
    }
  };

  // Exposer la méthode de rechargement au composant parent
  useImperativeHandle(ref, () => ({
    refreshUsers: () => {
      // Incrémenter pour déclencher l'effet de rechargement
      setRefreshTrigger(prev => prev + 1);
    }
  }));

  useEffect(() => {
    fetchUsers();
  }, [refreshTrigger]); // Ajouter refreshTrigger comme dépendance

  const handleToggleStatus = async (userId, currentStatus) => {
    setUpdatingId(userId);
    try {
      await updateUserStatus(userId, !currentStatus);
      await fetchUsers();
    } catch (err) {
      setError('Échec de la mise à jour du statut.');
    } finally {
      setUpdatingId(null);
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
    <Container maxWidth="lg" sx={{ my: 4 }}>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      {loading ? (
        <Box display="flex" justifyContent="center" py={6}>
          <CircularProgress size={60} />
        </Box>
      ) : (
        <>
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="tableau des utilisateurs">
              <TableHead>
                <TableRow>
                  <TableCell  sx={{ fontWeight: 'bold' }}>Nom d'utilisateur</TableCell>
                  <TableCell align="right"  sx={{ fontWeight: 'bold' }} >Email</TableCell>
                  <TableCell align="right"  sx={{ fontWeight: 'bold' }} >Rôle</TableCell>
                  <TableCell align="right"  sx={{ fontWeight: 'bold' }} >Statut du compte</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users.length > 0 ? (
                  users
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((user) => (
                      <TableRow
                        key={user.id}
                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                      >
                        <TableCell component="th" scope="row">
                          {user.username}
                        </TableCell>
                        <TableCell align="right">{user.email}</TableCell>
                        <TableCell align="right">
                          <Chip
                            label={user.role}
                            color={user.role === 'ADMIN' ? 'secondary' : 'primary'}
                            size="small"
                            variant="outlined"
                          />
                        </TableCell>
                        <TableCell align="right">
                          {updatingId === user.id ? (
                            <CircularProgress size={20} />
                          ) : (
                            <FormControlLabel
                              control={
                                <Switch
                                  checked={user.enabled}
                                  onChange={() => handleToggleStatus(user.id, user.enabled)}
                                  color="success"
                                  disabled={updatingId !== null}
                                />
                              }
                              label={
                                <Typography 
                                  variant="body2" 
                                  color={user.enabled ? "success.main" : "error.main"}
                                >
                                  {user.enabled ? 'Activé' : 'Désactivé'}
                                </Typography>
                              }
                              labelPlacement="start"
                            />
                          )}
                        </TableCell>
                      </TableRow>
                    ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} align="center">
                      <Typography color="text.secondary">
                        Pas d'utilisateurs trouvés
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>

          <TablePagination
            component="div"
            count={users.length}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            rowsPerPageOptions={[5, 10, 25]}
            labelRowsPerPage="Lignes par page"
          />
        </>
      )}
    </Container>
  );
});

export default ShowRegistre;
