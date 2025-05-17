package com.gs.project_gestion_stock.Controller;

import com.gs.project_gestion_stock.Model.Produit;
import com.gs.project_gestion_stock.service.ProduitService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/produits")
@PreAuthorize("hasAnyRole('GESTIONNAIRE', 'ADMIN')")
@CrossOrigin(origins = "*")

public class ProduitController {
    private final ProduitService produitService;

    // Constructeur pour injecter le service Produit
    public ProduitController(ProduitService produitService) {
        this.produitService = produitService;
    }

    // GET all produits
    @GetMapping
    public List<Produit> getAllProduits() {
        return produitService.getAllProduits();
    }

    // GET produit by ID
    @GetMapping("/{id}")
    public ResponseEntity<Produit> getProduitById(@PathVariable int id) {
        return produitService.getProduitById(id)
                .map(ResponseEntity::ok)  // Si trouvé, retourne le produit avec un statut 200
                .orElse(ResponseEntity.notFound().build());  // Si non trouvé, retourne un statut 404
    }

    // POST - create a new product
    @PostMapping
    public ResponseEntity<?> createProduit(@RequestBody @Valid Produit produit) {
        Produit created = produitService.createProduit(produit);
        return ResponseEntity.ok(created);
    }

    // PUT - update an existing product
    @PutMapping("/{id}")
    public ResponseEntity<Produit> updateProduit(@PathVariable int id, @RequestBody Produit produit) {
        Produit updated = produitService.updateProduit(id, produit);
        if (updated == null) return ResponseEntity.notFound().build();  // Si le produit n'existe pas, retourne un statut 404
        return ResponseEntity.ok(updated);  // Sinon, retourne le produit mis à jour avec un statut 200
    }

    // DELETE - delete a product by ID
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProduit(@PathVariable int id) {
        produitService.deleteProduit(id);
        return ResponseEntity.noContent().build();  // Retourne un statut 204 (pas de contenu)
    }
}
