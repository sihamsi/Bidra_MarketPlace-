package com.siham.demo;
import com.siham.demo.model.Commande;
import com.siham.demo.model.Produit;
import com.siham.demo.repository.CommandeRepository;
import com.siham.demo.repository.ProduitRepository;
import com.siham.demo.service.CommandeService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class CommandeServiceTest {

    @Mock
    private CommandeRepository commandeRepository;
    @Mock
    private ProduitRepository produitRepository;
    @InjectMocks
    private CommandeService commandeService;

    @Test
    void enregistrerCommandeThrowsExceptionWhenStockInsufficient() {
        Produit produit = Produit.builder().id(1L).stock(5).build();
        when(produitRepository.findById(1L)).thenReturn(Optional.of(produit));

        RuntimeException ex = assertThrows(RuntimeException.class,
                () -> commandeService.enregistrerCommande("buyer", 1L, 10));
        assertEquals("Stock insuffisant", ex.getMessage());
        verify(commandeRepository, never()).save(any(Commande.class));
        verify(produitRepository, never()).save(any(Produit.class));
    }

    @Test
    void enregistrerCommandePersistsCommandeAndUpdatesStockWhenSufficient() {
        Produit produit = Produit.builder().id(1L).stock(20).build();
        when(produitRepository.findById(1L)).thenReturn(Optional.of(produit));
        when(produitRepository.save(any(Produit.class))).thenAnswer(invocation -> invocation.getArgument(0));
        when(commandeRepository.save(any(Commande.class))).thenAnswer(invocation -> invocation.getArgument(0));

        Commande commande = commandeService.enregistrerCommande("buyer", 1L, 5);

        assertEquals(15, produit.getStock());
        verify(produitRepository).save(produit);
        verify(commandeRepository).save(any(Commande.class));
        assertEquals("buyer", commande.getAcheteur());
        assertEquals(5, commande.getQuantite());
        assertEquals(produit, commande.getProduit());
        assertEquals(Commande.Status.PENDING, commande.getStatus());
    }
}
