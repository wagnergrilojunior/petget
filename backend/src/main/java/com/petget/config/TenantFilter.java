package com.petget.config;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import org.hibernate.Filter;
import org.hibernate.Session;
import org.springframework.stereotype.Component;

/**
 * Componente responsável por aplicar filtros de tenant nas consultas JPA.
 * Utiliza filtros do Hibernate para isolar dados por tenant automaticamente.
 */
@Component
public class TenantFilter {
    
    @PersistenceContext
    private EntityManager entityManager;
    
    /**
     * Aplica o filtro de tenant para a sessão atual
     */
    public void applyTenantFilter() {
        String tenantId = TenantContext.getCurrentTenant();
        
        if (tenantId != null) {
            Session session = entityManager.unwrap(Session.class);
            Filter filter = session.enableFilter("tenantFilter");
            filter.setParameter("tenantId", tenantId);
            System.out.println("[DEBUG] Filtro de tenant aplicado: " + tenantId);
        } else {
            System.out.println("[DEBUG] Nenhum tenant no contexto para aplicar filtro");
        }
    }
    
    /**
     * Remove o filtro de tenant da sessão atual
     */
    public void removeTenantFilter() {
        Session session = entityManager.unwrap(Session.class);
        session.disableFilter("tenantFilter");
    }
}