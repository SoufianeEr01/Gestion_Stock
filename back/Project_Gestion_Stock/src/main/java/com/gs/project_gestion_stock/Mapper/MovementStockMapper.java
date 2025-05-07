package com.gs.project_gestion_stock.Mapper;
import com.gs.project_gestion_stock.Dto.*;
import com.gs.project_gestion_stock.Model.*;
public class MovementStockMapper {

        public static MovementDTO toDTO(MouvementStock mouvementStock) {
            if (mouvementStock == null) return null;

            MovementDTO dto = new MovementDTO();
            dto.setId(mouvementStock.getId());
            dto.setUtilisateur_id(mouvementStock.getUtilisateur_id());
            dto.setDate_mouvement(mouvementStock.getDate_mouvement());
            dto.setQuantite(mouvementStock.getQuantite());
            dto.setType(mouvementStock.getType());

            // Conversion de l'entité Stock en StockDTO
            if (mouvementStock.getStock() != null) {
                StockDTO stockDTO = StockMapper.toDTO(mouvementStock.getStock());
                dto.setStock(stockDTO);
            }

            // Conversion de l'entité EmplacementSource en EmplacementDTO
            if (mouvementStock.getEmplacementSource() != null) {
                EmplacementDTO emplacementSourceDTO = new EmplacementDTO();
                Emplacement emplacementSource = mouvementStock.getEmplacementSource();
                emplacementSourceDTO.setId(emplacementSource.getId());
                emplacementSourceDTO.setNom(emplacementSource.getNom());
                emplacementSourceDTO.setAdresse(emplacementSource.getAdresse());
                emplacementSourceDTO.setType(emplacementSource.getType());
                dto.setEmplacement_source(emplacementSourceDTO);
            }

            // Conversion de l'entité EmplacementDestination en EmplacementDTO
            if (mouvementStock.getEmplacementDestination() != null) {
                EmplacementDTO emplacementDestinationDTO = new EmplacementDTO();
                Emplacement emplacementDestination = mouvementStock.getEmplacementDestination();
                emplacementDestinationDTO.setId(emplacementDestination.getId());
                emplacementDestinationDTO.setNom(emplacementDestination.getNom());
                emplacementDestinationDTO.setAdresse(emplacementDestination.getAdresse());
                emplacementDestinationDTO.setType(emplacementDestination.getType());
                dto.setEmplacement_destination(emplacementDestinationDTO);
            }

            return dto;
        }


}
