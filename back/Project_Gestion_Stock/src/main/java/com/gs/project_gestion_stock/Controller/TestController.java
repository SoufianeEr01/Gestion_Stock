package com.gs.project_gestion_stock.Controller;

import org.springframework.web.bind.annotation.*;
import com.gs.project_gestion_stock.messaging.StockAlertProducer;

@RestController
@RequestMapping("/api/test")
public class TestController {

    private final StockAlertProducer producer;

    // Constructeur pour injecter la dépendance StockAlertProducer
    public TestController(StockAlertProducer producer) {
        this.producer = producer;
    }

    // Méthode pour envoyer une alerte à RabbitMQ
    @GetMapping("/alerte")
    public String sendAlerte() {
        // Envoi du message d'alerte avec un produit spécifique et une quantité seuil
        producer.sendStockAlert("PROD001", 2);
        return "Message envoyé à RabbitMQ";
    }
}
