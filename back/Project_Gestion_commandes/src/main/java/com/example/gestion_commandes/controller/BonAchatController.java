package com.example.gestion_commandes.controller;

import com.example.gestion_commandes.model.BonAchat;
import com.example.gestion_commandes.repository.BonAchatRepository;
import com.example.gestion_commandes.service.EmailService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/bonachats")
@CrossOrigin(origins = "*")
public class BonAchatController {

    private final BonAchatRepository bonAchatRepository;
    private final EmailService emailService;

    public BonAchatController(BonAchatRepository bonAchatRepository, EmailService emailService) {
        this.bonAchatRepository = bonAchatRepository;
        this.emailService = emailService;
    }

    @GetMapping("/en-attente")
    public List<BonAchat> getBonsEnAttente() {
        return bonAchatRepository.findAll();
    }

    // Méthode pour approuver un bon d'achat et envoyer un email avec le PDF
    @PutMapping("/approuver/{id}")
    public BonAchat approuverBonAchat(@PathVariable Long id) {
        Optional<BonAchat> optionalBonAchat = bonAchatRepository.findById(id);

        if (optionalBonAchat.isPresent()) {
            BonAchat bonAchat = optionalBonAchat.get();
            bonAchat.setStatut("Approuvé");
            BonAchat updated = bonAchatRepository.save(bonAchat);

            // Envoi de l'e-mail avec le PDF
            emailService.envoyerBonAchatParEmail(updated);

            return updated;
        } else {
            throw new RuntimeException("Bon d'achat non trouvé avec l'ID " + id);
        }
    }
}
