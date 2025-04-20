package com.gs.project_gestion_stock.Model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
@Entity
@Getter
@Setter
@Table(name = "MouvementStocks")
public class MouvementStock {

        @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)
        private int id;

        @Column(nullable = false)
        private String utilisateur_id;


        @Column(nullable = false)
        private LocalDate date_mouvement;

        @Column(nullable = false)
        @Min(1)
        private int quantite;

        @Enumerated(EnumType.STRING)
        private TypeMouvement type;

        @ManyToOne
        private Stock stock;

        @ManyToOne
        @JoinColumn(name = "emplacement_source_id")
        private Emplacement emplacementSource;

        @ManyToOne
        @JoinColumn(name = "emplacement_destination_id")
        private Emplacement emplacementDestination;
}
