package com.petget.security;

import com.petget.entity.Usuario;
import com.petget.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

/**
 * Serviço customizado para carregar detalhes do usuário durante a autenticação.
 * Implementa a interface UserDetailsService do Spring Security.
 */
@Service
public class CustomUserDetailsService implements UserDetailsService {
    
    @Autowired
    private UsuarioRepository usuarioRepository;
    
    @Override
    @Transactional(readOnly = true)
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        // Busca o usuário pelo email (sem filtro de tenant para permitir login)
        Usuario usuario = usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException(
                    "Usuário não encontrado com email: " + email));
        
        // Verifica se o usuário está ativo
        if (!usuario.getAtivo()) {
            throw new UsernameNotFoundException("Usuário inativo: " + email);
        }
        
        return createUserDetails(usuario);
    }
    
    /**
     * Carrega usuário por email e tenant (usado em contextos específicos)
     * @param email Email do usuário
     * @param tenantId ID do tenant
     * @return UserDetails
     * @throws UsernameNotFoundException se usuário não encontrado
     */
    @Transactional(readOnly = true)
    public UserDetails loadUserByUsernameAndTenant(String email, String tenantId) throws UsernameNotFoundException {
        Usuario usuario = usuarioRepository.findByEmailAndTenantId(email, tenantId)
                .orElseThrow(() -> new UsernameNotFoundException(
                    "Usuário não encontrado com email: " + email + " para tenant: " + tenantId));
        
        if (!usuario.getAtivo()) {
            throw new UsernameNotFoundException("Usuário inativo: " + email);
        }
        
        return createUserDetails(usuario);
    }
    
    /**
     * Cria um objeto UserDetails a partir da entidade Usuario
     * @param usuario Entidade Usuario
     * @return UserDetails
     */
    private UserDetails createUserDetails(Usuario usuario) {
        Collection<GrantedAuthority> authorities = getAuthorities(usuario);
        
        return User.builder()
                .username(usuario.getEmail())
                .password(usuario.getSenha())
                .authorities(authorities)
                .accountExpired(false)
                .accountLocked(false)
                .credentialsExpired(false)
                .disabled(!usuario.getAtivo())
                .build();
    }
    
    /**
     * Converte o perfil do usuário em authorities do Spring Security
     * @param usuario Entidade Usuario
     * @return Collection de GrantedAuthority
     */
    private Collection<GrantedAuthority> getAuthorities(Usuario usuario) {
        List<GrantedAuthority> authorities = new ArrayList<>();
        
        // Adiciona o perfil como authority
        if (usuario.getPerfil() != null) {
            authorities.add(new SimpleGrantedAuthority("ROLE_" + usuario.getPerfil().name()));
        }
        
        // Adiciona permissões específicas baseadas no perfil
        switch (usuario.getPerfil()) {
            case ADMIN_EMPRESA:
                authorities.add(new SimpleGrantedAuthority("PERM_ADMIN_ALL"));
                authorities.add(new SimpleGrantedAuthority("PERM_USER_MANAGE"));
                authorities.add(new SimpleGrantedAuthority("PERM_EMPRESA_MANAGE"));
                authorities.add(new SimpleGrantedAuthority("PERM_CLIENTE_MANAGE"));
                authorities.add(new SimpleGrantedAuthority("PERM_PET_MANAGE"));
                authorities.add(new SimpleGrantedAuthority("PERM_AGENDA_MANAGE"));
                authorities.add(new SimpleGrantedAuthority("PERM_FINANCEIRO_MANAGE"));
                authorities.add(new SimpleGrantedAuthority("PERM_PRODUTO_MANAGE"));
                authorities.add(new SimpleGrantedAuthority("PERM_RELATORIO_VIEW"));
                break;
            case VETERINARIO:
                authorities.add(new SimpleGrantedAuthority("PERM_CLIENTE_MANAGE"));
                authorities.add(new SimpleGrantedAuthority("PERM_PET_MANAGE"));
                authorities.add(new SimpleGrantedAuthority("PERM_AGENDA_MANAGE"));
                authorities.add(new SimpleGrantedAuthority("PERM_CONSULTA_MANAGE"));
                authorities.add(new SimpleGrantedAuthority("PERM_PRONTUARIO_MANAGE"));
                break;
            case ATENDENTE:
                authorities.add(new SimpleGrantedAuthority("PERM_CLIENTE_MANAGE"));
                authorities.add(new SimpleGrantedAuthority("PERM_PET_MANAGE"));
                authorities.add(new SimpleGrantedAuthority("PERM_AGENDA_MANAGE"));
                authorities.add(new SimpleGrantedAuthority("PERM_PRODUTO_MANAGE"));
                authorities.add(new SimpleGrantedAuthority("PERM_VENDA_MANAGE"));
                break;
            case FINANCEIRO:
                authorities.add(new SimpleGrantedAuthority("PERM_FINANCEIRO_MANAGE"));
                authorities.add(new SimpleGrantedAuthority("PERM_RELATORIO_VIEW"));
                authorities.add(new SimpleGrantedAuthority("PERM_CLIENTE_VIEW"));
                break;
            case USUARIO:
            default:
                authorities.add(new SimpleGrantedAuthority("PERM_BASIC_ACCESS"));
                break;
        }
        
        return authorities;
    }
}