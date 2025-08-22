package com.petget.enums;

/**
 * Enum que define as espécies de pets suportadas pelo sistema.
 */
public enum EspeciePet {
    
    CACHORRO("Cachorro", "Canis lupus familiaris"),
    GATO("Gato", "Felis catus"),
    PASSARO("Pássaro", "Aves"),
    PEIXE("Peixe", "Pisces"),
    HAMSTER("Hamster", "Cricetinae"),
    COELHO("Coelho", "Oryctolagus cuniculus"),
    TARTARUGA("Tartaruga", "Testudines"),
    IGUANA("Iguana", "Iguana iguana"),
    CHINCHILA("Chinchila", "Chinchilla chinchilla"),
    FERRET("Ferret", "Mustela putorius furo"),
    OUTRO("Outro", "Outras espécies");
    
    private final String nome;
    private final String nomeCientifico;
    
    EspeciePet(String nome, String nomeCientifico) {
        this.nome = nome;
        this.nomeCientifico = nomeCientifico;
    }
    
    public String getNome() {
        return nome;
    }
    
    public String getNomeCientifico() {
        return nomeCientifico;
    }
    
    /**
     * Verifica se a espécie é um mamífero doméstico comum
     */
    public boolean isMamiferoComum() {
        return this == CACHORRO || this == GATO || this == HAMSTER || 
               this == COELHO || this == CHINCHILA || this == FERRET;
    }
    
    /**
     * Verifica se a espécie requer cuidados veterinários especializados
     */
    public boolean requerCuidadosEspecializados() {
        return this == PASSARO || this == PEIXE || this == TARTARUGA || 
               this == IGUANA || this == CHINCHILA || this == FERRET;
    }
}