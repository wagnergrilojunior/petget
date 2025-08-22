package com.petget.entity;

import com.petget.enums.EspeciePet;
import com.petget.enums.SexoPet;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;
import java.time.LocalDate;

/**
 * Entidade que representa um pet/animal no sistema.
 * Cada pet pertence a um cliente.
 */
@Entity
@Table(name = "pets")
public class Pet extends BaseEntity {

    @NotBlank(message = "Nome do pet é obrigatório")
    @Size(max = 50, message = "Nome do pet deve ter no máximo 50 caracteres")
    @Column(name = "nome", nullable = false, length = 50)
    private String nome;

    @NotNull(message = "Espécie é obrigatória")
    @Enumerated(EnumType.STRING)
    @Column(name = "especie", nullable = false)
    private EspeciePet especie;

    @Size(max = 50, message = "Raça deve ter no máximo 50 caracteres")
    @Column(name = "raca", length = 50)
    private String raca;

    @Enumerated(EnumType.STRING)
    @Column(name = "sexo")
    private SexoPet sexo;

    @Column(name = "data_nascimento")
    private LocalDate dataNascimento;

    @Positive(message = "Peso deve ser um valor positivo")
    @Column(name = "peso", precision = 5, scale = 2)
    private BigDecimal peso;

    @Size(max = 50, message = "Cor deve ter no máximo 50 caracteres")
    @Column(name = "cor", length = 50)
    private String cor;

    @Column(name = "foto_url")
    private String fotoUrl;

    @Column(name = "observacoes", columnDefinition = "TEXT")
    private String observacoes;

    @Column(name = "ativo", nullable = false)
    private Boolean ativo = true;

    @Column(name = "microchip", length = 20)
    private String microchip;

    @Column(name = "pedigree", length = 50)
    private String pedigree;

    // Relacionamento com Cliente
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cliente_id", nullable = false)
    private Cliente cliente;

    // Construtores
    public Pet() {
        super();
    }

    public Pet(String nome, EspeciePet especie, String tenantId) {
        super(tenantId);
        this.nome = nome;
        this.especie = especie;
    }

    // Métodos de conveniência
    public Integer getIdade() {
        if (dataNascimento == null) {
            return null;
        }
        return LocalDate.now().getYear() - dataNascimento.getYear();
    }

    public String getNomeCompleto() {
        return nome + (raca != null ? " (" + raca + ")" : "");
    }

    // Getters e Setters
    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public EspeciePet getEspecie() {
        return especie;
    }

    public void setEspecie(EspeciePet especie) {
        this.especie = especie;
    }

    public String getRaca() {
        return raca;
    }

    public void setRaca(String raca) {
        this.raca = raca;
    }

    public SexoPet getSexo() {
        return sexo;
    }

    public void setSexo(SexoPet sexo) {
        this.sexo = sexo;
    }

    public LocalDate getDataNascimento() {
        return dataNascimento;
    }

    public void setDataNascimento(LocalDate dataNascimento) {
        this.dataNascimento = dataNascimento;
    }

    public BigDecimal getPeso() {
        return peso;
    }

    public void setPeso(BigDecimal peso) {
        this.peso = peso;
    }

    public String getCor() {
        return cor;
    }

    public void setCor(String cor) {
        this.cor = cor;
    }

    public String getFotoUrl() {
        return fotoUrl;
    }

    public void setFotoUrl(String fotoUrl) {
        this.fotoUrl = fotoUrl;
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

    public String getMicrochip() {
        return microchip;
    }

    public void setMicrochip(String microchip) {
        this.microchip = microchip;
    }

    public String getPedigree() {
        return pedigree;
    }

    public void setPedigree(String pedigree) {
        this.pedigree = pedigree;
    }

    public Cliente getCliente() {
        return cliente;
    }

    public void setCliente(Cliente cliente) {
        this.cliente = cliente;
    }

    @Override
    public String toString() {
        return "Pet{" +
                "id=" + getId() +
                ", nome='" + nome + '\'' +
                ", especie=" + especie +
                ", raca='" + raca + '\'' +
                ", sexo=" + sexo +
                ", ativo=" + ativo +
                ", tenantId='" + getTenantId() + '\'' +
                '}';
    }
}