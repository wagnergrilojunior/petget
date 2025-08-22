package com.petget.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

/**
 * Utilitário para operações com JWT (JSON Web Token).
 * Responsável por gerar, validar e extrair informações dos tokens.
 */
@Component
public class JwtUtil {
    
    private static final Logger logger = LoggerFactory.getLogger(JwtUtil.class);
    
    @Value("${petget.jwt.secret:petget-secret-key-very-long-and-secure-for-production-use-only}")
    private String jwtSecret;
    
    @Value("${petget.jwt.expiration:86400000}") // 24 horas em millisegundos
    private long jwtExpirationMs;
    
    @Value("${petget.jwt.refresh-expiration:604800000}") // 7 dias em millisegundos
    private long jwtRefreshExpirationMs;
    
    /**
     * Gera a chave secreta para assinatura do JWT
     */
    private SecretKey getSigningKey() {
        return Keys.hmacShaKeyFor(jwtSecret.getBytes());
    }
    
    /**
     * Gera um token JWT para o usuário autenticado
     * @param authentication Dados de autenticação
     * @param tenantId ID do tenant
     * @return Token JWT
     */
    public String generateToken(Authentication authentication, String tenantId) {
        UserDetails userPrincipal = (UserDetails) authentication.getPrincipal();
        return generateTokenFromUsername(userPrincipal.getUsername(), tenantId, false);
    }
    
    /**
     * Gera um token JWT a partir do username
     * @param username Nome do usuário
     * @param tenantId ID do tenant
     * @param isRefreshToken Se é um refresh token
     * @return Token JWT
     */
    public String generateTokenFromUsername(String username, String tenantId, boolean isRefreshToken) {
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + (isRefreshToken ? jwtRefreshExpirationMs : jwtExpirationMs));
        
        Map<String, Object> claims = new HashMap<>();
        claims.put("tenantId", tenantId);
        claims.put("type", isRefreshToken ? "refresh" : "access");
        
        return Jwts.builder()
                .setClaims(claims)
                .setSubject(username)
                .setIssuedAt(now)
                .setExpiration(expiryDate)
                .signWith(getSigningKey())
                .compact();
    }
    
    /**
     * Gera um refresh token
     * @param username Nome do usuário
     * @param tenantId ID do tenant
     * @return Refresh token
     */
    public String generateRefreshToken(String username, String tenantId) {
        return generateTokenFromUsername(username, tenantId, true);
    }
    
    /**
     * Extrai o username do token
     * @param token Token JWT
     * @return Username
     */
    public String getUsernameFromToken(String token) {
        return getClaimFromToken(token, Claims::getSubject);
    }
    
    /**
     * Extrai o tenant ID do token
     * @param token Token JWT
     * @return Tenant ID
     */
    public String getTenantIdFromToken(String token) {
        return getClaimFromToken(token, claims -> claims.get("tenantId", String.class));
    }
    
    /**
     * Extrai a data de expiração do token
     * @param token Token JWT
     * @return Data de expiração
     */
    public Date getExpirationDateFromToken(String token) {
        return getClaimFromToken(token, Claims::getExpiration);
    }
    
    /**
     * Verifica se é um refresh token
     * @param token Token JWT
     * @return true se for refresh token
     */
    public boolean isRefreshToken(String token) {
        String type = getClaimFromToken(token, claims -> claims.get("type", String.class));
        return "refresh".equals(type);
    }
    
    /**
     * Extrai um claim específico do token
     * @param token Token JWT
     * @param claimsResolver Função para extrair o claim
     * @return Valor do claim
     */
    public <T> T getClaimFromToken(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = getAllClaimsFromToken(token);
        return claimsResolver.apply(claims);
    }
    
    /**
     * Extrai todos os claims do token
     * @param token Token JWT
     * @return Claims do token
     */
    private Claims getAllClaimsFromToken(String token) {
        return Jwts.parser()
                .verifyWith(getSigningKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }
    
    /**
     * Verifica se o token está expirado
     * @param token Token JWT
     * @return true se expirado
     */
    public boolean isTokenExpired(String token) {
        final Date expiration = getExpirationDateFromToken(token);
        return expiration.before(new Date());
    }
    
    /**
     * Valida o token JWT
     * @param token Token JWT
     * @return true se válido
     */
    public boolean validateToken(String token) {
        try {
            Jwts.parser()
                .verifyWith(getSigningKey())
                .build()
                .parseSignedClaims(token);
            return true;
        } catch (MalformedJwtException e) {
            logger.error("Token JWT malformado: {}", e.getMessage());
        } catch (ExpiredJwtException e) {
            logger.error("Token JWT expirado: {}", e.getMessage());
        } catch (UnsupportedJwtException e) {
            logger.error("Token JWT não suportado: {}", e.getMessage());
        } catch (IllegalArgumentException e) {
            logger.error("JWT claims string está vazia: {}", e.getMessage());
        } catch (Exception e) {
            logger.error("Erro na validação do token JWT: {}", e.getMessage());
        }
        return false;
    }
    
    /**
     * Valida o token JWT com username
     * @param token Token JWT
     * @param userDetails Detalhes do usuário
     * @return true se válido
     */
    public boolean validateToken(String token, UserDetails userDetails) {
        final String username = getUsernameFromToken(token);
        return (username.equals(userDetails.getUsername()) && !isTokenExpired(token));
    }
}