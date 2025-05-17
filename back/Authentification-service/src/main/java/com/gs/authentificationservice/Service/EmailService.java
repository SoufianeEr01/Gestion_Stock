package com.gs.authentificationservice.Service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;


@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    public void sendEmail(String to, String subject, String text) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom("faddanilarbi@gmail.com"); // l'expéditeur
        message.setTo(to); // le destinataire
        message.setSubject(subject);
        message.setText(text);
        mailSender.send(message);
    }
}

