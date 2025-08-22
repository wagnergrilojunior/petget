package com.petget.repository;

import com.petget.entity.Cliente;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Repositório para operações com a entidade Cliente.
 * Inclui métodos específicos para busca e filtros.
 */
@Repository
public interface ClienteRepository extends BaseRepository<Cliente> {
    
    /**
     * Busca uma entidade por ID e tenant ID
     * @param id ID da entidade
     * @param tenantId ID do tenant
     * @return Optional da entidade
     */
    @Query("SELECT c FROM Cliente c WHERE c.id = :id AND c.tenantId = :tenantId")
    Optional<Cliente> findByIdAndTenantId(@Param("id") Long id, @Param("tenantId") String tenantId);
    
    /**
     * Busca todas as entidades do tenant com paginação
     * @param tenantId ID do tenant
     * @param pageable Configuração de paginação
     * @return Página de entidades
     */
    @Query("SELECT c FROM Cliente c WHERE c.tenantId = :tenantId")
    Page<Cliente> findByTenantId(@Param("tenantId") String tenantId, Pageable pageable);
    
    /**
     * Busca clientes por nome (case insensitive)
     * @param nome Nome ou parte do nome
     * @param tenantId ID do tenant
     * @param pageable Configuração de paginação
     * @return Página de clientes
     */
    // Temporariamente comentado para debug
    // @Query("SELECT c FROM Cliente c WHERE c.tenantId = :tenantId AND " +
    //        "LOWER(c.nome) LIKE LOWER(CONCAT('%', :nome, '%'))")
    // Page<Cliente> findByNomeContainingIgnoreCaseAndTenantId(
    //     @Param("nome") String nome, 
    //     @Param("tenantId") Long tenantId, 
    //     Pageable pageable
    // );
    
    /**
     * Busca cliente por CPF/CNPJ
     * @param cpfCnpj CPF ou CNPJ
     * @param tenantId ID do tenant
     * @return Optional do cliente
     */
    @Query("SELECT c FROM Cliente c WHERE c.tenantId = :tenantId AND c.cpfCnpj = :cpfCnpj")
    Optional<Cliente> findByCpfCnpjAndTenantId(
        @Param("cpfCnpj") String cpfCnpj, 
        @Param("tenantId") String tenantId
    );
    
    /**
     * Busca cliente por email
     * @param email Email do cliente
     * @param tenantId ID do tenant
     * @return Optional do cliente
     */
    @Query("SELECT c FROM Cliente c WHERE c.tenantId = :tenantId AND c.email = :email")
    Optional<Cliente> findByEmailAndTenantId(
        @Param("email") String email, 
        @Param("tenantId") String tenantId
    );
    
    /**
     * Busca clientes ativos
     * @param tenantId ID do tenant
     * @param pageable Configuração de paginação
     * @return Página de clientes ativos
     */
    @Query("SELECT c FROM Cliente c WHERE c.tenantId = :tenantId AND c.ativo = true")
    Page<Cliente> findByAtivoTrueAndTenantId(
        @Param("tenantId") String tenantId, 
        Pageable pageable
    );
    
    /**
     * Busca clientes por cidade
     * @param cidade Nome da cidade
     * @param tenantId ID do tenant
     * @return Lista de clientes
     */
    // Temporariamente comentado para debug
    // @Query("SELECT c FROM Cliente c WHERE c.tenantId = :tenantId AND " +
    //        "LOWER(c.cidade) = LOWER(:cidade)")
    // List<Cliente> findByCidadeIgnoreCaseAndTenantId(
    //     @Param("cidade") String cidade, 
    //     @Param("tenantId") Long tenantId
    // );
    
    /**
     * Conta clientes ativos
     * @param tenantId ID do tenant
     * @return Número de clientes ativos
     */
    @Query("SELECT COUNT(c) FROM Cliente c WHERE c.tenantId = :tenantId AND c.ativo = true")
    long countByAtivoTrueAndTenantId(@Param("tenantId") String tenantId);
}