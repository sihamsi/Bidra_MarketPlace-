package com.siham.demo.controller;

import com.siham.demo.model.Produit;
import com.siham.demo.service.ProduitService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

@RestController
@CrossOrigin(origins = { "http://192.168.1.5:3000", "http://localhost:3000" }, allowCredentials = "true", maxAge = 3600)
@RequestMapping("/api/produits")
public class ProduitController {

    @Autowired
    private ProduitService produitService;

    @GetMapping
    public ResponseEntity<List<Produit>> getAllProduits() {
        return ResponseEntity.ok(produitService.getAllProduits());
    }

    @PostMapping(consumes = "multipart/form-data")
    public ResponseEntity<Produit> createProduit(
            @RequestParam("nom") String nom,
            @RequestParam("type") String type,
            @RequestParam("description") String description,
            @RequestParam("prix") Double prix,
            @RequestParam("stock") Integer stock,
            @RequestParam(value = "image", required = false) MultipartFile image) {

        Produit produit = Produit.builder()
                .nom(nom).type(type).description(description)
                .prix(prix).stock(stock).build();

        Produit savedProduit = produitService.createProduit(produit, image);
        return new ResponseEntity<>(savedProduit, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Produit> updateProduit(
            @PathVariable Long id,
            @RequestBody Produit produit) {
        Produit updated = produitService.updateProduit(id, produit);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProduit(@PathVariable Long id) {
        produitService.deleteProduit(id);
        return ResponseEntity.noContent().build();
    }

    // --- MISE À JOUR DU STOCK D'UN PRODUIT ---
    // Correction de l'URL pour éviter la répétition du préfixe "/api"
    // avec l'@RequestMapping de la classe
    @PutMapping("/stock-produit/{id}")
    public ResponseEntity<?> updateStock(@PathVariable Long id, @RequestBody Map<String, Integer> body) {
        int quantite = body.getOrDefault("quantite", 0);
        Produit produit = produitService.getProduitById(id);
        if (produit == null) {
            return ResponseEntity.notFound().build();
        }
        int nouveauStock = produit.getStock() - quantite;
        if (nouveauStock < 0)
            nouveauStock = 0;
        produit.setStock(nouveauStock);
        produitService.updateProduit(id, produit);
        return ResponseEntity.ok().build();
    }
}
