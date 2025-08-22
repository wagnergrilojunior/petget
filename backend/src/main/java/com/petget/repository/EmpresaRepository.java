package com.petget.repository;

import com.petget.entity.Empresa;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * Repositório para operações com a entidade Empresa.
 * Inclui métodos específicos para busca e validação.
 */
@Repository
public interface EmpresaRepository extends BaseRepository<Empresa> {
    
    /**
     * Busca empresa por CNPJ
     * @param cnpj CNPJ da empresa
     * @return Optional da empresa
     */
    @Query("SELECT e FROM Empresa e WHERE e.cnpj = :cnpj")
    Optional<Empresa> findByCnpj(@Param("cnpj") String cnpj);
    
    /**
     * Busca empresa por tenant ID
     * @param tenantId ID do tenant
     * @return Optional da empresa
     */
    @Query("SELECT e FROM Empresa e WHERE e.tenantId = :tenantId")
    Optional<Empresa> findByTenantId(@Param("tenantId") String tenantId);
    
    /**
     * Busca empresa por razão social (case insensitive)
     * @param razaoSocial Razão social da empresa
     * @return Optional da empresa
     */
    // Temporariamente comentado para debug
    // @Query("SELECT e FROM Empresa e WHERE LOWER(e.razaoSocial) = LOWER(:razaoSocial)")
    // Optional<Empresa> findByRazaoSocialIgnoreCase(@Param("razaoSocial") String razaoSocial);
    
    /**
     * Busca empresa por nome fantasia (case insensitive)
     * @param nomeFantasia Nome fantasia da empresa
     * @return Optional da empresa
     */
    // Temporariamente comentado para debug
    // @Query("SELECT e FROM Empresa e WHERE LOWER(e.nomeFantasia) = LOWER(:nomeFantasia)")
    // Optional<Empresa> findByNomeFantasiaIgnoreCase(@Param("nomeFantasia") String nomeFantasia);
    
    /**
     * Busca empresa por email
     * @param email Email da empresa
     * @return Optional da empresa
     */
    @Query("SELECT e FROM Empresa e WHERE e.email = :email")
    Optional<Empresa> findByEmail(@Param("email") String email);
    
    /**
     * Verifica se existe empresa com o CNPJ
     * @param cnpj CNPJ da empresa
     * @return true se existe
     */
    @Query("SELECT COUNT(e) > 0 FROM Empresa e WHERE e.cnpj = :cnpj")
    boolean existsByCnpj(@Param("cnpj") String cnpj);
    
    /**
     * Verifica se existe empresa com o email
     * @param email Email da empresa
     * @return true se existe
     */
    @Query("SELECT COUNT(e) > 0 FROM Empresa e WHERE e.email = :email")
    boolean existsByEmail(@Param("email") String email);
    
    /**
     * Verifica se existe empresa ativa com o CNPJ
     * @param cnpj CNPJ da empresa
     * @return true se existe
     */
    @Query("SELECT COUNT(e) > 0 FROM Empresa e WHERE e.cnpj = :cnpj AND e.ativo = true")
    boolean existsByCnpjAndAtivoTrue(@Param("cnpj") String cnpj);
    
    /**
     * Conta empresas ativas
     * @return Número de empresas ativas
     */
    @Query("SELECT COUNT(e) FROM Empresa e WHERE e.ativo = true")
    long countByAtivoTrue();
}