package com.gs.project_gestion_stock.Repository;

import com.gs.project_gestion_stock.Model.Stock;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface StockRepository extends JpaRepository<Stock,Integer> {
    Optional<Stock> findByProduitIdAndEmplacementId(int produitId, int emplacementId);
}
