package com.gs.project_gestion_stock.service;


import com.gs.project_gestion_stock.Model.*;
import com.gs.project_gestion_stock.Repository.MouvementStockRepository;
import com.gs.project_gestion_stock.Repository.StockRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;

@Service
@RequiredArgsConstructor
public class MouvementStockService {

    private final MouvementStockRepository mouvementStockRepo;
    private final StockRepository stockRepo;

    @Transactional
    public void transfererProduit(int stockId, Long emplacementDestinationId, int quantite, String utilisateurId) {
        Stock stockSource = stockRepo.findById(stockId).orElseThrow(() ->
                new RuntimeException("Stock source introuvable"));
        int quantite_stocker=stockSource.getQuantite_disponible()+stockSource.getQuantite_reserver();
        if (quantite_stocker < quantite) {
            throw new RuntimeException("Quantité insuffisante pour le transfert !");
        }

        // Diminuer le stock source
        stockSource.setQuantite_disponible(stockSource.getQuantite_disponible() - quantite);
        stockRepo.save(stockSource);

        // Trouver ou créer le stock destination
        Stock stockDestination = stockRepo
                .findByProduitAndEmplacement(stockSource.getProduit(), emplacementDestinationId)
                .orElseGet(() -> {
                    Stock newStock = new Stock();
                    newStock.setProduit(stockSource.getProduit());
                    newStock.setEmplacement(stockRepo.getReferenceById(emplacementDestinationId).getEmplacement());
                    newStock.setQuantite_disponible(0);
                    newStock.setSeuil_reapprovisionnement(10);
                    return newStock;
                });

        // Augmenter le stock destination
        stockDestination.setQuantite_disponible(stockDestination.getQuantite_disponible() + quantite);
        stockRepo.save(stockDestination);

        // Enregistrer le mouvement
        MouvementStock mouvement = new MouvementStock();
        mouvement.setQuantite(quantite);
        mouvement.setDate_mouvement(LocalDate.now());
        mouvement.setType(TypeMouvement.TRANSFERT);
        mouvement.setStock(stockSource);
        mouvement.setUtilisateur_id(utilisateurId);
        mouvement.setEmplacementSource(stockSource.getEmplacement());
        mouvement.setEmplacementDestination(stockDestination.getEmplacement());
        mouvementStockRepo.save(mouvement);

        // Vérifier si stock source déclenche une alerte
        verifierAlerte(stockSource);
    }

    public void verifierAlerte(Stock stock) {
        if (stock.getQuantite_disponible() < stock.getSeuil_reapprovisionnement()) {
            System.out.println("⚠️ ALERTE : Le stock du produit " +
                    stock.getProduit().getNom() + " est inférieur au seuil !");
        }
    }
}
