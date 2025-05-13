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

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final AuthenticationManager authenticationManager;

    public boolean register(UserDto userDto) {
        if (userRepository.existsByUsername(userDto.getUsername())) {
            return false;
        }

        User user = new User();
        user.setUsername(userDto.getUsername());
        user.setPassword(passwordEncoder.encode(userDto.getPassword()));
        user.setEmail(userDto.getEmail());
        user.setRole(userDto.getRole());
        userRepository.save(user);

        log.info("User registered: {}", user.getUsername());
        return true;
    }

    /**
     * Authentifie un utilisateur et retourne l’objet Authentication s’il est valide.
     */
    public Authentication authenticate(LoginDto loginDto) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            loginDto.getEmail(),
                            loginDto.getPassword()
                    )
            );
            log.info("Authentication successful for {}", loginDto.getEmail());
            return authentication;
        } catch (BadCredentialsException e) {
            log.warn("Bad credentials for {}: {}", loginDto.getEmail(), e.getMessage());
            return null;
        } catch (Exception e) {
            log.error("Unexpected error during authentication for {}: {}", loginDto.getEmail(), e.getMessage());
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
}
