package com.petget.controller;

import com.petget.dto.auth.LoginRequest;
import com.petget.dto.auth.LoginResponse;
import com.petget.dto.auth.RefreshTokenRequest;
import com.petget.dto.auth.RefreshTokenResponse;
import com.petget.service.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * Controller responsável pela autenticação de usuários.
 * Gerencia login, logout e refresh de tokens JWT.
 */
@RestController
@RequestMapping("/auth")
@Tag(name = "Autenticação", description = "Endpoints para autenticação de usuários")
public class AuthController {
    
    @Autowired
    private AuthService authService;
    
    /**
     * Realiza o login do usuário
     * @param loginRequest Dados de login (email e senha)
     * @return Token JWT e informações do usuário
     */
    @PostMapping("/login")
    @Operation(summary = "Login do usuário", description = "Autentica o usuário e retorna token JWT")
    public ResponseEntity<LoginResponse> login(@Valid @RequestBody LoginRequest loginRequest) {
        LoginResponse response = authService.login(loginRequest);
        return ResponseEntity.ok(response);
    }
    
    /**
     * Renova o token de acesso usando refresh token
     * @param refreshRequest Refresh token
     * @return Novo token de acesso
     */
    @PostMapping("/refresh")
    @Operation(summary = "Renovar token", description = "Renova o token de acesso usando refresh token")
    public ResponseEntity<RefreshTokenResponse> refreshToken(@Valid @RequestBody RefreshTokenRequest refreshRequest) {
        RefreshTokenResponse response = authService.refreshToken(refreshRequest);
        return ResponseEntity.ok(response);
    }
    
    /**
     * Realiza o logout do usuário
     * @param authorization Header Authorization com o token
     * @return Confirmação de logout
     */
    @PostMapping("/logout")
    @Operation(summary = "Logout do usuário", description = "Invalida o token do usuário")
    public ResponseEntity<String> logout(@RequestHeader("Authorization") String authorization) {
        authService.logout(authorization);
        return ResponseEntity.ok("Logout realizado com sucesso");
    }
    
    /**
     * Verifica se o token é válido
     * @param authorization Header Authorization com o token
     * @return Status da validação
     */
    @GetMapping("/validate")
    @Operation(summary = "Validar token", description = "Verifica se o token JWT é válido")
    public ResponseEntity<String> validateToken(@RequestHeader("Authorization") String authorization) {
        boolean isValid = authService.validateToken(authorization);
        if (isValid) {
            return ResponseEntity.ok("Token válido");
        } else {
            return ResponseEntity.badRequest().body("Token inválido");
        }
    }
}