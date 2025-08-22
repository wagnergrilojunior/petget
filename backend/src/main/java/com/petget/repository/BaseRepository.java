package com.petget.repository;

import com.petget.entity.BaseEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.NoRepositoryBean;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

/**
 * Repositório base com métodos específicos para multi-tenancy.
 * Todos os repositórios devem estender esta interface.
 */
@NoRepositoryBean
public interface BaseRepository<T extends BaseEntity> extends JpaRepository<T, Long> {
    
    /**
     * Busca uma entidade por ID e tenant ID
     * @param id ID da entidade
     * @param tenantId ID do tenant
     * @return Optional da entidade
     */
    // @Query("SELECT e FROM #{#entityName} e WHERE e.id = :id AND e.tenantId = :tenantId")
    // Optional<T> findByIdAndTenantId(@Param("id") Long id, @Param("tenantId") String tenantId);
    
    /**
     * Busca todas as entidades do tenant
     * @param tenantId ID do tenant
     * @return Lista de entidades
     */
    // @Query("SELECT e FROM #{#entityName} e WHERE e.tenantId = :tenantId")
    // List<T> findAllByTenantId(@Param("tenantId") String tenantId);
    
    /**
     * Conta o número de entidades do tenant
     * @param tenantId ID do tenant
     * @return Número de entidades
     */
    // @Query("SELECT COUNT(e) FROM #{#entityName} e WHERE e.tenantId = :tenantId")
    // long countByTenantId(@Param("tenantId") String tenantId);
    
    /**
     * Verifica se existe uma entidade com o ID no tenant
     * @param id ID da entidade
     * @param tenantId ID do tenant
     * @return true se existe
     */
    // @Query("SELECT COUNT(e) > 0 FROM #{#entityName} e WHERE e.id = :id AND e.tenantId = :tenantId")
    // boolean existsByIdAndTenantId(@Param("id") Long id, @Param("tenantId") String tenantId);
}