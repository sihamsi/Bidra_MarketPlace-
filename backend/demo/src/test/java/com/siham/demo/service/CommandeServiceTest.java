package com.siham.demo.service;

import com.siham.demo.model.Commande;
import com.siham.demo.repository.CommandeRepository;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

public class CommandeServiceTest {
    @Mock
    private CommandeRepository commandeRepository;

    @InjectMocks
    private CommandeService commandeService;

    public CommandeServiceTest() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testGetCommandesByAcheteur() {
        String acheteur = "john";
        when(commandeRepository.findByAcheteur(acheteur)).thenReturn(List.of(new Commande()));

        List<Commande> result = commandeService.getCommandesByAcheteur(acheteur);

        assertEquals(1, result.size());
        verify(commandeRepository).findByAcheteur(acheteur);
    }
}

