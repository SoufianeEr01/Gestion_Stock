package com.gs.project_gestion_stock.service;

import com.gs.project_gestion_stock.Dto.EmplacementDTO;
import com.gs.project_gestion_stock.Model.Emplacement;
import com.gs.project_gestion_stock.Repository.EmplacementRepository;
import com.gs.project_gestion_stock.Model.TypeEmplacement;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class EmplacementService {

    private final EmplacementRepository emplacementRepository;

    public EmplacementService(EmplacementRepository emplacementRepository) {
        this.emplacementRepository = emplacementRepository;
    }

    public List<EmplacementDTO> getAllEmplacements() {
        return emplacementRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public Optional<EmplacementDTO> getEmplacementById(int id) {
        return emplacementRepository.findById(id)
                .map(this::convertToDTO);
    }

    public EmplacementDTO createEmplacement(EmplacementDTO dto) {
        Emplacement emplacement = convertToEntity(dto);
        Emplacement saved = emplacementRepository.save(emplacement);
        return convertToDTO(saved);
    }

    public EmplacementDTO updateEmplacement(int id, EmplacementDTO dto) {
        return emplacementRepository.findById(id).map(emp -> {
            emp.setNom(dto.getNom());
            emp.setAdresse(dto.getAdresse());
            emp.setType(dto.getType());
            Emplacement updated = emplacementRepository.save(emp);
            return convertToDTO(updated);
        }).orElse(null);
    }

    public void deleteEmplacement(int id) {
        emplacementRepository.deleteById(id);
    }

    // Conversion méthode : Entity -> DTO
    private EmplacementDTO convertToDTO(Emplacement emplacement) {
        EmplacementDTO dto = new EmplacementDTO();
        dto.setId(emplacement.getId());
        dto.setNom(emplacement.getNom());
        dto.setAdresse(emplacement.getAdresse());
        dto.setType(emplacement.getType());
        return dto;
    }

    // Conversion méthode : DTO -> Entity
    private Emplacement convertToEntity(EmplacementDTO dto) {
        Emplacement emp = new Emplacement();
        emp.setId(dto.getId());
        emp.setNom(dto.getNom());
        emp.setAdresse(dto.getAdresse());
        emp.setType(dto.getType());
        return emp;
    }
}
