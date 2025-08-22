package com.petget.config;

import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Before;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

/**
 * Aspecto AOP para aplicar automaticamente o filtro de tenant
 * em operações de repositório.
 */
@Aspect
@Component
public class TenantAspect {
    
    @Autowired
    private TenantFilter tenantFilter;
    
    /**
     * Aplica o filtro de tenant antes de executar qualquer método de repositório
     */
    @Before("execution(* com.petget.repository.*.*(..))")
    public void applyTenantFilter() {
        tenantFilter.applyTenantFilter();
    }
}