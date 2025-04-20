package com.gs.project_gestion_stock.Controller;

import com.gs.project_gestion_stock.service.MouvementStockService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/mouvements")
@RequiredArgsConstructor
public class MouvementStockController {

    private final MouvementStockService mouvementStockService;

    @PostMapping("/transfer")
    public ResponseEntity<String> transferer(
            @RequestParam Long stockId,
            @RequestParam Long emplacementDestinationId,
            @RequestParam int quantite,
            @RequestParam String utilisateurId
    ) {
        try {
            mouvementStockService.transfererProduit(stockId, emplacementDestinationId, quantite, utilisateurId);
            return ResponseEntity.ok("Transfert effectué avec succès !");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Erreur : " + e.getMessage());
        }
    }
}
