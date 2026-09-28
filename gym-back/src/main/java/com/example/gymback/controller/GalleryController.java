package com.example.gymback.controller;

import lombok.RequiredArgsConstructor;
import com.example.gymback.entity.Gallery;
import com.example.gymback.repository.GalleryRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/gallery")
@RequiredArgsConstructor
public class GalleryController {

    private final GalleryRepository repository;

    @GetMapping
    public List<Gallery> getAll() {

        return repository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Gallery> getById(
            @PathVariable Long id
    ) {

        return repository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(
                        ResponseEntity.notFound().build()
                );
    }

    @PostMapping
    public Gallery create(
            @RequestBody Gallery gallery
    ) {

        return repository.save(gallery);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Gallery> update(
            @PathVariable Long id,
            @RequestBody Gallery data
    ) {

        return repository.findById(id)
                .map(existing -> {

                    existing.setTitle(data.getTitle());
                    existing.setImageUrl(
                            data.getImageUrl()
                    );
                    existing.setCategory(
                            data.getCategory()
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