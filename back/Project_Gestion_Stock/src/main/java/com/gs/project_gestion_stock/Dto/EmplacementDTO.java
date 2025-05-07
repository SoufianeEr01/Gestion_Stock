package com.gs.project_gestion_stock.Dto;

import com.gs.project_gestion_stock.Model.TypeEmplacement;
import lombok.Data;

@Data
public class EmplacementDTO {
    private int id;
    private String nom;
    private String adresse;
    private TypeEmplacement type;
}
