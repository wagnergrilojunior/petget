package com.petget.dto.auth;

import com.petget.enums.PerfilUsuario;

import java.time.LocalDateTime;

/**
 * DTO para resposta de login.
 */
public class LoginResponse {
    
    private String accessToken;
    private String refreshToken;
    private String tokenType = "Bearer";
    private Long expiresIn;
    private UserInfo user;
    
    public LoginResponse() {}
    
    public LoginResponse(String accessToken, String refreshToken, Long expiresIn, UserInfo user) {
        this.accessToken = accessToken;
        this.refreshToken = refreshToken;
        this.expiresIn = expiresIn;
        this.user = user;
    }
    
    public String getAccessToken() {
        return accessToken;
    }
    
    public void setAccessToken(String accessToken) {
        this.accessToken = accessToken;
    }
    
    public String getRefreshToken() {
        return refreshToken;
    }
    
    public void setRefreshToken(String refreshToken) {
        this.refreshToken = refreshToken;
    }
    
    public String getTokenType() {
        return tokenType;
    }
    
    public void setTokenType(String tokenType) {
        this.tokenType = tokenType;
    }
    
    public Long getExpiresIn() {
        return expiresIn;
    }
    
    public void setExpiresIn(Long expiresIn) {
        this.expiresIn = expiresIn;
    }
    
    public UserInfo getUser() {
        return user;
    }
    
    public void setUser(UserInfo user) {
        this.user = user;
    }
    
    /**
     * Classe interna para informações do usuário
     */
    public static class UserInfo {
        private Long id;
        private String nome;
        private String email;
        private PerfilUsuario perfil;
        private String tenantId;
        private String empresaNome;
        private LocalDateTime ultimoLogin;
        
        public UserInfo() {}
        
        public UserInfo(Long id, String nome, String email, PerfilUsuario perfil, 
                       String tenantId, String empresaNome, LocalDateTime ultimoLogin) {
            this.id = id;
            this.nome = nome;
            this.email = email;
            this.perfil = perfil;
            this.tenantId = tenantId;
            this.empresaNome = empresaNome;
            this.ultimoLogin = ultimoLogin;
        }
        
        public Long getId() {
            return id;
        }
        
        public void setId(Long id) {
            this.id = id;
        }
        
        public String getNome() {
            return nome;
        }
        
        public void setNome(String nome) {
            this.nome = nome;
        }
        
        public String getEmail() {
            return email;
        }
        
        public void setEmail(String email) {
            this.email = email;
        }
        
        public PerfilUsuario getPerfil() {
            return perfil;
        }
        
        public void setPerfil(PerfilUsuario perfil) {
            this.perfil = perfil;
        }
        
        public String getTenantId() {
            return tenantId;
        }
        
        public void setTenantId(String tenantId) {
            this.tenantId = tenantId;
        }
        
        public String getEmpresaNome() {
            return empresaNome;
        }
        
        public void setEmpresaNome(String empresaNome) {
            this.empresaNome = empresaNome;
        }
        
        public LocalDateTime getUltimoLogin() {
            return ultimoLogin;
        }
        
        public void setUltimoLogin(LocalDateTime ultimoLogin) {
            this.ultimoLogin = ultimoLogin;
        }
    }
}