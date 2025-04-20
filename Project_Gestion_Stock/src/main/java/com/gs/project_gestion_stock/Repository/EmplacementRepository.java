package com.gs.project_gestion_stock.Repository;


import com.gs.project_gestion_stock.Model.Emplacement;
import org.springframework.data.jpa.repository.JpaRepository;
//Integer c'est Le type de la clé primaire de cette entité
public interface EmplacementRepository extends JpaRepository<Emplacement,Integer> {

}
