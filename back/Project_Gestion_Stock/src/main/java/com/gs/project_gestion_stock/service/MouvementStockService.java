package com.gs.project_gestion_stock.service;

import com.gs.project_gestion_stock.Dto.EmplacementDTO;
import com.gs.project_gestion_stock.Dto.MovementDTO;
import com.gs.project_gestion_stock.Dto.StockDTO;
import com.gs.project_gestion_stock.Mapper.MovementStockMapper;
import com.gs.project_gestion_stock.Model.Emplacement;
import com.gs.project_gestion_stock.Model.MouvementStock;
import com.gs.project_gestion_stock.Model.Stock;
import com.gs.project_gestion_stock.Model.TypeMouvement;
import com.gs.project_gestion_stock.Repository.EmplacementRepository;
import com.gs.project_gestion_stock.Repository.MouvementStockRepository;
import com.gs.project_gestion_stock.Repository.StockRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MouvementStockService {

    private final MouvementStockRepository mouvementStockRepository;
    private final StockRepository stockRepository;
    private final EmplacementRepository emplacementRepository;

    public List<MovementDTO> findAll() {
        List<MouvementStock> mouvements = mouvementStockRepository.findAll();
        return mouvements.stream()
                .map(MovementStockMapper::toDTO)  // Utilisation du Mapper
                .collect(Collectors.toList());
    }

    public MovementDTO findById(int id) {
        MouvementStock mouvement = mouvementStockRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Mouvement stock avec l'ID " + id + " non trouvé."));
        return convertToDTO(mouvement);
    }

    @Transactional
    public MovementDTO save(MovementDTO dto) {

        // Vérification du type de mouvement
        if (dto.getType() == null || dto.getType() != TypeMouvement.TRANSFERT) {
            throw new IllegalArgumentException("Seuls les mouvements de type TRANSFERT sont autorisés.");
        }

        // Récupération du stock source
        Stock stockSource = stockRepository.findById(dto.getStock().getId())
                .orElseThrow(() -> new EntityNotFoundException("Stock source introuvable."));


        int quantite = dto.getQuantite();

        if (quantite <= 0) {
            throw new IllegalArgumentException("La quantité transférée doit être supérieure à zéro.");
        }

// Quantité disponible réellement transférable = quantité importée - quantité réservée
        int quantiteDisponible = stockSource.getQuantite_importe() - stockSource.getQuantite_reserver();

        if (quantite > quantiteDisponible) {
            throw new IllegalArgumentException("Quantité transférée dépasse la quantité disponible après réservation.");
        }

        // Vérification que l'emplacement source du stock correspond à l'emplacement dans le DTO
        if (stockSource.getEmplacement() == null
                || stockSource.getEmplacement().getId() != dto.getEmplacement_source().getId()) {
            throw new IllegalArgumentException("Le stock ne correspond pas à l'emplacement source.");
        }

        // Vérification de la quantité disponible dans l'emplacement source
        if (stockSource.getQuantite_importe() < quantite) {
            throw new IllegalArgumentException("Quantité insuffisante dans l'emplacement source.");
        }

        // Mise à jour du stock source
        stockSource.setQuantite_importe(stockSource.getQuantite_importe() - quantite);
        stockRepository.save(stockSource);

        // Recherche ou création du stock destination
        Stock stockDestination = stockRepository.findByProduitIdAndEmplacementId(
                stockSource.getProduit().getId(),
                dto.getEmplacement_destination().getId()
        ).orElseGet(() -> {
            Emplacement emplacementDest = emplacementRepository.findById(dto.getEmplacement_destination().getId())
                    .orElseThrow(() -> new EntityNotFoundException("Emplacement destination introuvable."));

            Stock newStock = new Stock();
            newStock.setProduit(stockSource.getProduit());
            newStock.setEmplacement(emplacementDest);
            newStock.setQuantite_importe(0);
            newStock.setQuantite_reserver(stockSource.getQuantite_reserver());
            newStock.setSeuil_reapprovisionnement(stockSource.getSeuil_reapprovisionnement());
            newStock.setDate_expiration(stockSource.getDate_expiration());
            return newStock;
        });

        stockDestination.setQuantite_importe(stockDestination.getQuantite_importe() + quantite);
        stockRepository.save(stockDestination);

        // Construction du MouvementStock à partir du DTO
        MouvementStock mouvement = new MouvementStock();
        mouvement.setUtilisateur_id(dto.getUtilisateur_id());
        mouvement.setDate_mouvement(dto.getDate_mouvement());
        mouvement.setQuantite(dto.getQuantite());
        mouvement.setType(dto.getType());
        mouvement.setStock(stockSource);

        // Récupération des emplacements source et destination
        Emplacement emplacementSrc = emplacementRepository.findById(dto.getEmplacement_source().getId())
                .orElseThrow(() -> new EntityNotFoundException("Emplacement source introuvable."));
        Emplacement emplacementDest = emplacementRepository.findById(dto.getEmplacement_destination().getId())
                .orElseThrow(() -> new EntityNotFoundException("Emplacement destination introuvable."));

        mouvement.setEmplacementSource(emplacementSrc);
        mouvement.setEmplacementDestination(emplacementDest);

        mouvementStockRepository.save(mouvement);

        return convertToDTO(mouvement);
    }

    // Méthode de conversion vers DTO
    private MovementDTO convertToDTO(MouvementStock mouvement) {
        MovementDTO dto = new MovementDTO();
        dto.setId(mouvement.getId());
        dto.setUtilisateur_id(mouvement.getUtilisateur_id());
        dto.setDate_mouvement(mouvement.getDate_mouvement());
        dto.setQuantite(mouvement.getQuantite());
        dto.setType(mouvement.getType());

        // Stock
        StockDTO stockDTO = new StockDTO();
        stockDTO.setId(mouvement.getStock().getId());
        dto.setStock(stockDTO);

        // Emplacement source
        EmplacementDTO sourceDTO = new EmplacementDTO();
        sourceDTO.setId(mouvement.getEmplacementSource().getId());
        sourceDTO.setNom(mouvement.getEmplacementSource().getNom());
        sourceDTO.setAdresse(mouvement.getEmplacementSource().getAdresse());
        sourceDTO.setType(mouvement.getEmplacementSource().getType());
        dto.setEmplacement_source(sourceDTO);

        // Emplacement destination
        EmplacementDTO destDTO = new EmplacementDTO();
        destDTO.setId(mouvement.getEmplacementDestination().getId());
        destDTO.setNom(mouvement.getEmplacementDestination().getNom());
        destDTO.setAdresse(mouvement.getEmplacementDestination().getAdresse());
        destDTO.setType(mouvement.getEmplacementDestination().getType());
        dto.setEmplacement_destination(destDTO);

        return dto;
    }
}
