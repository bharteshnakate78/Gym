package com.example.gymback.controller;

import lombok.RequiredArgsConstructor;
import com.example.gymback.entity.Program;
import com.example.gymback.repository.ProgramRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/programs")
@RequiredArgsConstructor
public class ProgramController {

    private final ProgramRepository repository;

    @GetMapping
    public List<Program> getAll() {
        return repository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Program> getById(
            @PathVariable Long id
    ) {

        return repository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(
                        ResponseEntity.notFound().build()
                );
    }

    @PostMapping
    public Program create(
            @RequestBody Program program
    ) {

        return repository.save(program);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Program> update(
            @PathVariable Long id,
            @RequestBody Program data
    ) {

        return repository.findById(id)
                .map(existing -> {

                    existing.setName(data.getName());
                    existing.setDescription(
                            data.getDescription()
                    );
                    existing.setDuration(
                            data.getDuration()
                    );
                    existing.setDifficulty(
                            data.getDifficulty()
                    );
                    existing.setImage(
                            data.getImage()
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