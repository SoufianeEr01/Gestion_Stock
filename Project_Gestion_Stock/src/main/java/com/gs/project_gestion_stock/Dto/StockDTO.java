package com.gs.project_gestion_stock.Dto;

import lombok.Data;

@Data
public class StockDTO {
    private int id;
    private int quantiteImporte;
    private int quantiteReserver;
    private int seuilReapprovisionnement;
    private String produitNom;
    private String emplacementNom;
    private String dateExpiration;
}
