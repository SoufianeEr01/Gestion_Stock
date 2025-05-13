export const API_URL = "http://localhost:8081/api/auth"; // Assurez-vous que l'URL est correcte

export async function Login(User) {
  try {
    const response = await fetch(`${API_URL}/login`, {
      method: 'POST',
      body: JSON.stringify(User),
      headers: { 'Content-Type': 'application/json' },
    });

    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(`Erreur HTTP: ${response.status} - ${errorData}`);
    }

    const responseData = await response.json();

    // 🔐 Stocker le token JWT dans le localStorage
    if (responseData.token) {
      localStorage.setItem('token', responseData.token);
      localStorage.setItem('roles', JSON.stringify(responseData.roles)); 
      localStorage.setItem('email', JSON.stringify(responseData.email)); 

      
    }

    return responseData;
  } catch (err) {
    console.error("Erreur lors de la requête :", err);
    throw err;
  }
}

