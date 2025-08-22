package com.petget.config;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

/**
 * Interceptor para capturar e definir o tenant ID a partir do header da requisição.
 * O tenant ID é extraído do header 'X-Tenant-ID' e armazenado no TenantContext.
 */
@Component
public class TenantInterceptor implements HandlerInterceptor {
    
    private static final Logger logger = LoggerFactory.getLogger(TenantInterceptor.class);
    private static final String TENANT_HEADER = "X-Tenant-ID";
    
    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) {
        String tenantId = request.getHeader(TENANT_HEADER);
        
        if (tenantId != null && !tenantId.trim().isEmpty()) {
            TenantContext.setCurrentTenant(tenantId.trim());
            logger.debug("Tenant ID definido: {}", tenantId);
        } else {
            // Para endpoints públicos (login, health check, etc.), não é obrigatório ter tenant
            String requestURI = request.getRequestURI();
            if (!isPublicEndpoint(requestURI)) {
                logger.warn("Tenant ID não fornecido para endpoint protegido: {}", requestURI);
            }
        }
        
        return true;
    }
    
    @Override
    public void afterCompletion(HttpServletRequest request, HttpServletResponse response, 
                              Object handler, Exception ex) {
        // Limpa o contexto do tenant após a conclusão da requisição
        TenantContext.clear();
    }
    
    /**
     * Verifica se o endpoint é público e não requer tenant ID
     * @param requestURI URI da requisição
     * @return true se for endpoint público
     */
    private boolean isPublicEndpoint(String requestURI) {
        return requestURI.startsWith("/api/auth/") ||
               requestURI.startsWith("/api/public/") ||
               requestURI.equals("/api/health") ||
               requestURI.startsWith("/actuator/") ||
               requestURI.startsWith("/swagger-ui/") ||
               requestURI.startsWith("/v3/api-docs");
    }
}