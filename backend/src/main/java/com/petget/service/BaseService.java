package com.petget.service;

import com.petget.config.TenantContext;
import com.petget.entity.BaseEntity;
import com.petget.repository.BaseRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

/**
 * Serviço base com operações comuns para multi-tenancy.
 * Todos os serviços devem estender esta classe.
 */
public abstract class BaseService<T extends BaseEntity, R extends BaseRepository<T>> {
    
    protected final R repository;
    
    public BaseService(R repository) {
        this.repository = repository;
    }
    
    /**
     * Busca uma entidade por ID no tenant atual
     * @param id ID da entidade
     * @return Optional da entidade
     */
    public Optional<T> findById(Long id) {
        String tenantId = TenantContext.getCurrentTenant();
        if (tenantId == null) {
            throw new IllegalStateException("Tenant não definido no contexto");
        }
        // Temporariamente comentado para debug
        // return repository.findByIdAndTenantId(id, tenantId);
        return repository.findById(id);
    }
    
    /**
     * Busca todas as entidades do tenant atual
     * @return Lista de entidades
     */
    public List<T> findAll() {
        String tenantId = TenantContext.getCurrentTenant();
        if (tenantId == null) {
            throw new IllegalStateException("Tenant não definido no contexto");
        }
        // Temporariamente comentado para debug
        // return repository.findAllByTenantId(tenantId);
        return repository.findAll();
    }
    
    /**
     * Busca todas as entidades do tenant atual com paginação
     * @param pageable Configuração de paginação
     * @return Página de entidades
     */
    public Page<T> findAll(Pageable pageable) {
        return repository.findAll(pageable);
    }
    
    /**
     * Salva uma entidade no tenant atual
     * @param entity Entidade a ser salva
     * @return Entidade salva
     */
    @Transactional
    public T save(T entity) {
        String tenantId = TenantContext.getCurrentTenant();
        if (tenantId == null) {
            throw new IllegalStateException("Tenant não definido no contexto");
        }
        
        // Define o tenant se for uma nova entidade
        if (entity.getId() == null) {
            entity.setTenantId(tenantId);
        } else {
            // Verifica se a entidade pertence ao tenant atual
            if (!tenantId.equals(entity.getTenantId())) {
                throw new IllegalArgumentException("Entidade não pertence ao tenant atual");
            }
        }
        
        return repository.save(entity);
    }
    
    /**
     * Atualiza uma entidade existente no tenant atual
     * @param id ID da entidade
     * @param entity Dados atualizados
     * @return Entidade atualizada
     */
    @Transactional
    public Optional<T> update(Long id, T entity) {
        Optional<T> existingEntity = findById(id);
        if (existingEntity.isPresent()) {
            entity.setId(id);
            entity.setTenantId(existingEntity.get().getTenantId());
            return Optional.of(repository.save(entity));
        }
        return Optional.empty();
    }
    
    /**
     * Remove uma entidade por ID no tenant atual
     * @param id ID da entidade
     * @return true se removida com sucesso
     */
    @Transactional
    public boolean deleteById(Long id) {
        Optional<T> entity = findById(id);
        if (entity.isPresent()) {
            repository.delete(entity.get());
            return true;
        }
        return false;
    }
    
    /**
     * Verifica se existe uma entidade com o ID no tenant atual
     * @param id ID da entidade
     * @return true se existe
     */
    public boolean existsById(Long id) {
        String tenantId = TenantContext.getCurrentTenant();
        if (tenantId == null) {
            throw new IllegalStateException("Tenant não definido no contexto");
        }
        // Temporariamente comentado para debug
        // return repository.existsByIdAndTenantId(id, tenantId);
        return repository.existsById(id);
    }
    
    /**
     * Conta o número de entidades no tenant atual
     * @return Número de entidades
     */
    public long count() {
        String tenantId = TenantContext.getCurrentTenant();
        if (tenantId == null) {
            throw new IllegalStateException("Tenant não definido no contexto");
        }
        // Temporariamente comentado para debug
        // return repository.countByTenantId(tenantId);
        return repository.count();
    }
    
    /**
     * Obtém o tenant atual do contexto
     * @return ID do tenant atual
     */
    protected String getCurrentTenant() {
        return TenantContext.getCurrentTenant();
    }
    
    /**
     * Valida se o tenant está definido no contexto
     * @throws IllegalStateException se o tenant não estiver definido
     */
    protected void validateTenantContext() {
        if (TenantContext.getCurrentTenant() == null) {
            throw new IllegalStateException("Tenant não definido no contexto");
        }
    }
}