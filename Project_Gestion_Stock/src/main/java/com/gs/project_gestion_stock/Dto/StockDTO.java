package com.gs.project_gestion_stock.Dto;

import lombok.Data;

import java.time.LocalDate;

@Data
public class StockDTO {
    private int id;
    private int quantiteImporte;
    private int quantiteReserver;
    private int seuilReapprovisionnement;
    private LocalDate date_expiration;
    private String produitNom;
    private String emplacementNom;
}
