package com.gs.project_gestion_stock.service;

import com.gs.project_gestion_stock.Dto.StockDTO;
import com.gs.project_gestion_stock.Mapper.StockMapper;
import com.gs.project_gestion_stock.Model.Emplacement;
import com.gs.project_gestion_stock.Model.Produit;
import com.gs.project_gestion_stock.Model.Stock;
import com.gs.project_gestion_stock.Repository.EmplacementRepository;
import com.gs.project_gestion_stock.Repository.ProduitRepository;
import com.gs.project_gestion_stock.Repository.StockRepository;
import com.gs.project_gestion_stock.messaging.StockAlertProducer;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class StockService {
    @Autowired
    private StockRepository stockRepository;

    @Autowired
    private ProduitRepository produitRepository;

    @Autowired
    private EmplacementRepository emplacementRepository;

    @Autowired
    private StockAlertProducer stockAlertProducer;

    public StockService(StockRepository stockRepository, StockAlertProducer stockAlertProducer) {
        this.stockRepository = stockRepository;
        this.stockAlertProducer = stockAlertProducer;
    }

    // ✅ Liste tous les stocks sous forme de DTO
    public List<StockDTO> getAllStock() {
        return stockRepository.findAll()
                .stream()
                .map(StockMapper::toDTO)
                .collect(Collectors.toList());
    }

    // ✅ Récupère un stock par ID
    public Optional<StockDTO> getStockByID(int id) {
        return stockRepository.findById(id)
                .map(StockMapper::toDTO);
    }

    // ✅ Crée un nouveau stock
    public Stock createStock(Stock stock) {
        return stockRepository.save(stock);
    }

    // ✅ Met à jour un stock et envoie une alerte si nécessaire
    public Stock updateStock(int id, Stock newStock) {
        return stockRepository.findById(id).map(stock -> {
            // ✅ Récupérer les objets complets depuis la base de données
            Produit produitComplet = produitRepository.findById(newStock.getProduit().getId())
                    .orElseThrow(() -> new RuntimeException("Produit non trouvé avec l'ID : " + newStock.getProduit().getId()));

            Emplacement emplacementComplet = emplacementRepository.findById(newStock.getEmplacement().getId())
                    .orElseThrow(() -> new RuntimeException("Emplacement non trouvé avec l'ID : " + newStock.getEmplacement().getId()));

            // ✅ Mise à jour des champs
            stock.setQuantite_importe(newStock.getQuantite_importe());
            stock.setQuantite_reserver(newStock.getQuantite_reserver());
            stock.setSeuil_reapprovisionnement(newStock.getSeuil_reapprovisionnement());
            stock.setDate_expiration(newStock.getDate_expiration());
            stock.setProduit(produitComplet);
            stock.setEmplacement(emplacementComplet);

            // ✅ Calcul de l'alerte
            int limiteMinimale = stock.getQuantite_reserver() + stock.getSeuil_reapprovisionnement();
            long joursRestants = ChronoUnit.DAYS.between(LocalDate.now(), stock.getDate_expiration());

            boolean seuilProche = stock.getQuantite_importe() <= limiteMinimale;
            boolean expirationProche = joursRestants <= 7;

            String typeAlerte = "";
            if (seuilProche && expirationProche) {
                typeAlerte = "BOTH";
            } else if (seuilProche) {
                typeAlerte = "SEUIL";
            } else if (expirationProche) {
                typeAlerte = "EXPIRATION";
            }

            // ✅ Envoi de l'alerte
            if (!typeAlerte.isEmpty()) {
                stockAlertProducer.sendStockAlert(
                        String.valueOf(produitComplet.getId()),
                        produitComplet.getNom(),
                        String.valueOf(produitComplet.getCategorie()),
                        produitComplet.getDescription(),
                        produitComplet.getCode_bare(),
                        produitComplet.getImage(),
                        String.valueOf(produitComplet.getPrix_unitaire()),
                        stock.getQuantite_importe(),
                        emplacementComplet.getNom(),
                        produitComplet.getId_fournisseur(),
                        typeAlerte
                );
            }
            System.out.println("✅ Alerte envoyée → " +
                    "Produit ID = " + produitComplet.getId() +
                    ", Nom = " + produitComplet.getNom() +
                    ", Fournisseurs = " + produitComplet.getId_fournisseur() +
                    ", Quantité restante = " + stock.getQuantite_importe() +
                    ", Emplacement = " + emplacementComplet.getNom() +
                    ", Type d'alerte = " + typeAlerte);

            return stockRepository.save(stock);
        }).orElseThrow(() -> new RuntimeException("Stock non trouvé avec l'ID : " + id));

    }

    // ✅ Supprime un stock
    public void deleteStock(int id) {
        if (!stockRepository.existsById(id)) {
            throw new RuntimeException("Le stock avec l'ID " + id + " n'existe pas.");
        }
        stockRepository.deleteById(id);
    }
}
