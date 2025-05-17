const API_URL = "http://localhost:8080/api/emplacements";

// Fonction pour récupérer les en-têtes avec le token JWT
function getAuthHeaders() {
  const token = localStorage.getItem('token');
  return {
    "Content-Type": "application/json",
    ...(token && { "Authorization": `Bearer ${token}` })
  };
}

// 🔄 Récupérer tous les emplacements
export async function getAllLocations() {
  const response = await fetch(API_URL, {
    headers: getAuthHeaders()
  });

  if (!response.ok) {
    throw new Error("Erreur lors de la récupération des emplacements.");
  }

  return await response.json();
}

// 🔍 Récupérer un emplacement par ID
export async function getLocationById(id) {
  const response = await fetch(`${API_URL}/${id}`, {
    headers: getAuthHeaders()
  });

  if (!response.ok) {
    throw new Error(`Emplacement avec l'ID ${id} non trouvé.`);
  }

  return await response.json();
}

// ➕ Créer un nouvel emplacement
export async function createLocation(location) {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(location)
  });

  if (!response.ok) {
    throw new Error("Erreur lors de la création de l'emplacement.");
  }

  return await response.json();
}

// ✏️ Mettre à jour un emplacement
export async function updateLocation(id, location) {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify(location)
  });

  if (!response.ok) {
    throw new Error("Erreur lors de la mise à jour de l'emplacement.");
  }

  return await response.json();
}

// 🗑️ Supprimer un emplacement
export async function deleteLocation(id) {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders()
  });

  if (!response.ok) {
    throw new Error("Erreur lors de la suppression de l'emplacement.");
  }

  return true;
}
