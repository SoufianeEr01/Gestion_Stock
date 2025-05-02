package com.gs.project_gestion_stock.Mapper;

import com.gs.project_gestion_stock.Dto.*;
import com.gs.project_gestion_stock.Model.*;

public class StockMapper {
    public static StockDTO toDTO(Stock stock) {
        if (stock == null) return null;

        StockDTO dto = new StockDTO();
        dto.setId(stock.getId());
        dto.setQuantite_importe(stock.getQuantite_importe());
        dto.setQuantite_reserver(stock.getQuantite_reserver());
        dto.setSeuil_reapprovisionnement(stock.getSeuil_reapprovisionnement());
        dto.setDate_expiration(stock.getDate_expiration());

        if (stock.getProduit() != null) {
            Produit p = stock.getProduit();
            ProduitDTO produitDTO = new ProduitDTO();
            produitDTO.setId(p.getId());
            produitDTO.setNom(p.getNom());
            produitDTO.setDescription(p.getDescription());
            produitDTO.setCategorie(p.getCategorie().toString());
            produitDTO.setImage(p.getImage());
            produitDTO.setCode_bare(p.getCode_bare());
            produitDTO.setPrix_unitaire(p.getPrix_unitaire());
            produitDTO.setQuantite_commande(p.getQuantite_commande());
            dto.setProduit(produitDTO);
        }

        if (stock.getEmplacement() != null) {
            Emplacement e = stock.getEmplacement();
            EmplacementDTO emplacementDTO = new EmplacementDTO();
            emplacementDTO.setId(e.getId());
            emplacementDTO.setNom(e.getNom());
            emplacementDTO.setAdresse(e.getAdresse());
            emplacementDTO.setType(e.getType().toString());
            dto.setEmplacement(emplacementDTO);
        }

        return dto;
    }
}
