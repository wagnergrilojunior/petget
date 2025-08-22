package com.petget.enums;

/**
 * Enum que define os perfis de usuário no sistema.
 * Cada perfil tem permissões específicas para diferentes funcionalidades.
 */
public enum PerfilUsuario {
    
    /**
     * Administrador da empresa - acesso total ao sistema
     */
    ADMIN_EMPRESA("Administrador da Empresa", "Acesso total ao sistema da empresa"),
    
    /**
     * Veterinário - acesso a consultas, prontuários e agenda
     */
    VETERINARIO("Veterinário", "Acesso a consultas, prontuários e agenda"),
    
    /**
     * Atendente - acesso a clientes, pets, agenda e vendas
     */
    ATENDENTE("Atendente", "Acesso a clientes, pets, agenda e vendas"),
    
    /**
     * Financeiro - acesso ao módulo financeiro e relatórios
     */
    FINANCEIRO("Financeiro", "Acesso ao módulo financeiro e relatórios"),
    
    /**
     * Usuário básico - acesso limitado
     */
    USUARIO("Usuário", "Acesso básico ao sistema");
    
    private final String nome;
    private final String descricao;
    
    PerfilUsuario(String nome, String descricao) {
        this.nome = nome;
        this.descricao = descricao;
    }
    
    public String getNome() {
        return nome;
    }
    
    public String getDescricao() {
        return descricao;
    }
    
    /**
     * Verifica se o perfil tem permissão de administrador
     */
    public boolean isAdmin() {
        return this == ADMIN_EMPRESA;
    }
    
    /**
     * Verifica se o perfil pode acessar o módulo financeiro
     */
    public boolean podeAcessarFinanceiro() {
        return this == ADMIN_EMPRESA || this == FINANCEIRO;
    }
    
    /**
     * Verifica se o perfil pode gerenciar usuários
     */
    public boolean podeGerenciarUsuarios() {
        return this == ADMIN_EMPRESA;
    }
    
    /**
     * Verifica se o perfil pode acessar prontuários
     */
    public boolean podeAcessarProntuarios() {
        return this == ADMIN_EMPRESA || this == VETERINARIO;
    }
}