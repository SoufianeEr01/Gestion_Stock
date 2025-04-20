import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// import axios from 'axios';

const AddProduct = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  
  const [product, setProduct] = useState({
    nom: '',
    description: '',
    code_bare: ''
  });
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct({
      ...product,
      [name]: value
    });
    
    // Clear error for this field when user types
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };
  
  const validateForm = () => {
    const newErrors = {};
    
    if (!product.nom.trim()) {
      newErrors.nom = 'Le nom du produit est obligatoire';
    }
    
    if (!product.description.trim()) {
      newErrors.description = 'La description est obligatoire';
    }
    
    if (!product.code_bare.trim()) {
      newErrors.code_bare = 'Le code barre est obligatoire';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    try {
      setLoading(true);
      
      // Remplacer l'URL par votre API endpoint
    //   await axios.post('/api/produits', product);
      
      // Afficher un message de succès
      alert('Produit ajouté avec succès!');
      
      // Rediriger vers la liste des produits
      navigate('/products');
      
    } catch (error) {
      console.error('Erreur lors de l\'ajout du produit:', error);
      alert('Une erreur est survenue lors de l\'ajout du produit.');
    } finally {
      setLoading(false);
    }
  };
  
  const handleCancel = () => {
    navigate('/products');
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Ajouter un nouveau produit</h1>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label htmlFor="nom" className="block text-sm font-medium text-gray-700 mb-1">
              Nom du produit*
            </label>
            <input
              type="text"
              id="nom"
              name="nom"
              value={product.nom}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md ${errors.nom ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="Entrez le nom du produit"
            />
            {errors.nom && <p className="mt-1 text-sm text-red-500">{errors.nom}</p>}
          </div>
          
          <div className="mb-6">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Description*
            </label>
            <textarea
              id="description"
              name="description"
              value={product.description}
              onChange={handleChange}
              rows="4"
              className={`w-full px-3 py-2 border rounded-md ${errors.description ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="Entrez la description du produit"
            ></textarea>
            {errors.description && <p className="mt-1 text-sm text-red-500">{errors.description}</p>}
          </div>
          
          <div className="mb-8">
            <label htmlFor="code_bare" className="block text-sm font-medium text-gray-700 mb-1">
              Code barre*
            </label>
            <input
              type="text"
              id="code_bare"
              name="code_bare"
              value={product.code_bare}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md ${errors.code_bare ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="Entrez le code barre du produit"
            />
            {errors.code_bare && <p className="mt-1 text-sm text-red-500">{errors.code_bare}</p>}
          </div>
          
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={handleCancel}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {loading ? 'Chargement...' : 'Enregistrer le produit'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProduct;