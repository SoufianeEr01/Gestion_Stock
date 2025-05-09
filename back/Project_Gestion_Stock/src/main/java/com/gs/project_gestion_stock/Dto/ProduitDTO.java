package com.gs.project_gestion_stock.Dto;

import lombok.Data;

@Data
public class ProduitDTO {
    private int id;
    private String nom;
    private String description;
    private int id_fournisseur;
    private String categorie;
    private String image;
    private String code_bare;
    private int prix_unitaire;
    private int quantite_commande;
}
