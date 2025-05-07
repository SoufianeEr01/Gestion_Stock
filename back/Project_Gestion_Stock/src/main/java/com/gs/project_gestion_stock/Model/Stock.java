package com.gs.project_gestion_stock.Model;

import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Entity
@Getter
@Setter
@Table(name="Stocks")
@JsonIdentityInfo(generator = ObjectIdGenerators.PropertyGenerator.class, property = "id")
public class Stock {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(nullable = false)
    private int quantite_importe;
    @Column(nullable = false)
    private int quantite_reserver;
    @Column(nullable = false)
    private int seuil_reapprovisionnement;
    @Column(nullable = false)
    private LocalDate date_expiration;

    @ManyToOne
    private Produit produit;

    @ManyToOne(fetch = FetchType.EAGER)
    private Emplacement emplacement;
}
