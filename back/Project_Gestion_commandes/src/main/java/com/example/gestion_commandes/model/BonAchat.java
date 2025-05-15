package com.example.gestion_commandes.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import java.time.LocalDate;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Table(name = "bon_achat")
@Data
public class BonAchat {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long produitId;
    private String nomProduit;
    private String categorie;
    private String description;
    private String codeBare;
    private String image;
    private Double prixUnitaire;

    private int quantite;
    private String emplacement;
    private LocalDate dateCreation;
    private String statut;
    private Long fournisseurId;
    private String typeAlerte;
    private String nomFournisseur;
    private String adresseFournisseur;
    private String emailFournisseur;
    private String telephoneFournisseur;

    // Getters, Setters, Constructors (via Lombok)
}
