// src/api/stockAPI.js

const API_URL = "http://localhost:8080/api/stocks";

// Fonction pour récupérer les en-têtes avec le token JWT
function getAuthHeaders() {
  const token = localStorage.getItem('token');
  return token
    ? { "Content-Type": "application/json", "Authorization": `Bearer ${token}` }
    : { "Content-Type": "application/json" };
}

// Récupérer tous les stocks
export async function getAllStocks() {
  const response = await fetch(API_URL, {
    headers: getAuthHeaders()
  });
  if (!response.ok) throw new Error("Erreur lors de la récupération des stocks.");
  return await response.json();
}

// Récupérer un stock par ID
export async function getStockById(id) {
  const response = await fetch(`${API_URL}/${id}`, {
    headers: getAuthHeaders()
  });
  if (!response.ok) throw new Error(`Stock avec l'ID ${id} non trouvé.`);
  return await response.json();
}

// Créer un nouveau stock
export async function createStock(stock) {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(stock),
  });
  if (!response.ok) throw new Error("Erreur lors de la création du stock.");
  return await response.json();
}

// Mettre à jour un stock
export async function updateStock(id, stock) {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify(stock),
  });
  if (!response.ok) throw new Error("Erreur lors de la mise à jour du stock.");
  return await response.json();
}

// Supprimer un stock
export async function deleteStock(id) {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders()
  });
  if (!response.ok) throw new Error("Erreur lors de la suppression du stock.");
  return true;
}
