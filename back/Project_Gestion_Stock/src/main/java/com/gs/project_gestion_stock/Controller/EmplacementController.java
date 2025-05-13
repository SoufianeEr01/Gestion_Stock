package com.gs.project_gestion_stock.Controller;

import com.gs.project_gestion_stock.Dto.EmplacementDTO;
import com.gs.project_gestion_stock.service.EmplacementService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/emplacements")
@CrossOrigin(origins = "*") // autoriser les appels depuis le front (React, etc.)
public class EmplacementController {

    private final EmplacementService emplacementService;

    public EmplacementController(EmplacementService emplacementService) {
        this.emplacementService = emplacementService;
    }

    // Récupérer tous les emplacements
    @PreAuthorize("hasAnyRole('GESTIONNAIRE', 'ADMIN')")
    @GetMapping
    public ResponseEntity<List<EmplacementDTO>> getAllEmplacements() {
        List<EmplacementDTO> emplacements = emplacementService.getAllEmplacements();
        return emplacements.isEmpty() ? ResponseEntity.noContent().build() : ResponseEntity.ok(emplacements);
    }

    // Récupérer un emplacement par ID
    @PreAuthorize("hasAnyRole('GESTIONNAIRE', 'ADMIN')")
    @GetMapping("/{id}")
    public ResponseEntity<EmplacementDTO> getEmplacementById(@PathVariable int id) {
        return emplacementService.getEmplacementById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND).build());
    }

    // Créer un emplacement
    @PreAuthorize("hasAnyRole('GESTIONNAIRE', 'ADMIN')")
    @PostMapping
    public ResponseEntity<EmplacementDTO> createEmplacement(@RequestBody EmplacementDTO emplacementDTO) {
        if (emplacementDTO == null) {
            return ResponseEntity.badRequest().build(); // Si l'objet est mal formé
        }
        EmplacementDTO created = emplacementService.createEmplacement(emplacementDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    // Mettre à jour un emplacement
    @PreAuthorize("hasAnyRole('GESTIONNAIRE', 'ADMIN')")
    @PutMapping("/{id}")
    public ResponseEntity<EmplacementDTO> updateEmplacement(@PathVariable int id, @RequestBody EmplacementDTO emplacementDTO) {
        EmplacementDTO updated = emplacementService.updateEmplacement(id, emplacementDTO);
        if (updated == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build(); // Emplacement non trouvé
        }
        return ResponseEntity.ok(updated);
    }

    // Supprimer un emplacement
    @PreAuthorize("hasAnyRole('GESTIONNAIRE', 'ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteEmplacement(@PathVariable int id) {
        if (emplacementService.getEmplacementById(id).isPresent()) {
            emplacementService.deleteEmplacement(id);
            return ResponseEntity.noContent().build(); // Suppression réussie
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).build(); // Emplacement non trouvé
    }
}
