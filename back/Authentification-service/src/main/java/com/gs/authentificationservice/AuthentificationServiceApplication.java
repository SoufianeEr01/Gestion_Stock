package com.gs.authentificationservice;

import com.gs.authentificationservice.Repository.UserRepository;
import com.gs.authentificationservice.Service.EmailService;
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
    public CommandLineRunner createAdmin(UserRepository userRepository, PasswordEncoder passwordEncoder, EmailService emailService) {
        return args -> {
            if (userRepository.count() == 0) {
                // Création de l'utilisateur admin
                User admin = new User();
                admin.setUsername("admin");
                admin.setEmail("admin@gmail.com");
                String rawPassword = "admin123";
                admin.setPassword(passwordEncoder.encode(rawPassword));
                admin.setRole(TypeRole.ADMIN);
                userRepository.save(admin);

                // Email à l'admin
                String subjectAdmin = "Création du compte admin";
                String contentAdmin = String.format("""
                        Bonjour Admin,

                        Votre compte admin a été créé avec succès.

                        Identifiant : %s
                        Mot de passe : %s

                        Cordialement,
                        L'équipe de support.
                        """, admin.getEmail(), rawPassword);
                emailService.sendEmail(admin.getEmail(), subjectAdmin, contentAdmin);
                System.out.println("✅ Email envoyé à l'admin : " + admin.getEmail());

                // Email à Soufiane avec les identifiants
                String subjectSoufiane = "Création du compte admin (copie à Soufiane)";
                String contentSoufiane = String.format("""
                        Bonjour Soufiane,

                        Le compte admin a été créé avec les identifiants suivants :

                        Identifiant : %s
                        Mot de passe : %s

                        Bien cordialement,
                        Larbi Faddani
                        """, admin.getEmail(), rawPassword);

                emailService.sendEmail("soufianeerr23@gmail.com", subjectSoufiane, contentSoufiane);
                System.out.println("📨 Email envoyé à soufianeerr23@gmail.com !");
            }
        };
    }
}
