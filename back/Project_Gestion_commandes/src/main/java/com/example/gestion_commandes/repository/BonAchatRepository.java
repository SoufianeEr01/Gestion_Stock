package com.example.gestion_commandes.repository;

import com.example.gestion_commandes.model.BonAchat;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface BonAchatRepository extends JpaRepository<BonAchat, Long> {
    List<BonAchat> findByStatut(String statut);
}
