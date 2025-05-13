export const API_URL = "http://localhost:8081/api/auth"; // Assurez-vous que l'URL est correcte

export async function Registre(User) {
  try {
    const response = await fetch(`${API_URL}/register`, {
      method: 'POST',
      body: JSON.stringify(User),
      headers: { 'Content-Type': 'application/json' },
    });

    if (!response.ok) {
      const errorData = await response.text(); // Récupérer la réponse brute en texte si ce n'est pas du JSON
      throw new Error(`Erreur HTTP: ${response.status} - ${errorData}`);
    }

    const responseData = await response.json(); // Réponse JSON si la requête a réussi
    return responseData;
  } catch (err) {
    console.error("Erreur lors de la requête :", err);
    throw err; 
  }
}


