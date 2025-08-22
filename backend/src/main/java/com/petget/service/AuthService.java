package com.petget.service;

import com.petget.dto.auth.LoginRequest;
import com.petget.dto.auth.LoginResponse;
import com.petget.dto.auth.RefreshTokenRequest;
import com.petget.dto.auth.RefreshTokenResponse;
import com.petget.entity.Usuario;
import com.petget.repository.UsuarioRepository;
import com.petget.security.JwtUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

/**
 * Serviço responsável pela autenticação de usuários.
 * Gerencia login, logout e renovação de tokens JWT.
 */
@Service
public class AuthService {
    
    private static final Logger logger = LoggerFactory.getLogger(AuthService.class);
    
    @Autowired
    private AuthenticationManager authenticationManager;
    
    @Autowired
    private UsuarioRepository usuarioRepository;
    
    @Autowired
    private JwtUtil jwtUtil;
    
    @Value("${petget.jwt.expiration:86400000}") // 24 horas em millisegundos
    private long jwtExpirationMs;
    
    // Set para armazenar tokens invalidados (em produção, usar Redis)
    private final Set<String> blacklistedTokens = new HashSet<>();
    
    /**
     * Realiza o login do usuário
     * @param loginRequest Dados de login
     * @return Resposta com tokens e informações do usuário
     */
    @Transactional
    public LoginResponse login(LoginRequest loginRequest) {
        try {
            // Autentica o usuário
            Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                    loginRequest.getEmail(),
                    loginRequest.getSenha()
                )
            );
            
            // Busca o usuário no banco
            Usuario usuario = usuarioRepository.findByEmail(loginRequest.getEmail())
                .orElseThrow(() -> new UsernameNotFoundException(
                    "Usuário não encontrado: " + loginRequest.getEmail()));
            
            // Verifica se o usuário está ativo
            if (!usuario.getAtivo()) {
                throw new BadCredentialsException("Usuário inativo");
            }
            
            // Gera os tokens
            String accessToken = jwtUtil.generateToken(authentication, usuario.getTenantId());
            String refreshToken = jwtUtil.generateRefreshToken(usuario.getEmail(), usuario.getTenantId());
            
            // Atualiza o último login
            usuario.setUltimoLogin(LocalDateTime.now());
            usuarioRepository.save(usuario);
            
            // Cria as informações do usuário para a resposta
            LoginResponse.UserInfo userInfo = new LoginResponse.UserInfo(
                usuario.getId(),
                usuario.getNome(),
                usuario.getEmail(),
                usuario.getPerfil(),
                usuario.getTenantId(),
                usuario.getEmpresa() != null ? usuario.getEmpresa().getNome() : null,
                usuario.getUltimoLogin()
            );
            
            logger.info("Login realizado com sucesso para usuário: {} (tenant: {})", 
                       usuario.getEmail(), usuario.getTenantId());
            
            return new LoginResponse(accessToken, refreshToken, jwtExpirationMs / 1000, userInfo);
            
        } catch (AuthenticationException e) {
            logger.error("Falha na autenticação para usuário: {}", loginRequest.getEmail());
            throw new BadCredentialsException("Email ou senha inválidos");
        }
    }
    
    /**
     * Renova o token de acesso usando refresh token
     * @param refreshRequest Refresh token
     * @return Novo token de acesso
     */
    public RefreshTokenResponse refreshToken(RefreshTokenRequest refreshRequest) {
        String refreshToken = refreshRequest.getRefreshToken();
        
        // Valida o refresh token
        if (!jwtUtil.validateToken(refreshToken) || !jwtUtil.isRefreshToken(refreshToken)) {
            throw new BadCredentialsException("Refresh token inválido ou expirado");
        }
        
        // Verifica se o token não está na blacklist
        if (blacklistedTokens.contains(refreshToken)) {
            throw new BadCredentialsException("Refresh token foi invalidado");
        }
        
        // Extrai informações do refresh token
        String username = jwtUtil.getUsernameFromToken(refreshToken);
        String tenantId = jwtUtil.getTenantIdFromToken(refreshToken);
        
        // Verifica se o usuário ainda existe e está ativo
        Usuario usuario = usuarioRepository.findByEmailAndTenantId(username, tenantId)
            .orElseThrow(() -> new UsernameNotFoundException("Usuário não encontrado"));
        
        if (!usuario.getAtivo()) {
            throw new BadCredentialsException("Usuário inativo");
        }
        
        // Gera novo access token
        String newAccessToken = jwtUtil.generateTokenFromUsername(username, tenantId, false);
        
        logger.info("Token renovado para usuário: {} (tenant: {})", username, tenantId);
        
        return new RefreshTokenResponse(newAccessToken, jwtExpirationMs / 1000);
    }
    
    /**
     * Realiza o logout invalidando o token
     * @param authorization Header Authorization
     */
    public void logout(String authorization) {
        String token = extractTokenFromHeader(authorization);
        
        if (StringUtils.hasText(token)) {
            // Adiciona o token à blacklist
            blacklistedTokens.add(token);
            
            // Se for um access token, tenta extrair informações para log
            try {
                if (jwtUtil.validateToken(token) && !jwtUtil.isRefreshToken(token)) {
                    String username = jwtUtil.getUsernameFromToken(token);
                    String tenantId = jwtUtil.getTenantIdFromToken(token);
                    logger.info("Logout realizado para usuário: {} (tenant: {})", username, tenantId);
                }
            } catch (Exception e) {
                logger.debug("Erro ao extrair informações do token durante logout: {}", e.getMessage());
            }
        }
    }
    
    /**
     * Valida se o token é válido
     * @param authorization Header Authorization
     * @return true se válido
     */
    public boolean validateToken(String authorization) {
        String token = extractTokenFromHeader(authorization);
        
        if (!StringUtils.hasText(token)) {
            return false;
        }
        
        // Verifica se o token não está na blacklist
        if (blacklistedTokens.contains(token)) {
            return false;
        }
        
        return jwtUtil.validateToken(token);
    }
    
    /**
     * Extrai o token do header Authorization
     * @param authorization Header Authorization
     * @return Token JWT
     */
    private String extractTokenFromHeader(String authorization) {
        if (StringUtils.hasText(authorization) && authorization.startsWith("Bearer ")) {
            return authorization.substring(7);
        }
        return null;
    }
}