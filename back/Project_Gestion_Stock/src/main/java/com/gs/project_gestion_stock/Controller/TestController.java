package com.gs.project_gestion_stock.Controller;

import org.springframework.web.bind.annotation.*;
import com.gs.project_gestion_stock.messaging.StockAlertProducer;

@RestController
@RequestMapping("/api/test")
public class TestController {

    private final StockAlertProducer producer;

    public TestController(StockAlertProducer producer) {
        this.producer = producer;
    }

//    @GetMapping("/alerte")
//    public String sendAlerte() {
//        // Exemple simulé de produit
//        String produitId = "2";
//        String nomProduit = "Paracétamol";
//        int quantiteRestante = 12;
//        String nomEmplacement = "Geral";
//        int fournisseurId = 1;
//        String typeAlerte = "SEUIL";
//
//        producer.sendStockAlert(produitId, nomProduit, quantiteRestante, nomEmplacement,fournisseurId, typeAlerte);
//        return "Message enrichi envoyé à RabbitMQ";
//    }
}
