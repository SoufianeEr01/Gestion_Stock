package com.gs.project_gestion_stock.Controller;

import com.gs.project_gestion_stock.Model.Emplacement;
import com.gs.project_gestion_stock.service.EmplacementService;
import org.springframework.http.ResponseEntity;
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

    @GetMapping
    public List<Emplacement> getAllEmplacements() {
        return emplacementService.getAllEmplacements();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Emplacement> getEmplacementById(@PathVariable int id) {
        return emplacementService.getEmplacementById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public Emplacement createEmplacement(@RequestBody Emplacement emplacement) {
        return emplacementService.createEmplacement(emplacement);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Emplacement> updateEmplacement(@PathVariable int id, @RequestBody Emplacement emplacement) {
        Emplacement updated = emplacementService.updateEmplacement(id, emplacement);
        if (updated == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteEmplacement(@PathVariable int id) {
        emplacementService.deleteEmplacement(id);
        return ResponseEntity.noContent().build();
    }
}
