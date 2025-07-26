package com.siham.demo.service;

import com.siham.demo.model.Produit;
import com.siham.demo.repository.ProduitRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Optional;

@Service
public class ProduitService {

    @Autowired
    private ProduitRepository produitRepository;

    @Autowired
    private FileStorageService fileStorageService;

    public List<Produit> getAllProduits() {
        return produitRepository.findAll();
    }

    public Produit createProduit(Produit produit, MultipartFile image) {
        if (image != null && !image.isEmpty()) {
            String filename = fileStorageService.save(image);
            produit.setNomImage(filename);
        }
        return produitRepository.save(produit);
    }

    public void deleteProduit(Long id) {
        Optional<Produit> produitOpt = produitRepository.findById(id);
        if (produitOpt.isPresent()) {
            Produit produit = produitOpt.get();
            if (produit.getNomImage() != null) {
                fileStorageService.delete(produit.getNomImage());
            }
            produitRepository.deleteById(id);
        }
    }

    public Produit updateProduit(Long id, Produit produit) {
        Produit existing = produitRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Produit non trouvé"));

        existing.setNom(produit.getNom());
        existing.setType(produit.getType());
        existing.setDescription(produit.getDescription());
        existing.setPrix(produit.getPrix());
        existing.setStock(produit.getStock());

        return produitRepository.save(existing);
    }

    public Produit getProduitById(Long id) {
        return produitRepository.findById(id).orElse(null);
    }
}
