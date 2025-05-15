package com.example.gestion_commandes.messaging;

import com.example.gestion_commandes.Dto.AlerteDTO;
import com.example.gestion_commandes.Dto.FournisseurDTO;
import com.example.gestion_commandes.model.BonAchat;
import com.example.gestion_commandes.repository.BonAchatRepository;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.MediaType;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import java.util.List;

import java.time.LocalDate;
import java.util.Map;

@Component
public class StockAlertConsumer {

    @Autowired
    private BonAchatRepository bonAchatRepository;

    @RabbitListener(queues = "stock.alert")
    public void recevoirAlerte(Map<String, Object> alerteMap) {
        System.out.println("Alerte reçue : " + alerteMap);

        try {
            AlerteDTO alerte = new AlerteDTO();

            // Extraction des données de l'alerte
            if (alerteMap.get("typeAlerte") != null) {
                alerte.setTypeAlerte((String) alerteMap.get("typeAlerte"));
            }
            if (alerteMap.get("produitId") != null) {
                alerte.setProduitId(Integer.parseInt(alerteMap.get("produitId").toString()));
            }
            if (alerteMap.get("nomProduit") != null) {
                alerte.setNomProduit((String) alerteMap.get("nomProduit"));
            }
            if (alerteMap.get("categorie") != null) {
                alerte.setCategorie((String) alerteMap.get("categorie"));
            }
            if (alerteMap.get("description") != null) {
                alerte.setDescription((String) alerteMap.get("description"));
            }
            if (alerteMap.get("codeBare") != null) {
                alerte.setCodeBare((String) alerteMap.get("codeBare"));
            }
            if (alerteMap.get("image") != null) {
                alerte.setImage((String) alerteMap.get("image"));
            }
            if (alerteMap.get("prixUnitaire") != null) {
                alerte.setPrixUnitaire(Double.parseDouble(alerteMap.get("prixUnitaire").toString()));
            }
            if (alerteMap.get("quantiteRestante") != null) {
                alerte.setQuantiteRestante((Integer) alerteMap.get("quantiteRestante"));
            }
            if (alerteMap.get("nomEmplacement") != null) {
                alerte.setNomEmplacement((String) alerteMap.get("nomEmplacement"));
            }
            if (alerteMap.get("fournisseur") != null) {
                alerte.setFournisseurId(Integer.parseInt(alerteMap.get("fournisseur").toString()));
            }


                BonAchat bon = new BonAchat();
                bon.setProduitId((long) alerte.getProduitId());
                bon.setNomProduit(alerte.getNomProduit());
                bon.setCategorie(alerte.getCategorie());
                bon.setDescription(alerte.getDescription());
                bon.setCodeBare(alerte.getCodeBare());
                bon.setImage(alerte.getImage());
                bon.setPrixUnitaire(alerte.getPrixUnitaire());
                bon.setQuantite(alerte.getQuantiteRestante());
                bon.setEmplacement(alerte.getNomEmplacement());
                bon.setDateCreation(LocalDate.now());
                bon.setStatut("En attente");
                bon.setFournisseurId((long) alerte.getFournisseurId());
                bon.setTypeAlerte(alerte.getTypeAlerte());

                // Appel à l’API pour obtenir les infos du fournisseur
                try {
                    RestTemplate restTemplate = new RestTemplate();

                    MappingJackson2HttpMessageConverter converter = new MappingJackson2HttpMessageConverter();
                    converter.setSupportedMediaTypes(List.of(MediaType.TEXT_HTML, MediaType.APPLICATION_JSON));
                    restTemplate.getMessageConverters().add(0, converter);

                    String url = "https://959c433d-b8cf-4b61-ada0-3d4d8255cf2f.mock.pstmn.io/fournisseurs";
                    FournisseurDTO[] fournisseurs = restTemplate.getForObject(url, FournisseurDTO[].class);

                    if (fournisseurs != null) {
                        for (FournisseurDTO f : fournisseurs) {
                            if (f.getId() == alerte.getFournisseurId()) {
                                bon.setNomFournisseur(f.getNom());
                                bon.setAdresseFournisseur(f.getAdresse());
                                bon.setEmailFournisseur(f.getEmail());
                                bon.setTelephoneFournisseur(f.getTelephone());
                                break;
                            }
                        }
                    }
                } catch (Exception e) {
                    System.err.println("❌ Erreur lors de l'appel API fournisseur : " + e.getMessage());
                }

                System.out.println("Alerte de bon d'achat : " + bon);
                bonAchatRepository.save(bon);
                System.out.println("✅ Bon d'achat généré automatiquement et enregistré : " + bon);
            

        } catch (Exception e) {
            System.err.println("❌ Erreur lors du traitement de l’alerte : " + e.getMessage());
        }
    }
}
