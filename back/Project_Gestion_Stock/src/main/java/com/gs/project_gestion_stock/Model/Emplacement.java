package com.gs.project_gestion_stock.Model;

import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Entity
@Getter
@Setter
@Table(name = "Emplacements")
@JsonIdentityInfo(generator = ObjectIdGenerators.PropertyGenerator.class, property = "id")
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

    @OneToMany(mappedBy = "emplacement")
    private List<Stock> stocks;

    @OneToMany(mappedBy = "emplacementSource")
    private List<MouvementStock> mouvementsSortants;

    @OneToMany(mappedBy = "emplacementDestination")
    private List<MouvementStock> mouvementsEntrants;
}
