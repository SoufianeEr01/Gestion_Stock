package com.gs.project_gestion_stock.messaging;

import com.gs.project_gestion_stock.config.RabbitMQConfig;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
public class StockAlertProducer {

    private final RabbitTemplate rabbitTemplate;

    public StockAlertProducer(RabbitTemplate rabbitTemplate) {
        this.rabbitTemplate = rabbitTemplate;
    }

    /**
     * Envoie une alerte de stock à RabbitMQ.
     * @param produitId ID du produit
     * @param quantiteRestante Quantité restante
     * @param typeAlerte Type d’alerte : SEUIL, EXPIRATION ou BOTH
     */
    public void sendStockAlert(String produitId, String nomProduit, String categorie, String description,
                               String codeBare, String image, String prixUnitaire,
                               int quantiteRestante, String nomEmplacement,
                               int fournisseurId, String typeAlerte) {

        Map<String, Object> message = new HashMap<>();
        message.put("produitId", produitId);
        message.put("nomProduit", nomProduit);
        message.put("categorie", categorie);
        message.put("description", description);
        message.put("codeBare", codeBare);
        message.put("image", image);
        message.put("prixUnitaire", prixUnitaire);
        message.put("quantiteRestante", quantiteRestante);
        message.put("nomEmplacement", nomEmplacement);
        message.put("fournisseur", fournisseurId);
        message.put("typeAlerte", typeAlerte);

        rabbitTemplate.convertAndSend(RabbitMQConfig.QUEUE_NAME, message);
    }


}
