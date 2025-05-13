package com.example.gestion_commandes.service;

import com.example.gestion_commandes.model.BonAchat;
import com.itextpdf.text.*;
import com.itextpdf.text.pdf.PdfWriter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.InputStreamSource;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import jakarta.mail.internet.MimeMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import java.io.ByteArrayOutputStream;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    public void envoyerBonAchatParEmail(BonAchat bon) {
        try {
            // 1. Générer le PDF
            ByteArrayOutputStream pdfOutputStream = new ByteArrayOutputStream();
            Document document = new Document();
            PdfWriter.getInstance(document, pdfOutputStream);
            document.open();
            document.add(new Paragraph("Bon d'Achat"));
            document.add(new Paragraph("Produit: " + bon.getNomProduit()));
            document.add(new Paragraph("Quantité: " + bon.getQuantite()));
            document.add(new Paragraph("Prix Unitaire: " + bon.getPrixUnitaire()));
            document.add(new Paragraph("Statut: " + bon.getStatut()));
            document.add(new Paragraph("Date: " + bon.getDateCreation()));
            document.add(new Paragraph("Fournisseur: " + bon.getNomFournisseur()));
            document.close();

            // 2. Créer l’e-mail
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true);
            helper.setTo(bon.getEmailFournisseur());
            helper.setSubject("Bon d'Achat Approuvé");
            helper.setText("Bonjour,\n\nVeuillez trouver en pièce jointe le bon d'achat approuvé.\n\nCordialement.");

            // 3. Ajouter le PDF comme pièce jointe
            InputStreamSource attachment = new ByteArrayResource(pdfOutputStream.toByteArray());
            helper.addAttachment("BonAchat_" + bon.getId() + ".pdf", attachment);

            // 4. Envoyer
            mailSender.send(message);
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Échec de l'envoi de l'e-mail : " + e.getMessage());
        }
    }
}
