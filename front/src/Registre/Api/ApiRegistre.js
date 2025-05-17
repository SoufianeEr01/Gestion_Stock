export const API_URL = "http://localhost:8081/api/auth"; // Assurez-vous que l'URL est correcte

// Fonction utilitaire pour récupérer le token d'authentification
function getAuthHeaders() {
  const token = localStorage.getItem('token');
  return {
    "Content-Type": "application/json",
    ...(token && { "Authorization": `Bearer ${token}` })
  };
}

// 🔄 Récupérer tous les utilisateurs (protégé)
export async function getAllUsers() {
  try {
    const response = await fetch(`${API_URL}/users`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Erreur HTTP ${response.status}: ${errorText}`);
    }

    return await response.json();
  } catch (err) {
    console.error("Erreur lors de la récupération des utilisateurs :", err);
    throw err;
  }
}

// 📦 Enregistrer un nouvel utilisateur (protégé)
export async function registerUser(user) {
  try {
    const response = await fetch(`${API_URL}/register`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(user),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Erreur HTTP ${response.status}: ${errorText}`);
    }

    return await response.json();
  } catch (err) {
    console.error("Erreur lors de l'enregistrement :", err);
    throw err;
  }
}

// ✏️ Mettre à jour le statut d'un utilisateur (protégé)
export async function updateUserStatus(userId, enabled) {
  try {
    const response = await fetch(`${API_URL}/users/${userId}/status?enabled=${enabled}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Erreur HTTP ${response.status} : ${errorText}`);
    }

    return await response.json();
  } catch (err) {
    console.error("Erreur lors de la mise à jour du statut :", err);
    throw err;
  }
}
