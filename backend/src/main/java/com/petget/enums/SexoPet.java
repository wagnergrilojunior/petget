package com.petget.enums;

/**
 * Enum que define o sexo dos pets.
 */
public enum SexoPet {
    
    MACHO("Macho", "M"),
    FEMEA("Fêmea", "F"),
    INDEFINIDO("Indefinido", "I");
    
    private final String nome;
    private final String sigla;
    
    SexoPet(String nome, String sigla) {
        this.nome = nome;
        this.sigla = sigla;
    }
    
    public String getNome() {
        return nome;
    }
    
    public String getSigla() {
        return sigla;
    }
    
    /**
     * Busca o sexo pela sigla
     */
    public static SexoPet porSigla(String sigla) {
        for (SexoPet sexo : values()) {
            if (sexo.getSigla().equalsIgnoreCase(sigla)) {
                return sexo;
            }
        }
        return INDEFINIDO;
    }
}