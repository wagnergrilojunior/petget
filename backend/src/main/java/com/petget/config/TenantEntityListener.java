package com.petget.config;

import com.petget.entity.BaseEntity;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * Listener JPA para aplicar automaticamente o tenant ID nas entidades.
 * Garante que todas as entidades sejam salvas com o tenant correto.
 */
public class TenantEntityListener {
    
    private static final Logger logger = LoggerFactory.getLogger(TenantEntityListener.class);
    
    /**
     * Executado antes de persistir uma nova entidade.
     * Define o tenant ID automaticamente se não estiver definido.
     */
    @PrePersist
    public void setTenantOnPersist(BaseEntity entity) {
        String currentTenant = TenantContext.getCurrentTenant();
        
        if (currentTenant != null) {
            if (entity.getTenantId() == null) {
                entity.setTenantId(currentTenant);
                logger.debug("Tenant ID definido automaticamente: {} para entidade: {}", 
                           currentTenant, entity.getClass().getSimpleName());
            } else if (!currentTenant.equals(entity.getTenantId())) {
                logger.warn("Tentativa de salvar entidade com tenant diferente do contexto. " +
                          "Contexto: {}, Entidade: {}", currentTenant, entity.getTenantId());
                throw new SecurityException("Não é permitido salvar entidade de outro tenant");
            }
        } else {
            logger.warn("Nenhum tenant definido no contexto ao persistir entidade: {}", 
                       entity.getClass().getSimpleName());
        }
    }
    
    /**
     * Executado antes de atualizar uma entidade.
     * Valida se o tenant ID não foi alterado.
     */
    @PreUpdate
    public void validateTenantOnUpdate(BaseEntity entity) {
        String currentTenant = TenantContext.getCurrentTenant();
        
        if (currentTenant != null && entity.getTenantId() != null) {
            if (!currentTenant.equals(entity.getTenantId())) {
                logger.error("Tentativa de atualizar entidade de outro tenant. " +
                           "Contexto: {}, Entidade: {}", currentTenant, entity.getTenantId());
                throw new SecurityException("Não é permitido atualizar entidade de outro tenant");
            }
        }
    }
}