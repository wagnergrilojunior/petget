package com.petget.controller;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.transaction.Transactional;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Controller temporário para testes e limpeza de dados
 */
@RestController
@RequestMapping("/api/test")
public class TestController {
    
    @PersistenceContext
    private EntityManager entityManager;
    
    /**
     * Limpa dados de teste usando query nativa para ignorar filtros
     */
    @DeleteMapping("/cleanup")
    @Transactional
    public ResponseEntity<String> cleanup() {
        // Remove todos os clientes usando query nativa (ignora filtros)
        int deletedCount = entityManager.createNativeQuery("DELETE FROM clientes")
                .executeUpdate();
        return ResponseEntity.ok("Removidos " + deletedCount + " clientes");
    }
}