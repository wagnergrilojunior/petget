package com.petget.service;

import com.petget.config.TenantContext;
import com.petget.dto.ClienteRequest;
import com.petget.dto.ClienteResponse;
import com.petget.entity.Cliente;
import com.petget.exception.ConflictException;
import com.petget.exception.NotFoundException;
import com.petget.repository.ClienteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Optional;

/**
 * Serviço responsável pela lógica de negócio de clientes.
 * Implementa operações CRUD com suporte a multi-tenancy.
 */
@Service
@Transactional
public class ClienteService {
    
    @Autowired
    private ClienteRepository clienteRepository;
    
    /**
     * Lista todos os clientes com paginação
     * @param pageable Configuração de paginação
     * @return Página de clientes
     */
    @Transactional(readOnly = true)
    public Page<ClienteResponse> listarClientes(Pageable pageable) {
        String tenantId = TenantContext.getCurrentTenant();
        if (tenantId == null) {
            throw new IllegalStateException("Tenant não definido");
        }
        
        // Usando findAll() para deixar o filtro Hibernate fazer o trabalho
        Page<Cliente> clientes = clienteRepository.findAll(pageable);
        return clientes.map(this::convertToResponse);
    }
    
    /**
     * Busca cliente por ID
     * @param id ID do cliente
     * @return Cliente encontrado
     * @throws NotFoundException se não encontrado
     */
    @Transactional(readOnly = true)
    public ClienteResponse buscarPorId(Long id) {
        String tenantId = TenantContext.getCurrentTenant();
        if (tenantId == null) {
            throw new IllegalStateException("Tenant não definido");
        }
        
        Cliente cliente = clienteRepository.findByIdAndTenantId(id, tenantId)
            .orElseThrow(() -> new NotFoundException("Cliente não encontrado com ID: " + id));
        
        return convertToResponse(cliente);
    }
    
    /**
     * Cria um novo cliente
     * @param clienteRequest Dados do cliente
     * @return Cliente criado
     */
    public ClienteResponse criarCliente(ClienteRequest clienteRequest) {
        String tenantId = TenantContext.getCurrentTenant();
        if (tenantId == null) {
            throw new IllegalStateException("Tenant não definido");
        }
        
        // Verifica se já existe cliente com mesmo CPF/CNPJ
        if (clienteRequest.getCpfCnpj() != null && !clienteRequest.getCpfCnpj().trim().isEmpty()) {
            Optional<Cliente> existente = clienteRepository.findByCpfCnpjAndTenantId(
                clienteRequest.getCpfCnpj().trim(), tenantId);
            if (existente.isPresent()) {
                throw new ConflictException("Já existe um cliente com este CPF/CNPJ");
            }
        }
        
        // Verifica se já existe cliente com mesmo email
        if (clienteRequest.getEmail() != null && !clienteRequest.getEmail().trim().isEmpty()) {
            Optional<Cliente> existente = clienteRepository.findByEmailAndTenantId(
                clienteRequest.getEmail().trim(), tenantId);
            if (existente.isPresent()) {
                throw new ConflictException("Já existe um cliente com este email");
            }
        }
        
        Cliente cliente = convertToEntity(clienteRequest);
        cliente.setTenantId(tenantId);
        cliente.setCreatedAt(LocalDateTime.now());
        cliente.setUpdatedAt(LocalDateTime.now());
        
        Cliente clienteSalvo = clienteRepository.save(cliente);
        return convertToResponse(clienteSalvo);
    }
    
    /**
     * Atualiza um cliente existente
     * @param id ID do cliente
     * @param clienteRequest Dados atualizados
     * @return Cliente atualizado
     */
    public ClienteResponse atualizarCliente(Long id, ClienteRequest clienteRequest) {
        String tenantId = TenantContext.getCurrentTenant();
        if (tenantId == null) {
            throw new IllegalStateException("Tenant não definido");
        }
        
        Optional<Cliente> clienteExistente = clienteRepository.findByIdAndTenantId(id, tenantId);
        if (clienteExistente.isEmpty()) {
            throw new NotFoundException("Cliente não encontrado com ID: " + id);
        }
        
        Cliente cliente = clienteExistente.get();
        
        // Verifica conflitos de CPF/CNPJ
        if (clienteRequest.getCpfCnpj() != null && !clienteRequest.getCpfCnpj().trim().isEmpty()) {
            Optional<Cliente> existente = clienteRepository.findByCpfCnpjAndTenantId(
                clienteRequest.getCpfCnpj().trim(), tenantId);
            if (existente.isPresent() && !existente.get().getId().equals(id)) {
                throw new ConflictException("Já existe um cliente com este CPF/CNPJ");
            }
        }
        
        // Verifica conflitos de email
        if (clienteRequest.getEmail() != null && !clienteRequest.getEmail().trim().isEmpty()) {
            Optional<Cliente> existente = clienteRepository.findByEmailAndTenantId(
                clienteRequest.getEmail().trim(), tenantId);
            if (existente.isPresent() && !existente.get().getId().equals(id)) {
                throw new ConflictException("Já existe um cliente com este email");
            }
        }
        
        // Atualiza os campos
        updateEntityFromRequest(cliente, clienteRequest);
        cliente.setUpdatedAt(LocalDateTime.now());
        
        Cliente clienteAtualizado = clienteRepository.save(cliente);
        return convertToResponse(clienteAtualizado);
    }
    
    /**
     * Remove um cliente (soft delete)
     * @param id ID do cliente
     */
    public void removerCliente(Long id) {
        String tenantId = TenantContext.getCurrentTenant();
        if (tenantId == null) {
            throw new IllegalStateException("Tenant não definido");
        }
        
        Optional<Cliente> cliente = clienteRepository.findByIdAndTenantId(id, tenantId);
        if (cliente.isEmpty()) {
            throw new NotFoundException("Cliente não encontrado com ID: " + id);
        }
        
        Cliente clienteEntity = cliente.get();
        clienteEntity.setAtivo(false);
        clienteEntity.setUpdatedAt(LocalDateTime.now());
        clienteRepository.save(clienteEntity);
    }
    
    /**
     * Busca clientes por nome
     * @param nome Nome ou parte do nome
     * @param pageable Configuração de paginação
     * @return Página de clientes
     */
    @Transactional(readOnly = true)
    public Page<ClienteResponse> buscarPorNome(String nome, Pageable pageable) {
        String tenantId = TenantContext.getCurrentTenant();
        if (tenantId == null) {
            throw new IllegalStateException("Tenant não definido");
        }
        
        // Por enquanto, usar busca simples até implementar busca por nome
        Page<Cliente> clientes = clienteRepository.findByTenantId(tenantId, pageable);
        return clientes.map(this::convertToResponse);
    }
    
    /**
     * Busca cliente por CPF/CNPJ
     * @param cpfCnpj CPF ou CNPJ
     * @return Dados do cliente
     */
    @Transactional(readOnly = true)
    public ClienteResponse buscarPorCpfCnpj(String cpfCnpj) {
        String tenantId = TenantContext.getCurrentTenant();
        if (tenantId == null) {
            throw new IllegalStateException("Tenant não definido");
        }
        
        Optional<Cliente> cliente = clienteRepository.findByCpfCnpjAndTenantId(cpfCnpj, tenantId);
        if (cliente.isEmpty()) {
            throw new NotFoundException("Cliente não encontrado com CPF/CNPJ: " + cpfCnpj);
        }
        
        return convertToResponse(cliente.get());
    }
    
    /**
     * Lista apenas clientes ativos
     * @param pageable Configuração de paginação
     * @return Página de clientes ativos
     */
    @Transactional(readOnly = true)
    public Page<ClienteResponse> listarClientesAtivos(Pageable pageable) {
        String tenantId = TenantContext.getCurrentTenant();
        if (tenantId == null) {
            throw new IllegalStateException("Tenant não definido");
        }
        
        Page<Cliente> clientes = clienteRepository.findByAtivoTrueAndTenantId(tenantId, pageable);
        return clientes.map(this::convertToResponse);
    }
    
    /**
     * Converte entidade para DTO de resposta
     * @param cliente Entidade cliente
     * @return DTO de resposta
     */
    private ClienteResponse convertToResponse(Cliente cliente) {
        ClienteResponse response = new ClienteResponse();
        response.setId(cliente.getId());
        response.setNome(cliente.getNome());
        response.setCpfCnpj(cliente.getCpfCnpj());
        response.setEmail(cliente.getEmail());
        response.setTelefone(cliente.getTelefone());
        response.setCelular(cliente.getCelular());
        response.setEndereco(cliente.getEndereco());
        response.setBairro(cliente.getBairro());
        response.setCidade(cliente.getCidade());
        response.setEstado(cliente.getEstado());
        response.setCep(cliente.getCep());
        response.setObservacoes(cliente.getObservacoes());
        response.setAtivo(cliente.getAtivo());
        response.setTenantId(cliente.getTenantId());
        response.setCreatedAt(cliente.getCreatedAt());
        response.setUpdatedAt(cliente.getUpdatedAt());
        return response;
    }
    
    /**
     * Converte DTO de requisição para entidade
     * @param request DTO de requisição
     * @return Entidade cliente
     */
    private Cliente convertToEntity(ClienteRequest request) {
        Cliente cliente = new Cliente();
        updateEntityFromRequest(cliente, request);
        return cliente;
    }
    
    /**
     * Atualiza entidade com dados do DTO de requisição
     * @param cliente Entidade a ser atualizada
     * @param request DTO com novos dados
     */
    private void updateEntityFromRequest(Cliente cliente, ClienteRequest request) {
        cliente.setNome(request.getNome());
        cliente.setCpfCnpj(request.getCpfCnpj());
        cliente.setEmail(request.getEmail());
        cliente.setTelefone(request.getTelefone());
        cliente.setCelular(request.getCelular());
        cliente.setEndereco(request.getEndereco());
        cliente.setCidade(request.getCidade());
        cliente.setEstado(request.getEstado());
        cliente.setCep(request.getCep());
        cliente.setObservacoes(request.getObservacoes());
        if (request.getAtivo() != null) {
            cliente.setAtivo(request.getAtivo());
        }
    }
}