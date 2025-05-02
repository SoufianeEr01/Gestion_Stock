//package com.gs.project_gestion_stock.Controller;
//
//import com.gs.project_gestion_stock.service.MouvementStockService;
//import lombok.RequiredArgsConstructor;
//import org.springframework.http.ResponseEntity;
//import org.springframework.web.bind.annotation.*;
//
//@RestController
//@RequestMapping("/api/mouvements")
//@RequiredArgsConstructor
//public class MouvementStockController {
//
//    private final MouvementStockService mouvementService;
//
//    @PostMapping("/transfer")
//    public ResponseEntity<?> transfererProduit(
//            @RequestParam int stockId,
//            @RequestParam int emplacementDestinationId,
//            @RequestParam int quantite,
//            @RequestParam String utilisateurId
//    ) {
//        try {
//            mouvementService.transfererProduit(stockId, emplacementDestinationId, quantite, utilisateurId);
//            return ResponseEntity.ok("✅ Transfert effectué avec succès.");
//        } catch (RuntimeException e) {
//            return ResponseEntity.badRequest().body(" Erreur : " + e.getMessage());
//        }
//    }
//}
