const API_URL = "http://localhost:8080/api/mouvements";

export async function getAllMovements() {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error("Erreur lors de la récupération des mouvements.");
    return await response.json();
  } catch (error) {
    console.error("Erreur getAllMovements:", error);
    throw error;
  }
}

export async function getMovementById(id) {
  try {
    const response = await fetch(`${API_URL}/${id}`);
    if (!response.ok) throw new Error(`Mouvement avec l'ID ${id} non trouvé.`);
    return await response.json();
  } catch (error) {
    console.error("Erreur getMovementById:", error);
    throw error;
  }
}


export async function createMovement(movement) {
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(movement),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Erreur lors de la création du mouvement: ${errorText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Erreur createMovement:", error);
    throw error;
  }
}
