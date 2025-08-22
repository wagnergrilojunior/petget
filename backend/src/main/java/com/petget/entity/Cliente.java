package com.petget.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import java.util.ArrayList;
import java.util.List;

/**
 * Entidade que representa um cliente da clínica/pet shop.
 * Um cliente pode ter múltiplos pets associados.
 */
@Entity
@Table(name = "clientes")
public class Cliente extends BaseEntity {

    @NotBlank(message = "Nome é obrigatório")
    @Size(max = 100, message = "Nome deve ter no máximo 100 caracteres")
    @Column(name = "nome", nullable = false, length = 100)
    private String nome;

    @Size(max = 18, message = "CPF/CNPJ deve ter no máximo 18 caracteres")
    @Column(name = "cpf_cnpj", length = 18)
    private String cpfCnpj;

    @Email(message = "E-mail deve ser válido")
    @Size(max = 100, message = "E-mail deve ter no máximo 100 caracteres")
    @Column(name = "email", length = 100)
    private String email;

    @Size(max = 20, message = "Telefone deve ter no máximo 20 caracteres")
    @Column(name = "telefone", length = 20)
    private String telefone;

    @Size(max = 20, message = "Celular deve ter no máximo 20 caracteres")
    @Column(name = "celular", length = 20)
    private String celular;

    @Size(max = 100, message = "Endereço deve ter no máximo 100 caracteres")
    @Column(name = "endereco", length = 100)
    private String endereco;

    @Size(max = 50, message = "Bairro deve ter no máximo 50 caracteres")
    @Column(name = "bairro", length = 50)
    private String bairro;

    @Size(max = 50, message = "Cidade deve ter no máximo 50 caracteres")
    @Column(name = "cidade", length = 50)
    private String cidade;

    @Size(max = 2, message = "Estado deve ter no máximo 2 caracteres")
    @Column(name = "estado", length = 2)
    private String estado;

    @Size(max = 10, message = "CEP deve ter no máximo 10 caracteres")
    @Column(name = "cep", length = 10)
    private String cep;

    @Column(name = "observacoes", columnDefinition = "TEXT")
    private String observacoes;

    @Column(name = "ativo", nullable = false)
    private Boolean ativo = true;

    // Relacionamento com Pets
    @OneToMany(mappedBy = "cliente", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Pet> pets = new ArrayList<>();

    // Construtores
    public Cliente() {
        super();
    }

    public Cliente(String nome, String tenantId) {
        super(tenantId);
        this.nome = nome;
    }

    // Métodos de conveniência
    public void adicionarPet(Pet pet) {
        pets.add(pet);
        pet.setCliente(this);
    }

    public void removerPet(Pet pet) {
        pets.remove(pet);
        pet.setCliente(null);
    }

    // Getters e Setters
    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public String getCpfCnpj() {
        return cpfCnpj;
    }

    public void setCpfCnpj(String cpfCnpj) {
        this.cpfCnpj = cpfCnpj;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getTelefone() {
        return telefone;
    }

    public void setTelefone(String telefone) {
        this.telefone = telefone;
    }

    public String getCelular() {
        return celular;
    }

    public void setCelular(String celular) {
        this.celular = celular;
    }

    public String getEndereco() {
        return endereco;
    }

    public void setEndereco(String endereco) {
        this.endereco = endereco;
    }

    public String getBairro() {
        return bairro;
    }

    public void setBairro(String bairro) {
        this.bairro = bairro;
    }

    public String getCidade() {
        return cidade;
    }

    public void setCidade(String cidade) {
        this.cidade = cidade;
    }

    public String getEstado() {
        return estado;
    }

    public void setEstado(String estado) {
        this.estado = estado;
    }

    public String getCep() {
        return cep;
    }

    public void setCep(String cep) {
        this.cep = cep;
    }

    public String getObservacoes() {
        return observacoes;
    }

    public void setObservacoes(String observacoes) {
        this.observacoes = observacoes;
    }

    public Boolean getAtivo() {
        return ativo;
    }

    public void setAtivo(Boolean ativo) {
        this.ativo = ativo;
    }

    public List<Pet> getPets() {
        return pets;
    }

    public void setPets(List<Pet> pets) {
        this.pets = pets;
    }

    @Override
    public String toString() {
        return "Cliente{" +
                "id=" + getId() +
                ", nome='" + nome + '\'' +
                ", email='" + email + '\'' +
                ", telefone='" + telefone + '\'' +
                ", ativo=" + ativo +
                ", tenantId='" + getTenantId() + '\'' +
                '}';
    }
}