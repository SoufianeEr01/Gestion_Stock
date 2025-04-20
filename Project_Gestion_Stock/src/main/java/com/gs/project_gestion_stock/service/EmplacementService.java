package com.gs.project_gestion_stock.service;

import com.gs.project_gestion_stock.Model.Emplacement;
import com.gs.project_gestion_stock.Repository.EmplacementRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class EmplacementService {

    private final EmplacementRepository emplacementRepository;

    public EmplacementService(EmplacementRepository emplacementRepository) {
        this.emplacementRepository = emplacementRepository;
    }

    public List<Emplacement> getAllEmplacements() {
        return emplacementRepository.findAll();
    }

    public Optional<Emplacement> getEmplacementById(int id) {
        return emplacementRepository.findById(id);
    }

    public Emplacement createEmplacement(Emplacement emplacement) {
        return emplacementRepository.save(emplacement);
    }

    public Emplacement updateEmplacement(int id, Emplacement updatedEmplacement) {
        return emplacementRepository.findById(id).map(emp -> {
            emp.setNom(updatedEmplacement.getNom());
            emp.setAdresse(updatedEmplacement.getAdresse());
            emp.setType(updatedEmplacement.getType());
            return emplacementRepository.save(emp);
        }).orElse(null);
    }

    public void deleteEmplacement(int id) {
        emplacementRepository.deleteById(id);
    }
}
