import React, { useState, useEffect } from 'react';
import {
  Container, Box, Typography, Button, TextField,
  CircularProgress, Pagination, Dialog, DialogTitle,
  DialogContent, IconButton, InputAdornment
} from '@mui/material';
import { Add as AddIcon, Search as SearchIcon, Close as CloseIcon } from '@mui/icons-material';
import { getAllLocations ,deleteLocation} from '../../Api/ApiLocation';
import ShowLocation from './ShowLocation';
import AddLocation from './AddLocation';
import UpdateLocation from './UpdateLocation';
const PagePrincipalLocation = () => {
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const locationsPerPage = 5;

  const fetchLocations = async () => {
    setLoading(true);
    try {
      const data = await getAllLocations();
      setLocations(data);
    } catch (error) {
      console.error("Erreur lors de la récupération des locations:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLocations();
  }, []);

  const filteredLocations = locations.filter((location) =>
    location.nom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    location.adresse?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    location.type?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastLocation = currentPage * locationsPerPage;
  const indexOfFirstLocation = indexOfLastLocation - locationsPerPage;
  const currentLocations = filteredLocations.slice(indexOfFirstLocation, indexOfLastLocation);

  const totalPages = Math.ceil(filteredLocations.length / locationsPerPage);

  const handleAddLocation = () => {
    setSelectedLocation(null);
    setIsModalOpen(true);
  };

  const handleEditLocation = (location) => {
    setSelectedLocation(location);
    setIsUpdateModalOpen(true);
  };

  const handleLocationAdded = () => {
    fetchLocations();
    closeModal();
  };

  const handleDeleteLocation = async (locationId) => {
    try {
      await deleteLocation(locationId);
      setLocations(prev => prev.filter(location => location.id !== locationId));
    } catch (error) {
      console.error('Erreur lors de la suppression :', error);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedLocation(null);
  };

  const closeUpdateModal = () => {
    setIsUpdateModalOpen(false);
    setSelectedLocation(null);
  };

  return (
    <Box>
      <Container>
        <Box sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h5" fontWeight="bold">Gestion des Emplacements</Typography>
            <Button variant="contained" color="primary" startIcon={<AddIcon />} onClick={handleAddLocation}>
              Ajouter un emplacement
            </Button>
          </Box>

          

          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 5 }}>
              <CircularProgress />
            </Box>
          ) : filteredLocations.length === 0 ? (
            <Typography color="text.secondary" textAlign="center" sx={{ py: 5 }}>Aucun emplacement trouvé</Typography>
          ) : (
            <ShowLocation
              locations={locations}
              onEdit={handleEditLocation}
              onDelete={handleDeleteLocation}
              fetchLocations={fetchLocations}
            />
          )}

          
        </Box>
      </Container>

      {/* Modal Ajouter Emplacement */}
      <Dialog open={isModalOpen} onClose={closeModal} fullWidth maxWidth="md">
        <DialogTitle sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%' }}>
          <Box sx={{ flex: 1, textAlign: 'center' }}>
            Ajouter un emplacement
          </Box>
          <IconButton edge="end" color="inherit" onClick={closeModal}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <AddLocation onLocationAdded={handleLocationAdded} onClose={closeModal} fetchLocations={fetchLocations} />
        </DialogContent>
      </Dialog>

      {/* Modal Modifier Emplacement */}
      <Dialog open={isUpdateModalOpen} onClose={closeUpdateModal} fullWidth maxWidth="md">
        <DialogTitle sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%' }}>
          <Box sx={{ flex: 1, textAlign: 'center' }}>
            Modifier l'emplacement
          </Box>
          <IconButton edge="end" color="inherit" onClick={closeUpdateModal}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <UpdateLocation selectedLocation={selectedLocation} onClose={closeUpdateModal} fetchLocations={fetchLocations} />
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default PagePrincipalLocation;
