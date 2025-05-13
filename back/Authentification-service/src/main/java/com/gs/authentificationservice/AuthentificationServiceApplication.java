package com.gs.authentificationservice;

import com.gs.authentificationservice.Repository.UserRepository;
import com.gs.authentificationservice.model.User;
import com.gs.authentificationservice.TypeRole;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.password.PasswordEncoder;

@SpringBootApplication
public class AuthentificationServiceApplication {

    public static void main(String[] args) {
        SpringApplication.run(AuthentificationServiceApplication.class, args);
    }

    @Bean
    public CommandLineRunner createAdmin(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        return args -> {
            if (userRepository.count() == 0) {
                User admin = new User();
                admin.setUsername("admin");
                admin.setEmail("admin@example.com");
                admin.setPassword(passwordEncoder.encode("admin123")); // mot de passe sécurisé recommandé
                admin.setRole(TypeRole.ADMIN);
                userRepository.save(admin);
                System.out.println("🛠️ Admin créé : admin@gmail.com / admin123");
            }
        };
    }
}
