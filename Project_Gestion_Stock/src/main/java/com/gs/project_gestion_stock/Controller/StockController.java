package com.gs.project_gestion_stock.Controller;

import com.gs.project_gestion_stock.Dto.StockDTO;
import com.gs.project_gestion_stock.Model.Stock;
import com.gs.project_gestion_stock.service.StockService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/stocks")
@CrossOrigin(origins = "*") // Autoriser toutes les origines (à restreindre en production)
public class StockController {

    private final StockService stockService;

    @Autowired
    public StockController(StockService stockService) {
        this.stockService = stockService;
    }

    // 🔹 Ajouter un nouveau stock
    @PostMapping
    public ResponseEntity<Stock> createStock( @RequestBody Stock stock) {
        Stock createdStock = stockService.createStock(stock);
        return ResponseEntity.ok(createdStock);
    }

    // 🔹 Récupérer tous les stocks


    // 🔹 Récupérer un stock par ID
    @GetMapping("/{id}")
    public ResponseEntity<Stock> getStockById(@PathVariable int id) {
        Optional<Stock> stock = stockService.getStockByID(id);
        return stock.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // 🔹 Mettre à jour un stock existant
    @PutMapping("/{id}")
    public ResponseEntity<Stock> updateStock(@PathVariable int id, @RequestBody Stock stock) {
        try {
            Stock updated = stockService.updateStock(id, stock);
            return ResponseEntity.ok(updated);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // 🔹 Supprimer un stock
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteStock(@PathVariable int id) {
        if (stockService.getStockByID(id).isPresent()) {
            stockService.deleteStock(id);
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping
    public ResponseEntity<List<StockDTO>> getAllStockLight() {
        return ResponseEntity.ok(stockService.getAllStockDTO());
    }

}
