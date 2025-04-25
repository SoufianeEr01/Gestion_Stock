import React, { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  Card,
  CardContent,
  CircularProgress,
  Grid,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';

function ShowProviders() {
  const [fournisseurs, setFournisseurs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [produits, setProduits] = useState([]);
  const [fournisseurSelectionne, setFournisseurSelectionne] = useState(null);

  useEffect(() => {
    fetch('https://f51dcef7-9501-4d82-8f54-e7c3a58b9e07.mock.pstmn.io/fournisseurs')
      .then((response) => response.json())
      .then((data) => {
        setFournisseurs(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Erreur lors du chargement des fournisseurs:', error);
        setLoading(false);
      });
  }, []);

  const handleCardClick = (fournisseur) => {
    setFournisseurSelectionne(fournisseur);
    fetch('https://f51dcef7-9501-4d82-8f54-e7c3a58b9e07.mock.pstmn.io/produits')
      .then((response) => response.json())
      .then((data) => {
        const produitsFiltrés = data.filter(
          (produit) => produit.fournisseurId === fournisseur.id
        );
        setProduits(produitsFiltrés);
      })
      .catch((error) => {
        console.error('Erreur lors du chargement des produits:', error);
      });
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Liste des Fournisseurs
      </Typography>

      {loading ? (
        <CircularProgress />
      ) : (
        <Grid container spacing={3}>
          {fournisseurs.map((fournisseur) => (
            <Grid item xs={12} sm={6} md={4} key={fournisseur.id}>
              <Card
                variant="outlined"
                onClick={() => handleCardClick(fournisseur)}
                style={{ cursor: 'pointer' }}
              >
                <CardContent>
                  <Typography variant="h6">{fournisseur.nom}</Typography>
                  <Typography color="text.secondary">
                    {fournisseur.email}
                  </Typography>
                  <Typography>Téléphone: {fournisseur.telephone}</Typography>
                  <Typography>Adresse: {fournisseur.adresse}</Typography>
                  <Typography>Pays: {fournisseur.pays}</Typography>
                  <Typography variant="caption">
                    Enregistré le: {fournisseur.dateEnregistrement}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {fournisseurSelectionne && (
        <>
          <Typography variant="h5" sx={{ mt: 4 }}>
            Produits de : {fournisseurSelectionne.nom}
          </Typography>
          {produits.length === 0 ? (
            <Typography>Aucun produit trouvé.</Typography>
          ) : (
            <List>
              {produits.map((produit) => (
                <ListItem key={produit.id} divider>
                  <ListItemText
                    primary={produit.nom}
                    secondary={
                      <>
                        <span>{produit.description}</span>
                        <br />
                        <span>Catégorie : {produit.categorie}</span>
                        <br />
                        <span>Prix : {produit.prixUnitaire} MAD</span>
                      </>
                    }
                  />
                </ListItem>
              ))}
            </List>
          )}
        </>
      )}
    </Container>
  );
}

export default ShowProviders;
