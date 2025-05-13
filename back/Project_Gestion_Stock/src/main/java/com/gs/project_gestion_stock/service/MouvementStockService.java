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
import com.gs.project_gestion_stock.messaging.StockAlertProducer;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
@Service
@RequiredArgsConstructor
public class MouvementStockService {

    private final MouvementStockRepository mouvementStockRepository;
    private final StockRepository stockRepository;
    private final EmplacementRepository emplacementRepository;
    private final StockAlertProducer stockAlertProducer;

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
        if (dto.getType() == null || dto.getType() != TypeMouvement.TRANSFERT) {
            throw new IllegalArgumentException("Seuls les mouvements de type TRANSFERT sont autorisés.");
        }

        Stock stockSource = stockRepository.findById(dto.getStock().getId())
                .orElseThrow(() -> new EntityNotFoundException("Stock source introuvable."));

        int quantite = dto.getQuantite();
        if (quantite <= 0) {
            throw new IllegalArgumentException("La quantité transférée doit être supérieure à 0.");
        }

        if (stockSource.getEmplacement() == null
                || stockSource.getEmplacement().getId() != dto.getEmplacement_source().getId()) {
            throw new IllegalArgumentException("Le stock ne correspond pas à l'emplacement source.");
        }

        if (stockSource.getQuantite_importe() < quantite) {
            throw new IllegalArgumentException("Quantité insuffisante dans l'emplacement source.");
        }

        // ✅ Mise à jour du stock source
        stockSource.setQuantite_importe(stockSource.getQuantite_importe() - quantite);
        stockRepository.save(stockSource);

        // ✅ Vérification et envoi de l'alerte sur le stock source
        int limiteMinimale = stockSource.getQuantite_reserver() + stockSource.getSeuil_reapprovisionnement();
        long joursRestants = ChronoUnit.DAYS.between(LocalDate.now(), stockSource.getDate_expiration());

        boolean seuilProche = stockSource.getQuantite_importe() <= limiteMinimale;
        boolean expirationProche = joursRestants <= 7;

        String typeAlerte = "";
        if (seuilProche && expirationProche) {
            typeAlerte = "BOTH";
        } else if (seuilProche) {
            typeAlerte = "SEUIL";
        } else if (expirationProche) {
            typeAlerte = "EXPIRATION";
        }
        if (!typeAlerte.isEmpty()) {
            stockAlertProducer.sendStockAlert(
                    String.valueOf(stockSource.getProduit().getId()),
                    stockSource.getProduit().getNom(),
                    String.valueOf(stockSource.getProduit().getCategorie()),
                    stockSource.getProduit().getDescription(),
                    stockSource.getProduit().getCode_bare(),
                    stockSource.getProduit().getImage(),
                    String.valueOf(stockSource.getProduit().getPrix_unitaire()),
                    stockSource.getQuantite_importe(),
                    stockSource.getEmplacement().getNom(),
                    stockSource.getProduit().getId_fournisseur(),
                    typeAlerte
            );
        }

        // ✅ Gestion du stock destination
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

        // ✅ Création du mouvement
        MouvementStock mouvement = new MouvementStock();
        mouvement.setUtilisateur_id(dto.getUtilisateur_id());
        mouvement.setDate_mouvement(dto.getDate_mouvement());
        mouvement.setQuantite(dto.getQuantite());
        mouvement.setType(dto.getType());
        mouvement.setStock(stockSource);

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
