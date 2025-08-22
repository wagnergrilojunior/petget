package com.petget.repository;

import com.petget.entity.Usuario;
import com.petget.enums.PerfilUsuario;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Repositório para operações com a entidade Usuario.
 * Inclui métodos específicos para busca e autenticação.
 */
@Repository
public interface UsuarioRepository extends BaseRepository<Usuario> {
    
    /**
     * Busca usuário por email (usado para login)
     * @param email Email do usuário
     * @return Optional do usuário
     */
    @Query("SELECT u FROM Usuario u WHERE u.email = :email")
    Optional<Usuario> findByEmail(@Param("email") String email);
    
    /**
     * Busca usuário por email e tenant
     * @param email Email do usuário
     * @param tenantId ID do tenant
     * @return Optional do usuário
     */
    @Query("SELECT u FROM Usuario u WHERE u.email = :email AND u.tenantId = :tenantId")
    Optional<Usuario> findByEmailAndTenantId(
        @Param("email") String email, 
        @Param("tenantId") String tenantId
    );
    
    /**
     * Busca usuários por nome (case insensitive)
     * @param nome Nome ou parte do nome
     * @param tenantId ID do tenant
     * @param pageable Configuração de paginação
     * @return Página de usuários
     */
    // Temporariamente comentado para debug
    // @Query("SELECT u FROM Usuario u WHERE u.tenantId = :tenantId AND " +
    //        "LOWER(u.nome) LIKE LOWER(CONCAT('%', :nome, '%'))")
    // Page<Usuario> findByNomeContainingIgnoreCaseAndTenantId(
    //     @Param("nome") String nome, 
    //     @Param("tenantId") Long tenantId, 
    //     Pageable pageable
    // );
    
    /**
     * Busca usuários por perfil
     * @param perfil Perfil do usuário
     * @param tenantId ID do tenant
     * @return Lista de usuários
     */
    @Query("SELECT u FROM Usuario u WHERE u.tenantId = :tenantId AND u.perfil = :perfil")
    List<Usuario> findByPerfilAndTenantId(
        @Param("perfil") PerfilUsuario perfil, 
        @Param("tenantId") String tenantId
    );
    
    /**
     * Busca usuários ativos
     * @param tenantId ID do tenant
     * @param pageable Configuração de paginação
     * @return Página de usuários ativos
     */
    @Query("SELECT u FROM Usuario u WHERE u.tenantId = :tenantId AND u.ativo = true")
    Page<Usuario> findByAtivoTrueAndTenantId(
        @Param("tenantId") String tenantId, 
        Pageable pageable
    );
    
    /**
     * Verifica se existe usuário com o email no tenant
     * @param email Email do usuário
     * @param tenantId ID do tenant
     * @return true se existe
     */
    @Query("SELECT COUNT(u) > 0 FROM Usuario u WHERE u.email = :email AND u.tenantId = :tenantId")
    boolean existsByEmailAndTenantId(
        @Param("email") String email, 
        @Param("tenantId") String tenantId
    );
    
    /**
     * Verifica se existe usuário com o email (global)
     * @param email Email do usuário
     * @return true se existe
     */
    @Query("SELECT COUNT(u) > 0 FROM Usuario u WHERE u.email = :email")
    boolean existsByEmail(@Param("email") String email);
    
    /**
     * Busca administradores do tenant
     * @param tenantId ID do tenant
     * @return Lista de administradores
     */
    @Query("SELECT u FROM Usuario u WHERE u.tenantId = :tenantId AND " +
           "u.perfil = 'ADMIN_EMPRESA' AND u.ativo = true")
    List<Usuario> findAdministradoresByTenantId(@Param("tenantId") String tenantId);
    
    /**
     * Conta usuários ativos por perfil
     * @param perfil Perfil do usuário
     * @param tenantId ID do tenant
     * @return Número de usuários
     */
    @Query("SELECT COUNT(u) FROM Usuario u WHERE u.tenantId = :tenantId AND " +
           "u.perfil = :perfil AND u.ativo = true")
    long countByPerfilAndAtivoTrueAndTenantId(
        @Param("perfil") PerfilUsuario perfil, 
        @Param("tenantId") String tenantId
    );
    
    /**
     * Conta usuários ativos
     * @param tenantId ID do tenant
     * @return Número de usuários ativos
     */
    @Query("SELECT COUNT(u) FROM Usuario u WHERE u.tenantId = :tenantId AND u.ativo = true")
    long countByAtivoTrueAndTenantId(@Param("tenantId") String tenantId);
}