package com.gs.project_gestion_stock.Dto;

import lombok.Data;
import java.time.LocalDate;

@Data
public class StockDTO {
    private int id;
    private int quantite_importe;
    private int quantite_reserver;
    private int seuil_reapprovisionnement;
    private LocalDate date_expiration;

    private ProduitDTO produit;
    private EmplacementDTO emplacement;
}
