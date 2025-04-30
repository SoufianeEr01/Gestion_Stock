import React from 'react';
import {
  Box, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, IconButton
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';

const ShowStock = ({ stocks, onEdit, onDelete }) => {
  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Produit</TableCell>
            <TableCell>Emplacement</TableCell>
            <TableCell>Quantité Importée</TableCell>
            <TableCell>Quantité Réservée</TableCell>
            <TableCell>seuil reapprovisionnement</TableCell>
            <TableCell>Date d'expiration</TableCell>

            <TableCell align="right">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
        
          {stocks.map((stock) => (
            <TableRow key={stock.id}>
            <TableCell>{stock.produit?.nom}</TableCell>
            <TableCell>{stock.emplacement?.nom}</TableCell>
            <TableCell>{stock.quantite_importe}</TableCell>
              <TableCell>{stock.quantite_reserver}</TableCell>
              <TableCell>{stock.seuil_reapprovisionnement}</TableCell>
              <TableCell>{stock.date_expiration}</TableCell>


              <TableCell align="right">
                <IconButton onClick={() => onEdit(stock)}>
                  <EditIcon color="primary" />
                </IconButton>
                <IconButton onClick={() => onDelete(stock.id)}>
                  <DeleteIcon color="error" />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default ShowStock;
