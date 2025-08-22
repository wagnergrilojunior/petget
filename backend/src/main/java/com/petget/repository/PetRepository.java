package com.petget.repository;

import com.petget.entity.Pet;
import com.petget.enums.EspeciePet;
import com.petget.enums.SexoPet;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

/**
 * Repositório para operações com a entidade Pet.
 * Inclui métodos específicos para busca e filtros.
 */
@Repository
public interface PetRepository extends BaseRepository<Pet> {
    
    /**
     * Busca pets por nome (case insensitive)
     * @param nome Nome ou parte do nome
     * @param tenantId ID do tenant
     * @param pageable Configuração de paginação
     * @return Página de pets
     */
    // Temporariamente comentado para debug
    // @Query("SELECT p FROM Pet p WHERE p.tenantId = :tenantId AND " +
    //        "LOWER(p.nome) LIKE LOWER(CONCAT('%', :nome, '%'))")
    // Page<Pet> findByNomeContainingIgnoreCaseAndTenantId(
    //     @Param("nome") String nome, 
    //     @Param("tenantId") Long tenantId, 
    //     Pageable pageable
    // );
    
    /**
     * Busca pets por cliente
     * @param clienteId ID do cliente
     * @param tenantId ID do tenant
     * @return Lista de pets do cliente
     */
    @Query("SELECT p FROM Pet p WHERE p.tenantId = :tenantId AND p.cliente.id = :clienteId")
    List<Pet> findByClienteIdAndTenantId(
        @Param("clienteId") Long clienteId, 
        @Param("tenantId") String tenantId
    );
    
    /**
     * Busca pets por espécie
     * @param especie Espécie do pet
     * @param tenantId ID do tenant
     * @param pageable Configuração de paginação
     * @return Página de pets
     */
    @Query("SELECT p FROM Pet p WHERE p.tenantId = :tenantId AND p.especie = :especie")
    Page<Pet> findByEspecieAndTenantId(
        @Param("especie") EspeciePet especie, 
        @Param("tenantId") String tenantId, 
        Pageable pageable
    );
    
    /**
     * Busca pets por raça
     * @param raca Raça do pet
     * @param tenantId ID do tenant
     * @return Lista de pets
     */
    // Temporariamente comentado para debug
    // @Query("SELECT p FROM Pet p WHERE p.tenantId = :tenantId AND " +
    //        "LOWER(p.raca) LIKE LOWER(CONCAT('%', :raca, '%'))")
    // List<Pet> findByRacaContainingIgnoreCaseAndTenantId(
    //     @Param("raca") String raca, 
    //     @Param("tenantId") Long tenantId
    // );
    
    /**
     * Busca pets por sexo
     * @param sexo Sexo do pet
     * @param tenantId ID do tenant
     * @return Lista de pets
     */
    @Query("SELECT p FROM Pet p WHERE p.tenantId = :tenantId AND p.sexo = :sexo")
    List<Pet> findBySexoAndTenantId(
        @Param("sexo") SexoPet sexo, 
        @Param("tenantId") String tenantId
    );
    
    /**
     * Busca pets ativos
     * @param tenantId ID do tenant
     * @param pageable Configuração de paginação
     * @return Página de pets ativos
     */
    @Query("SELECT p FROM Pet p WHERE p.tenantId = :tenantId AND p.ativo = true")
    Page<Pet> findByAtivoTrueAndTenantId(
        @Param("tenantId") String tenantId, 
        Pageable pageable
    );
    
    /**
     * Busca pets com aniversário no mês
     * @param mes Mês (1-12)
     * @param tenantId ID do tenant
     * @return Lista de pets
     */
    // Temporariamente comentado para debug
    // // @Query("SELECT p FROM Pet p WHERE p.tenantId = :tenantId AND " +
    //        "EXTRACT(MONTH FROM p.dataNascimento) = :mes AND p.ativo = true")
    // List<Pet> findPetsByMesAniversarioAndTenantId(
    //     @Param("mes") int mes, 
    //     @Param("tenantId") String tenantId
    // );
    
    /**
     * Busca pets nascidos após uma data
     * @param data Data de referência
     * @param tenantId ID do tenant
     * @return Lista de pets
     */
    @Query("SELECT p FROM Pet p WHERE p.tenantId = :tenantId AND " +
           "p.dataNascimento >= :data")
    List<Pet> findByDataNascimentoAfterAndTenantId(
        @Param("data") LocalDate data, 
        @Param("tenantId") String tenantId
    );
    
    /**
     * Conta pets por espécie
     * @param especie Espécie do pet
     * @param tenantId ID do tenant
     * @return Número de pets da espécie
     */
    @Query("SELECT COUNT(p) FROM Pet p WHERE p.tenantId = :tenantId AND p.especie = :especie")
    long countByEspecieAndTenantId(
        @Param("especie") EspeciePet especie, 
        @Param("tenantId") String tenantId
    );
    
    /**
     * Conta pets ativos
     * @param tenantId ID do tenant
     * @return Número de pets ativos
     */
    @Query("SELECT COUNT(p) FROM Pet p WHERE p.tenantId = :tenantId AND p.ativo = true")
    long countByAtivoTrueAndTenantId(@Param("tenantId") String tenantId);
}