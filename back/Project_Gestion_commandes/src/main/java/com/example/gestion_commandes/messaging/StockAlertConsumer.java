package com.example.gestion_commandes.messaging;

import org.springframework.stereotype.Component;
import java.util.Map;

@Component
public class StockAlertConsumer {

    // Cette méthode doit correspondre à "handleStockAlert" dans la config
    public void handleStockAlert(Map<String, Object> message) {
        String produitId = (String) message.get("produitId");
        Integer quantiteRestante = (Integer) message.get("quantiteRestante");

        System.out.println("✅ Alerte stock reçue : produit = " + produitId +
                ", quantité restante = " + quantiteRestante);

        // Génère une commande automatiquement
        genererCommande(produitId, 20);
    }

    private void genererCommande(String produitId, int quantite) {
        System.out.println("📦 Commande générée automatiquement : produit = " + produitId +
                ", quantité = " + quantite);

        // Simule une action : enregistrer commande, appeler un service, etc.
    }
}
