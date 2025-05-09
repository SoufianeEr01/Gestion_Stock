//package com.example.gestion_commandes.controller;
//
//import org.springframework.web.bind.annotation.*;
//
//@RestController
//@RequestMapping("/api/commandes")
//public class CommandeController {
//
//    private final CommandeProducer commandeProducer;
//
//    public CommandeController(CommandeProducer commandeProducer) {
//        this.commandeProducer = commandeProducer;
//    }
//
//    @PostMapping("/envoyer")
//    public String envoyerCommande(@RequestBody String commandeJson) {
//        commandeProducer.envoyerCommande(commandeJson);
//        return "Commande envoyée à RabbitMQ.";
//    }
//}
