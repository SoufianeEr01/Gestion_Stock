package com.example.gestion_commandes.Dto;

import lombok.Data;

@Data
public class AlerteDTO {
    private Integer produitId;
    private String nomProduit;
    private String categorie;
    private String description;
    private String codeBare;
    private String image;
    private Double prixUnitaire;
    private Integer quantiteRestante;
    private String nomEmplacement;
    private Integer fournisseurId;
    private String typeAlerte;


    // Getters & Setters
}
