package com.gs.authentificationservice.Controller;

import com.gs.authentificationservice.Dto.LoginDto;
import com.gs.authentificationservice.Dto.UserDto;
import com.gs.authentificationservice.Service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class AuthController {

    private final AuthService authService;

    // ==== Enregistrement d’un nouvel utilisateur ====
    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody UserDto userDto) {
        boolean isRegistered = authService.register(userDto);
        if (isRegistered) {
            return ResponseEntity.ok(new ResponseMessage("User registered successfully"));
        } else {
            return ResponseEntity.badRequest().body(new ResponseMessage("User already exists"));
        }
    }

    // ==== Authentification utilisateur ====
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginDto loginDto) {
        Authentication authentication = authService.authenticate(loginDto);
        if (authentication == null) {
            return ResponseEntity.status(401).body(new ResponseMessage("Email ou mot de passe incorrect"));
        }

        String token = authService.generateToken(authentication);

        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        String email = userDetails.getUsername(); // ou getEmail() si tu l’as surchargé

        List<String> roles = userDetails.getAuthorities()
                .stream()
                .map(authority -> authority.getAuthority())
                .collect(Collectors.toList());

        LoginResponse jwtResponse = new LoginResponse(token, email, roles);
        return ResponseEntity.ok(jwtResponse);
    }

    // ==== Classes internes pour les réponses ====

    public static class ResponseMessage {
        private String message;

        public ResponseMessage(String message) {
            this.message = message;
        }

        public String getMessage() { return message; }

        public void setMessage(String message) { this.message = message; }
    }

    public static class LoginResponse {
        private String token;
        private String email;
        private List<String> roles;

        public LoginResponse(String token, String email, List<String> roles) {
            this.token = token;
            this.email = email;
            this.roles = roles;
        }

        public String getToken() { return token; }
        public void setToken(String token) { this.token = token; }

        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }

        public List<String> getRoles() { return roles; }
        public void setRoles(List<String> roles) { this.roles = roles; }
    }
}
