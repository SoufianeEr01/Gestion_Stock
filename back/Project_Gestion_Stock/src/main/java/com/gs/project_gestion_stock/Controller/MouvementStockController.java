package com.gs.project_gestion_stock.Controller;

import com.gs.project_gestion_stock.Dto.MovementDTO;
import com.gs.project_gestion_stock.Model.MouvementStock;
import com.gs.project_gestion_stock.service.MouvementStockService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
@RestController
@RequestMapping("/api/mouvements")
@RequiredArgsConstructor
@CrossOrigin("*")
public class MouvementStockController {

    private final MouvementStockService mouvementStockService;

    @GetMapping
    public ResponseEntity<List<MovementDTO>> getAllMouvements() {
        return ResponseEntity.ok(mouvementStockService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<MovementDTO> getMouvementById(@PathVariable int id) {
        return ResponseEntity.ok(mouvementStockService.findById(id));
    }

    @PostMapping
    public ResponseEntity<MovementDTO> createMouvement(@RequestBody MovementDTO mouvementDTO) {
        return ResponseEntity.ok(mouvementStockService.save(mouvementDTO));
    }

}
