package com.siham.demo.repository;

import com.siham.demo.model.Commande;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CommandeRepository extends JpaRepository<Commande, Long> {
    // Find all commandes for a given buyer
    java.util.List<Commande> findByAcheteur(String acheteur);
}
