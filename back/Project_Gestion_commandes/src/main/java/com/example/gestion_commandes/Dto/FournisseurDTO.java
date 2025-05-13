package com.example.gestion_commandes.Dto;

import lombok.Data;

@Data
public class FournisseurDTO {
    private int id;
    private String nom;
    private String email;
    private String telephone;
    private String adresse;
    private String pays;
    private String dateEnregistrement;
}