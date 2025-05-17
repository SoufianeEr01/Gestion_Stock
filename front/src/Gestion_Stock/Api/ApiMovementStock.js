const API_URL = "http://localhost:8080/api/mouvements";

// Fonction pour récupérer les en-têtes avec le token JWT
function getAuthHeaders() {
  const token = localStorage.getItem('token');
  return token
    ? { "Content-Type": "application/json", "Authorization": `Bearer ${token}` }
    : { "Content-Type": "application/json" };
}

// 🔄 Récupérer tous les mouvements
export async function getAllMovements() {
  const response = await fetch(API_URL, {
    headers: getAuthHeaders()
  });
  if (!response.ok) throw new Error("Erreur lors de la récupération des mouvements.");
  return await response.json();
}

// 🔍 Récupérer un mouvement par ID
export async function getMovementById(id) {
  const response = await fetch(`${API_URL}/${id}`, {
    headers: getAuthHeaders()
  });
  if (!response.ok) throw new Error(`Mouvement avec l'ID ${id} non trouvé.`);
  return await response.json();
}

// ➕ Créer un nouveau mouvement
export async function createMovement(movement) {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(movement),
  });
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Erreur lors de la création du mouvement: ${errorText}`);
  }
  return await response.json();
}
