package com.petget.dto.auth;

/**
 * DTO para resposta de renovação de token.
 */
public class RefreshTokenResponse {
    
    private String accessToken;
    private String tokenType = "Bearer";
    private Long expiresIn;
    
    public RefreshTokenResponse() {}
    
    public RefreshTokenResponse(String accessToken, Long expiresIn) {
        this.accessToken = accessToken;
        this.expiresIn = expiresIn;
    }
    
    public String getAccessToken() {
        return accessToken;
    }
    
    public void setAccessToken(String accessToken) {
        this.accessToken = accessToken;
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
}