package com.siham.demo.service;

import com.siham.demo.model.Commande;
import com.siham.demo.model.Produit;
import com.siham.demo.repository.CommandeRepository;
import com.siham.demo.repository.ProduitRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class CommandeService {
    @Autowired
    private CommandeRepository commandeRepository;
    @Autowired
    private ProduitRepository produitRepository;

    public Commande enregistrerCommande(String acheteur, Long produitId, int quantite) {
        Produit produit = produitRepository.findById(produitId)
                .orElseThrow(() -> new RuntimeException("Produit non trouvé"));
        if (produit.getStock() < quantite) {
            throw new RuntimeException("Stock insuffisant");
        }
        produit.setStock(produit.getStock() - quantite);
        produitRepository.save(produit);
        Commande commande = Commande.builder()
                .acheteur(acheteur)
                .produit(produit)
                .quantite(quantite)
                .date(LocalDateTime.now())
                .status(Commande.Status.PENDING)
                .build();
        return commandeRepository.save(commande);
    }

    public Commande updateStatus(Long id, Commande.Status status) {
        Commande commande = commandeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Commande non trouvée"));
        commande.setStatus(status);
        return commandeRepository.save(commande);
    }

    public Commande.Status getStatus(Long id) {
        return commandeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Commande non trouvée"))
                .getStatus();
    }

    public List<Commande> getAllCommandes() {
        return commandeRepository.findAll();
    }

    public List<Commande> getCommandesByAcheteur(String acheteur) {
        return commandeRepository.findByAcheteur(acheteur);
    }
}