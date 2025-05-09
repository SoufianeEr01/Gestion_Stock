package com.gs.project_gestion_stock.Model;

import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
@Table(name="Produits")
@JsonIdentityInfo(generator = ObjectIdGenerators.PropertyGenerator.class, property = "id")
public class Produit {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(nullable = false)
    private String nom;

    @Column(nullable = false)
    private String description;

    @Column(nullable = false)
    private int id_fournisseur;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TypeCategorie categorie;


    private String image;

    @Column(nullable = false)
    private String code_bare;

    @Column(nullable = false)
    private int prix_unitaire;

    @Column(nullable = false)
    private int quantite_commande;

}
