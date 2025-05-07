package com.gs.project_gestion_stock.Dto;

import com.gs.project_gestion_stock.Model.TypeMouvement;
import lombok.Data;
import java.time.LocalDate;

@Data
public class MovementDTO {

        private int id;
        private String utilisateur_id;
        private LocalDate date_mouvement;
        private int quantite;
        private TypeMouvement type;
        private StockDTO stock;
        private EmplacementDTO emplacement_source;
        private EmplacementDTO emplacement_destination;


}
