package com.gs.authentificationservice.Service;

import com.gs.authentificationservice.Dto.LoginDto;
import com.gs.authentificationservice.Dto.UserDto;
import com.gs.authentificationservice.Repository.UserRepository;
import com.gs.authentificationservice.model.User;
import com.gs.authentificationservice.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final AuthenticationManager authenticationManager;

    /**
     * Enregistre un nouvel utilisateur si son username n'existe pas déjà.
     */
    public boolean register(UserDto userDto) {
        if (userRepository.existsByUsername(userDto.getUsername())) {
            return false;
        }

        User user = new User();
        user.setUsername(userDto.getUsername());
        user.setPassword(passwordEncoder.encode(userDto.getPassword()));
        user.setEmail(userDto.getEmail());
        user.setRole(userDto.getRole());
        user.setEnabled(true); // Par défaut activé
        userRepository.save(user);

        log.info("Utilisateur enregistré : {}", user.getUsername());
        return true;
    }

    /**
     * Authentifie un utilisateur et retourne l’objet Authentication s’il est valide.
     */
    public Authentication authenticate(LoginDto loginDto) {
        try {
            Optional<User> optionalUser  = userRepository.findByEmail(loginDto.getEmail());
            if (optionalUser == null || !optionalUser.get().isEnabled()) {
                log.warn("Compte désactivé ou utilisateur inexistant : {}", loginDto.getEmail());
                return null;
            }

            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            loginDto.getEmail(),
                            loginDto.getPassword()
                    )
            );
            log.info("Authentification réussie pour {}", loginDto.getEmail());
            return authentication;

        } catch (BadCredentialsException e) {
            log.warn("Identifiants incorrects pour {}: {}", loginDto.getEmail(), e.getMessage());
            return null;
        } catch (Exception e) {
            log.error("Erreur inattendue pour {}: {}", loginDto.getEmail(), e.getMessage());
            return null;
        }
    }

    /**
     * Génère un token JWT à partir d’un objet Authentication.
     */
    public String generateToken(Authentication authentication) {
        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        String role = userDetails.getAuthorities().stream().findFirst().map(Object::toString).orElse("ROLE_USER");

        return jwtUtil.generateToken(userDetails.getUsername(), role);
    }

    /**
     * Active ou désactive un utilisateur à partir de son ID.
     */
    public boolean toggleUserStatus(Long userId, boolean enabled) {
        Optional<User> userOptional = userRepository.findById(userId);
        if (userOptional.isPresent()) {
            User user = userOptional.get();
            user.setEnabled(enabled);
            userRepository.save(user);
            log.info("Statut de l'utilisateur {} mis à jour : {}", user.getUsername(), enabled ? "activé" : "désactivé");
            return true;
        } else {
            log.warn("Utilisateur avec ID {} introuvable", userId);
            return false;
        }
    }

    /**
     * Récupère la liste de tous les utilisateurs sous forme de UserDto.
     */
    public List<UserDto> getAllUsers() {
        return userRepository.findAll().stream().map(user -> {
            UserDto dto = new UserDto();
            dto.setId(user.getId());
            dto.setUsername(user.getUsername());
            dto.setEmail(user.getEmail());
            dto.setRole(user.getRole());
            dto.setEnabled(user.isEnabled());
            return dto;
        }).collect(Collectors.toList());
    }
}
