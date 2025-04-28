
const API_URL = "http://localhost:8080/api/emplacements"; 

// Récupérer tous les produits
export async function getAllLocations() {
  const response = await fetch(API_URL);
  if (!response.ok) throw new Error("Erreur lors de la récupération des emplacement.");
  return await response.json();
}

// Récupérer un produit par ID
export async function getLocationById(id) {
  const response = await fetch(`${API_URL}/${id}`);
  if (!response.ok) throw new Error(`Emplacement avec l'ID ${id} non trouvé.`);
  return await response.json();
}

// Créer un nouveau produit
export async function createLocation(location) {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(location),
  });
  if (!response.ok) throw new Error("Erreur lors de la création du emplacement.");
  return await response.json();
}

// Mettre à jour un produit
export async function updateLocation(id, location) {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(location),
  });
  if (!response.ok) throw new Error("Erreur lors de la mise à jour du emplacement.");
  return await response.json();
}

// Supprimer un produit
export async function deleteLocation(id) {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) throw new Error("Erreur lors de la suppression du emplacement.");
  return true;
}
