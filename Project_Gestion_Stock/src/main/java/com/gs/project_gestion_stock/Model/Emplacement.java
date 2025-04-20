package com.gs.project_gestion_stock.Model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Entity
@Getter
@Setter
@Table(name="Emplacements")
public class Emplacement {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(nullable = false)
    private String nom;

    @Column(nullable = false)
    private String adresse;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private TypeEmplacement type;

    @OneToMany(mappedBy = "emplacementSource")
    private List<MouvementStock> mouvements_sortants;

    @OneToMany(mappedBy = "emplacementDestination")
    private List<MouvementStock> mouvements_entrants;

    @OneToMany(mappedBy = "emplacement")
    private List<Stock> stocks;
}
