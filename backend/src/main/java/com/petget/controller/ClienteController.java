package com.petget.controller;

import com.petget.dto.ClienteRequest;
import com.petget.dto.ClienteResponse;
import com.petget.service.ClienteService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

/**
 * Controller responsável pelo gerenciamento de clientes.
 * Gerencia operações CRUD de clientes com suporte a multi-tenancy.
 */
@RestController
@RequestMapping("/clientes")
@Tag(name = "Clientes", description = "Endpoints para gerenciamento de clientes")
public class ClienteController {
    
    @Autowired
    private ClienteService clienteService;
    
    /**
     * Lista todos os clientes do tenant
     * @param pageable Configuração de paginação
     * @return Página de clientes
     */
    @GetMapping
    @Operation(summary = "Listar clientes", description = "Lista todos os clientes do tenant com paginação")
    @PreAuthorize("hasAuthority('PERM_CLIENTE_VIEW') or hasAuthority('PERM_CLIENTE_MANAGE')")
    public ResponseEntity<Page<ClienteResponse>> listarClientes(Pageable pageable) {
        Page<ClienteResponse> clientes = clienteService.listarClientes(pageable);
        return ResponseEntity.ok(clientes);
    }
    
    /**
     * Busca cliente por ID
     * @param id ID do cliente
     * @return Dados do cliente
     */
    @GetMapping("/{id}")
    @Operation(summary = "Buscar cliente por ID", description = "Retorna os dados de um cliente específico")
    @PreAuthorize("hasAuthority('PERM_CLIENTE_VIEW') or hasAuthority('PERM_CLIENTE_MANAGE')")
    public ResponseEntity<ClienteResponse> buscarClientePorId(@PathVariable Long id) {
        ClienteResponse cliente = clienteService.buscarPorId(id);
        return ResponseEntity.ok(cliente);
    }
    
    /**
     * Cria um novo cliente
     * @param clienteRequest Dados do cliente
     * @return Cliente criado
     */
    @PostMapping
    @Operation(summary = "Criar cliente", description = "Cria um novo cliente no sistema")
    @PreAuthorize("hasAuthority('PERM_CLIENTE_MANAGE')")
    public ResponseEntity<ClienteResponse> criarCliente(@Valid @RequestBody ClienteRequest clienteRequest) {
        ClienteResponse cliente = clienteService.criarCliente(clienteRequest);
        return ResponseEntity.status(HttpStatus.CREATED).body(cliente);
    }
    
    /**
     * Atualiza um cliente existente
     * @param id ID do cliente
     * @param clienteRequest Dados atualizados do cliente
     * @return Cliente atualizado
     */
    @PutMapping("/{id}")
    @Operation(summary = "Atualizar cliente", description = "Atualiza os dados de um cliente existente")
    @PreAuthorize("hasAuthority('PERM_CLIENTE_MANAGE')")
    public ResponseEntity<ClienteResponse> atualizarCliente(
            @PathVariable Long id, 
            @Valid @RequestBody ClienteRequest clienteRequest) {
        ClienteResponse cliente = clienteService.atualizarCliente(id, clienteRequest);
        return ResponseEntity.ok(cliente);
    }
    
    /**
     * Remove um cliente (soft delete)
     * @param id ID do cliente
     * @return Resposta vazia
     */
    @DeleteMapping("/{id}")
    @Operation(summary = "Remover cliente", description = "Remove um cliente do sistema (soft delete)")
    @PreAuthorize("hasAuthority('PERM_CLIENTE_MANAGE')")
    public ResponseEntity<Void> removerCliente(@PathVariable Long id) {
        clienteService.removerCliente(id);
        return ResponseEntity.noContent().build();
    }
    
    /**
     * Busca clientes por nome
     * @param nome Nome ou parte do nome
     * @param pageable Configuração de paginação
     * @return Página de clientes
     */
    @GetMapping("/buscar")
    @Operation(summary = "Buscar clientes por nome", description = "Busca clientes por nome ou parte do nome")
    @PreAuthorize("hasAuthority('PERM_CLIENTE_VIEW') or hasAuthority('PERM_CLIENTE_MANAGE')")
    public ResponseEntity<Page<ClienteResponse>> buscarClientesPorNome(
            @RequestParam String nome, 
            Pageable pageable) {
        Page<ClienteResponse> clientes = clienteService.buscarPorNome(nome, pageable);
        return ResponseEntity.ok(clientes);
    }
    
    /**
     * Busca cliente por CPF/CNPJ
     * @param cpfCnpj CPF ou CNPJ do cliente
     * @return Dados do cliente
     */
    @GetMapping("/cpf-cnpj/{cpfCnpj}")
    @Operation(summary = "Buscar cliente por CPF/CNPJ", description = "Busca cliente pelo CPF ou CNPJ")
    @PreAuthorize("hasAuthority('PERM_CLIENTE_VIEW') or hasAuthority('PERM_CLIENTE_MANAGE')")
    public ResponseEntity<ClienteResponse> buscarClientePorCpfCnpj(@PathVariable String cpfCnpj) {
        ClienteResponse cliente = clienteService.buscarPorCpfCnpj(cpfCnpj);
        return ResponseEntity.ok(cliente);
    }
    
    /**
     * Lista apenas clientes ativos
     * @param pageable Configuração de paginação
     * @return Página de clientes ativos
     */
    @GetMapping("/ativos")
    @Operation(summary = "Listar clientes ativos", description = "Lista apenas os clientes ativos do tenant")
    @PreAuthorize("hasAuthority('PERM_CLIENTE_VIEW') or hasAuthority('PERM_CLIENTE_MANAGE')")
    public ResponseEntity<Page<ClienteResponse>> listarClientesAtivos(Pageable pageable) {
        Page<ClienteResponse> clientes = clienteService.listarClientesAtivos(pageable);
        return ResponseEntity.ok(clientes);
    }
}