package com.gs.project_gestion_stock.Repository;

import com.gs.project_gestion_stock.Model.Stock;
import org.springframework.data.jpa.repository.JpaRepository;

public interface StockRepository extends JpaRepository<Stock,Integer> {

}
