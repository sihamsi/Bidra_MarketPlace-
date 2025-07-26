package com.siham.demo.controller;

import com.siham.demo.model.Commande;
import com.siham.demo.service.CommandeService;
import lombok.Data;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/commandes")
public class CommandeController {
    @Autowired
    private CommandeService commandeService;

    @PostMapping
    public ResponseEntity<Commande> enregistrerCommande(@RequestBody CommandeRequest request) {
        Commande commande = commandeService.enregistrerCommande(request.getAcheteur(), request.getProduitId(),
                request.getQuantite());
        return ResponseEntity.ok(commande);
    }

    @GetMapping
    public ResponseEntity<List<Commande>> getAllCommandes() {
        return ResponseEntity.ok(commandeService.getAllCommandes());
    }

    @GetMapping("/{id}/status")
    public ResponseEntity<Commande.Status> getStatus(@PathVariable Long id) {
        return ResponseEntity.ok(commandeService.getStatus(id));
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<Commande> updateStatus(@PathVariable Long id, @RequestBody StatusRequest request) {
        Commande commande = commandeService.updateStatus(id, request.getStatus());
        return ResponseEntity.ok(commande);
    }

    @GetMapping("/acheteur/{acheteur}")
    public ResponseEntity<List<Commande>> getCommandesByAcheteur(@PathVariable String acheteur) {
        return ResponseEntity.ok(commandeService.getCommandesByAcheteur(acheteur));
    }

    @Data
    public static class CommandeRequest {
        private String acheteur;
        private Long produitId;
        private int quantite;
    }

    @Data
    public static class StatusRequest {
        private Commande.Status status;
    }
}
