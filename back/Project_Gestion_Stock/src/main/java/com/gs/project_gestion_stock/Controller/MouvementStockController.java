package com.gs.project_gestion_stock.Controller;

import com.gs.project_gestion_stock.Dto.MovementDTO;
import com.gs.project_gestion_stock.Model.MouvementStock;
import com.gs.project_gestion_stock.service.MouvementStockService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/mouvements")
@RequiredArgsConstructor
@CrossOrigin("*")
public class MouvementStockController {

    private final MouvementStockService mouvementStockService;

    // Récupérer tous les mouvements
    @PreAuthorize("hasAnyRole('GESTIONNAIRE', 'ADMIN')")
    @GetMapping
    public ResponseEntity<List<MovementDTO>> getAllMouvements() {
        List<MovementDTO> mouvements = mouvementStockService.findAll();
        return mouvements.isEmpty() ? ResponseEntity.noContent().build() : ResponseEntity.ok(mouvements);
    }

    // Récupérer un mouvement par ID
    @PreAuthorize("hasAnyRole('GESTIONNAIRE', 'ADMIN')")
    @GetMapping("/{id}")
    public ResponseEntity<MovementDTO> getMouvementById(@PathVariable int id) {
        MovementDTO mouvementDTO = mouvementStockService.findById(id);
        return mouvementDTO != null ? ResponseEntity.ok(mouvementDTO) :
                ResponseEntity.status(HttpStatus.NOT_FOUND).build();
    }

    // Créer un nouveau mouvement
    @PreAuthorize("hasAnyRole('GESTIONNAIRE', 'ADMIN')")
    @PostMapping
    public ResponseEntity<MovementDTO> createMouvement(@RequestBody MovementDTO mouvementDTO) {
        if (mouvementDTO == null) {
            return ResponseEntity.badRequest().build();  // Si le corps de la requête est vide ou incorrect
        }
        try {
            MovementDTO createdMouvement = mouvementStockService.save(mouvementDTO);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdMouvement);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();  // Erreur interne du serveur
        }
    }
}
