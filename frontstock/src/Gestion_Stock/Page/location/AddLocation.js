import React, { useState } from 'react';
import { TextField, Button, Box, Select, MenuItem, InputLabel, FormControl } from '@mui/material';
import { createLocation } from '../../Api/ApiLocation'; 

const AddLocation = ({ onLocationAdded, onClose, fetchLocations }) => {
  const [nom, setNom] = useState('');
  const [adresse, setAdresse] = useState('');
  const [type, setType] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createLocation({ nom, adresse, type });
      onLocationAdded();
      fetchLocations();
    } catch (error) {
      console.error('Erreur lors de l\'ajout de l\'emplacement:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Box display="flex" flexDirection="column" gap={2}>
        <TextField label="Nom" value={nom} onChange={(e) => setNom(e.target.value)} required />
        <TextField label="Adresse" value={adresse} onChange={(e) => setAdresse(e.target.value)} required />
        
        <FormControl required>
          <InputLabel>Type</InputLabel>
          <Select
            value={type}
            onChange={(e) => setType(e.target.value)}
            label="Type"
          >
            <MenuItem value="MAGASIN">MAGASIN</MenuItem>
            <MenuItem value="ENTREPOT">ENTREPOT</MenuItem>
            <MenuItem value="BOUTIQUE">BOUTIQUE</MenuItem>
            <MenuItem value="DEPOT_TEMPORAIRE">DEPOT_TEMPORAIRE</MenuItem>
          </Select>
        </FormControl>

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
                <Button variant="outlined" color="primary" type="reset" sx={{ mr: 2 }} onClick={onClose}>
                  Annuler
                </Button>
                <Button variant="contained" type="submit">
                  Ajouter
                </Button>
        </Box>
      </Box>
    </form>
  );
};

export default AddLocation;
