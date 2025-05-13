package com.gs.project_gestion_stock.Controller;

import com.gs.project_gestion_stock.Dto.StockDTO;
import com.gs.project_gestion_stock.Model.Stock;
import com.gs.project_gestion_stock.service.StockService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/stocks")
@CrossOrigin(origins = "*")
public class StockController {

    private final StockService stockService;

    @Autowired
    public StockController(StockService stockService) {
        this.stockService = stockService;
    }

    // Créer un nouveau stock
    @PreAuthorize("hasAnyRole('GESTIONNAIRE', 'ADMIN')")
    @PostMapping("")
    public ResponseEntity<Stock> createStock(@RequestBody Stock stock) {
        if (stock == null) {
            return ResponseEntity.badRequest().build();  // Si l'objet stock est null
        }
        Stock createdStock = stockService.createStock(stock);
        return new ResponseEntity<>(createdStock, HttpStatus.CREATED);
    }

    // Obtenir un stock par ID
    @PreAuthorize("hasAnyRole('GESTIONNAIRE', 'ADMIN')")
    @GetMapping("/{id}")
    public ResponseEntity<StockDTO> getStockById(@PathVariable int id) {
        Optional<StockDTO> stockDTO = stockService.getStockByID(id);
        return stockDTO.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).build());
    }

    // Mettre à jour un stock
    @PreAuthorize("hasAnyRole('GESTIONNAIRE', 'ADMIN')")
    @PutMapping("/{id}")
    public ResponseEntity<Stock> updateStock(@PathVariable int id, @RequestBody Stock stock) {
        if (stock == null) {
            return ResponseEntity.badRequest().build();  // Si l'objet stock est null
        }
        try {
            Stock updated = stockService.updateStock(id, stock);
            if (updated == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).build();  // Si le stock n'est pas trouvé
            }
            return ResponseEntity.ok(updated);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();  // Erreur interne
        }
    }

    // Supprimer un stock par ID
    @PreAuthorize("hasAnyRole('GESTIONNAIRE', 'ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteStock(@PathVariable int id) {
        Optional<StockDTO> stockDTO = stockService.getStockByID(id);
        if (stockDTO.isPresent()) {
            stockService.deleteStock(id);
            return ResponseEntity.noContent().build();  // Suppression réussie
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();  // Stock non trouvé
        }
    }

    // Obtenir tous les stocks
    @PreAuthorize("hasAnyRole('GESTIONNAIRE', 'ADMIN')")
    @GetMapping("")
    public ResponseEntity<List<StockDTO>> getAllStocks() {
        List<StockDTO> stocks = stockService.getAllStock();
        return stocks.isEmpty() ? ResponseEntity.noContent().build() : ResponseEntity.ok(stocks);  // Gérer le cas où la liste est vide
    }
}
