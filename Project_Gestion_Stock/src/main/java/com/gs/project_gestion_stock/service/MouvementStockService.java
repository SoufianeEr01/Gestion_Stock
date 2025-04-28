//package com.gs.project_gestion_stock.service;
//
//import com.gs.project_gestion_stock.Model.*;
//import com.gs.project_gestion_stock.Repository.MouvementStockRepository;
//import com.gs.project_gestion_stock.Repository.StockRepository;
//import jakarta.transaction.Transactional;
//import lombok.RequiredArgsConstructor;
//import org.springframework.stereotype.Service;
//
//import java.time.LocalDate;
//
//@Service
//@RequiredArgsConstructor
//public class MouvementStockService {
//
//    private final MouvementStockRepository mouvementRepo;
//    private final StockRepository stockRepo;
//
//    @Transactional
//    public void transfererProduit(int stockId, int emplacementDestId, int quantite, String utilisateurId) {
//
//        Stock stockSource = stockRepo.findById(stockId)
//                .orElseThrow(() -> new RuntimeException("Stock source introuvable"));
//
//        int totalDisponible = stockSource.getQuantite_importe() + stockSource.getQuantite_reserver();
//        if (quantite > totalDisponible) {
//            throw new RuntimeException(" Quantité insuffisante pour le transfert");
//        }
//
//        // Mise à jour du stock source
//        stockSource.setQuantite_importe(stockSource.getQuantite_importe() - quantite);
//        stockRepo.save(stockSource);
//
//        // Récupération ou création du stock destination
//        Stock stockDest = stockRepo.findByProduitAndEmplacement(
//                stockSource.getProduit().getId(), emplacementDestId
//        ).orElseGet(() -> {
//            Stock nouveau = new Stock();
//            nouveau.setProduit(stockSource.getProduit());
//            nouveau.setEmplacement(stockRepo.getReferenceById(emplacementDestId).getEmplacement());
//            nouveau.setQuantite_importe(0);
//            nouveau.setSeuil_reapprovisionnement(10);
//            return stockRepo.save(nouveau);
//        });
//
//        // Mise à jour du stock destination
//        stockDest.setQuantite_importe(stockDest.getQuantite_importe() + quantite);
//        stockRepo.save(stockDest);
//
//        // Enregistrement du mouvement
//        MouvementStock mouvement = new MouvementStock();
//        mouvement.setQuantite(quantite);
//        mouvement.setDate_mouvement(LocalDate.now());
//        mouvement.setType(TypeMouvement.TRANSFERT);
//        mouvement.setUtilisateur_id(utilisateurId);
//        mouvement.setStock(stockSource);
//        mouvement.setEmplacementSource(stockSource.getEmplacement());
//        mouvement.setEmplacementDestination(stockDest.getEmplacement());
//        mouvementRepo.save(mouvement);
//
//        verifierAlerte(stockSource);
//    }
//
//    private void verifierAlerte(Stock stock) {
//        if (stock.getQuantite_importe() < stock.getSeuil_reapprovisionnement()) {
//            System.out.println(" ALERTE : Stock faible pour le produit : " + stock.getProduit().getNom());
//        }
//    }
//}
