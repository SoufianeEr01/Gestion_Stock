import React, { useState, useEffect } from 'react';
import {
  Container, Box, Typography, Button, TextField,
  CircularProgress, Pagination, Dialog, DialogTitle,
  DialogContent, IconButton, InputAdornment
} from '@mui/material';
import { Add as AddIcon, Search as SearchIcon, Close as CloseIcon } from '@mui/icons-material';
import { deleteProduit, getAllProduits } from '../../Api/ApiProduct';
import ShowProduct from './ShowProducts';
import AddProduct from './AddProduct';
import UpdateProduct from './UpdateProduct';

const PagePrincipal = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const productsPerPage = 5;

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const data = await getAllProduits();
      setProducts(data);
    } catch (error) {
      console.error("Erreur lors de la récupération des produits:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const filteredProducts = products.filter((product) =>
    product.nom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.categorie?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);

  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  const handleAddProduct = () => {
    setSelectedProduct(null);
    setIsModalOpen(true);
  };

  const handleEditProduct = (product) => {
    setSelectedProduct(product);
    setIsUpdateModalOpen(true);
  };
  
  const handleProductAdded = (newProduct) => {
    fetchProducts();  // Rafraîchir les produits
    closeModal();  // Fermer le modal d'ajout de produit
  };

  const handleDeleteProduct = async (productId) => {
    try {
      await deleteProduit(productId);
      setProducts(prev => prev.filter(product => product.id !== productId));
    } catch (error) {
      console.error('Erreur lors de la suppression :', error);
    }
  };
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  };

  const closeUpdateModal = () => {
    setIsUpdateModalOpen(false);
    setSelectedProduct(null);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'MAD' }).format(price);
  };

  return (
    <Box>
      <Container>
        <Box sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h5" fontWeight="bold">Gestion des Produits</Typography>
            <Button variant="contained" color="primary" startIcon={<AddIcon />} onClick={handleAddProduct}>
              Ajouter un produit
            </Button>
          </Box>
          
{/* 
<TextField
          
          placeholder="Rechercher un produit..."
          variant="outlined"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        /> */}

          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 5 }}>
              <CircularProgress />
            </Box>
          ) : filteredProducts.length === 0 ? (
            <Typography color="text.secondary" textAlign="center" sx={{ py: 5 }}>Aucun produit trouvé</Typography>
          ) : (
            <>
              <ShowProduct
                products={filteredProducts}
                onEdit={handleEditProduct}
                onDelete={handleDeleteProduct}
                formatPrice={formatPrice}
                fetchProducts={fetchProducts}
              />
             
            </>
          )}
        </Box>
      </Container>

      {/* Modal Ajouter Produit */}
      <Dialog open={isModalOpen} onClose={closeModal} fullWidth maxWidth="md">
      <DialogTitle sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%' }}>
      <Box sx={{ flex: 1, textAlign: 'center' }}>
         Ajouter le produit
        </Box>            
      <IconButton edge="end" color="inherit" onClick={closeModal}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
        <AddProduct onProductAdded={handleProductAdded} onClose={closeModal} fetchProducts={fetchProducts} />
        </DialogContent>
      </Dialog>

      {/* Modal Modifier Produit */}
      <Dialog open={isUpdateModalOpen} onClose={closeUpdateModal} fullWidth maxWidth="md">
  <DialogTitle sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%' }}>
    <Box sx={{ flex: 1, textAlign: 'center' }}>
      Modifier le produit
    </Box>
    <IconButton edge="end" color="inherit" onClick={closeUpdateModal}>
      <CloseIcon />
    </IconButton>
  </DialogTitle>
  <DialogContent dividers>
    <UpdateProduct selectedProduct={selectedProduct} onClose={closeUpdateModal} fetchProducts={fetchProducts} />
  </DialogContent>
</Dialog>

    </Box>
  );
};

export default PagePrincipal;
