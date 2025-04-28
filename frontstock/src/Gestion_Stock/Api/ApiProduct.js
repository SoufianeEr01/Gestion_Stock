// src/api/produitAPI.js

const API_URL = "http://localhost:8080/api/produits"; 

// Récupérer tous les produits
export async function getAllProduits() {
  const response = await fetch(API_URL);
  if (!response.ok) throw new Error("Erreur lors de la récupération des produits.");
  return await response.json();
}

// Récupérer un produit par ID
export async function getProduitById(id) {
  const response = await fetch(`${API_URL}/${id}`);
  if (!response.ok) throw new Error(`Produit avec l'ID ${id} non trouvé.`);
  return await response.json();
}

// Créer un nouveau produit
export async function createProduit(produit) {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(produit),
  });
  if (!response.ok) throw new Error("Erreur lors de la création du produit.");
  return await response.json();
}

// Mettre à jour un produit
export async function updateProduit(id, produit) {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(produit),
  });
  if (!response.ok) throw new Error("Erreur lors de la mise à jour du produit.");
  return await response.json();
}

// Supprimer un produit
export async function deleteProduit(id) {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) throw new Error("Erreur lors de la suppression du produit.");
  return true;
}
