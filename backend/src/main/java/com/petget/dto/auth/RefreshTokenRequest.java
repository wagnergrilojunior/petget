package com.petget.dto.auth;

import jakarta.validation.constraints.NotBlank;

/**
 * DTO para requisição de renovação de token.
 */
public class RefreshTokenRequest {
    
    @NotBlank(message = "Refresh token é obrigatório")
    private String refreshToken;
    
    public RefreshTokenRequest() {}
    
    public RefreshTokenRequest(String refreshToken) {
        this.refreshToken = refreshToken;
    }
    
    public String getRefreshToken() {
        return refreshToken;
    }
    
    public void setRefreshToken(String refreshToken) {
        this.refreshToken = refreshToken;
    }
}