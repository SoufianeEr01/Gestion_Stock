package com.gs.project_gestion_stock.service;

import com.gs.project_gestion_stock.Repository.ProduitRepository;
import com.gs.project_gestion_stock.Model.Produit;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ProduitService {
    private final ProduitRepository produitRepository;

    public ProduitService(ProduitRepository produitRepository) {
        this.produitRepository = produitRepository;
    }

    public List<Produit> getAllProduits() {
        return produitRepository.findAll();
    }
//optional peut contenir un valeur ou etre null
    public Optional<Produit> getProduitById(int id) {
        return produitRepository.findById(id);
    }

    public Produit createProduit(Produit produit) {
        return produitRepository.save(produit);
    }

    public Produit updateProduit(int id, Produit updatedProduit) {
        return produitRepository.findById(id).map(p -> {
            p.setNom(updatedProduit.getNom());
            p.setDescription(updatedProduit.getDescription());
            p.setCategorie(updatedProduit.getCategorie());
            p.setImage(updatedProduit.getImage());
            p.setCode_bare(updatedProduit.getCode_bare());
            p.setPrix_unitaire(updatedProduit.getPrix_unitaire());
            p.setQuantite_commande(updatedProduit.getQuantite_commande());
            return produitRepository.save(p);
        }).orElse(null);
    }

    public void deleteProduit(int id) {
        produitRepository.deleteById(id);
    }
}
