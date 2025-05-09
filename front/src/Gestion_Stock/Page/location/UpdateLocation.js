import React, { useState, useEffect } from 'react';
import {
  TextField, Button, Box, FormControl,
  InputLabel, Select, MenuItem
} from '@mui/material';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { updateLocation } from '../../Api/ApiLocation';

const UpdateLocation = ({ selectedLocation, onClose, fetchLocations }) => {
  const [nom, setNom] = useState('');
  const [adresse, setAdresse] = useState('');
  const [type, setType] = useState('');

  useEffect(() => {
    if (selectedLocation) {
      setNom(selectedLocation.nom);
      setAdresse(selectedLocation.adresse);
      setType(selectedLocation.type);
    }
  }, [selectedLocation]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateLocation(selectedLocation.id, { nom, adresse, type });
      fetchLocations();
      toast.success('Emplacement mis à jour avec succès !');
      onClose();
    } catch (error) {
      console.error('Erreur lors de la mise à jour de l\'emplacement:', error);
      toast.error("Échec de la mise à jour de l'emplacement !");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Box display="flex" flexDirection="column" gap={2}>
        <TextField
          label="Nom"
          value={nom}
          onChange={(e) => setNom(e.target.value)}
          required
        />
        <TextField
          label="Adresse"
          value={adresse}
          onChange={(e) => setAdresse(e.target.value)}
          required
        />
        <FormControl required>
          <InputLabel>Type</InputLabel>
          <Select
            value={type}
            label="Type"
            onChange={(e) => setType(e.target.value)}
          >
            <MenuItem value="MAGASIN">MAGASIN</MenuItem>
            <MenuItem value="ENTREPOT">ENTREPOT</MenuItem>
            <MenuItem value="BOUTIQUE">BOUTIQUE</MenuItem>
            <MenuItem value="DEPOT_TEMPORAIRE">DEPOT TEMPORAIRE</MenuItem>
          </Select>
        </FormControl>
        <Button variant="contained" color="primary" type="submit">
          Mettre à jour
        </Button>
      </Box>
    </form>
  );
};

export default UpdateLocation;
