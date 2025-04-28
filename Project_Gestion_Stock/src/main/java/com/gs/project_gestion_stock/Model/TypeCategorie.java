package com.gs.project_gestion_stock.Model;

public enum TypeCategorie {
    Electronique,
    Alimentaire,
    Vestimentaire,
    Bricolage,
    Informatique,
    Pharmaceutique,
    Mobilier,
    Papeterie,
    Automobile,
    Peinture,
    Outils,
    Matériaux;

    public static TypeCategorie fromOrdinal(int ordinal) {
        return TypeCategorie.values()[ordinal];
    }
}

