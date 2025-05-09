import React, { useState, useEffect } from 'react';
import {
  Container, Box, Typography, Button, CircularProgress,
  Dialog, DialogTitle, DialogContent, IconButton
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';

import { getAllMovements } from '../../Api/ApiMovementStock';
import AddMovement from './AddMovement';
import ShowMovements from './ShowMovements';

const PagePrincipalMovement = () => {
  const [movements, setMovements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchMovements = async () => {
    setLoading(true);
    try {
      const data = await getAllMovements();
      setMovements(data || []);
    } catch (error) {
      console.error("Erreur lors de la récupération des mouvements :", error);
      setMovements([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMovements();
  }, []);

  const handleAddMovement = () => setIsModalOpen(true);
  const handleMovementAdded = () => {
    fetchMovements();
    setIsModalOpen(false);
  };

  return (
    <Box>
      <Container>
        <Box sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h5" fontWeight="bold">
              Gestion des Mouvements de Stock
            </Typography>
            <Button variant="contained" color="primary" startIcon={<AddIcon />} onClick={handleAddMovement}>
              Ajouter un mouvement
            </Button>
          </Box>

          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 5 }}>
              <CircularProgress />
            </Box>
          ) : movements.length === 0 ? (
            <Typography align="center" color="text.secondary" sx={{ py: 5 }}>
              Aucun mouvement trouvé
            </Typography>
          ) : (
            <ShowMovements movements={movements} fetchMovements={fetchMovements} />
          )}
        </Box>
      </Container>

      <Dialog open={isModalOpen} onClose={() => setIsModalOpen(false)} fullWidth>
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between' }}>
          Ajouter un mouvement
          <IconButton onClick={() => setIsModalOpen(false)}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <AddMovement onMovementAdded={handleMovementAdded} onClose={() => setIsModalOpen(false)} />
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default PagePrincipalMovement;
