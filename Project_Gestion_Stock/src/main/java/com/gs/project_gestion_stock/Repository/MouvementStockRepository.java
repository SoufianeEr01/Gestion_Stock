package com.gs.project_gestion_stock.Repository;

import com.gs.project_gestion_stock.Model.MouvementStock;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MouvementStockRepository extends JpaRepository<MouvementStock, Integer> {
}
