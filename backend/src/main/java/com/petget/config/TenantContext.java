package com.petget.config;

/**
 * Classe para gerenciar o contexto do tenant atual na thread.
 * Utiliza ThreadLocal para isolar o tenantId por thread de execução.
 */
public class TenantContext {
    
    private static final ThreadLocal<String> currentTenant = new ThreadLocal<>();
    
    /**
     * Define o tenant atual para a thread
     * @param tenantId ID do tenant
     */
    public static void setCurrentTenant(String tenantId) {
        currentTenant.set(tenantId);
    }
    
    /**
     * Obtém o tenant atual da thread
     * @return ID do tenant atual ou null se não definido
     */
    public static String getCurrentTenant() {
        return currentTenant.get();
    }
    
    /**
     * Remove o tenant da thread atual
     */
    public static void clear() {
        currentTenant.remove();
    }
    
    /**
     * Verifica se existe um tenant definido na thread atual
     * @return true se existe tenant, false caso contrário
     */
    public static boolean hasTenant() {
        return currentTenant.get() != null;
    }
}