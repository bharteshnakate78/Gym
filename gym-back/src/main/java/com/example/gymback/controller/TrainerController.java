package com.example.gymback.controller;

import lombok.RequiredArgsConstructor;
import com.example.gymback.entity.Trainer;
import com.example.gymback.repository.TrainerRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/trainers")
@RequiredArgsConstructor
public class TrainerController {

    private final TrainerRepository repository;

    @GetMapping
    public List<Trainer> getAll() {
        return repository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Trainer> getById(
            @PathVariable Long id
    ) {

        return repository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(
                        ResponseEntity.notFound().build()
                );
    }

    @PostMapping
    public Trainer create(
            @RequestBody Trainer trainer
    ) {

        return repository.save(trainer);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Trainer> update(
            @PathVariable Long id,
            @RequestBody Trainer data
    ) {

        return repository.findById(id)
                .map(existing -> {

                    existing.setName(data.getName());
                    existing.setSpecialization(
                            data.getSpecialization()
                    );
                    existing.setExperience(
                            data.getExperience()
                    );
                    existing.setCertifications(
                            data.getCertifications()
                    );
                    existing.setImage(
                            data.getImage()
                    );
                    existing.setDescription(
                            data.getDescription()
                    );

                    return ResponseEntity.ok(
                            repository.save(existing)
                    );
                })
                .orElse(
                        ResponseEntity.notFound().build()
                );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(
            @PathVariable Long id
    ) {

        if (!repository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }

        repository.deleteById(id);

        return ResponseEntity.noContent().build();
    }
}