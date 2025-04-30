package com.gs.project_gestion_stock.service;

import com.gs.project_gestion_stock.Dto.StockDTO;
import com.gs.project_gestion_stock.Model.Produit;
import com.gs.project_gestion_stock.Model.Stock;
import com.gs.project_gestion_stock.Repository.StockRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class StockService {
    public final StockRepository stockRepository;

    public StockService(StockRepository stockRepository){
        this.stockRepository=stockRepository;
    }
    public List<Stock> getAllStock() {
        return stockRepository.findAll();  // On retourne directement la liste des stocks
    }
    public Optional<Stock> getStockByID(int id){
        return stockRepository.findById(id);
    }


    public Stock createStock(Stock stock){
        return stockRepository.save(stock);
    }


    public Stock updateStock(int id, Stock newStock) {
        return stockRepository.findById(id).map(stock -> {
            stock.setQuantite_importe(newStock.getQuantite_importe());
            stock.setQuantite_reserver(newStock.getQuantite_reserver());
            stock.setSeuil_reapprovisionnement(newStock.getSeuil_reapprovisionnement());
            stock.setDate_expiration(newStock.getDate_expiration());
            stock.setProduit(newStock.getProduit());
            stock.setEmplacement(newStock.getEmplacement());
            return stockRepository.save(stock);
        }).orElseThrow(() -> new RuntimeException("Stock non trouvé avec l'ID : " + id));
    }

    public void deleteStock(int id) {
        if (!stockRepository.existsById(id)) {
            throw new RuntimeException("Le stock avec l'ID " + id + " n'existe pas.");
        }
        stockRepository.deleteById(id);
    }


}
