package com.example.gymback.controller;

import lombok.RequiredArgsConstructor;
import com.example.gymback.entity.Testimonial;
import com.example.gymback.repository.TestimonialRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/testimonials")
@RequiredArgsConstructor
public class TestimonialController {

    private final TestimonialRepository repository;

    @GetMapping
    public List<Testimonial> getAll() {
        return repository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Testimonial> getById(
            @PathVariable Long id
    ) {

        return repository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(
                        ResponseEntity.notFound().build()
                );
    }

    @PostMapping
    public Testimonial create(
            @RequestBody Testimonial testimonial
    ) {

        return repository.save(testimonial);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Testimonial> update(
            @PathVariable Long id,
            @RequestBody Testimonial data
    ) {

        return repository.findById(id)
                .map(existing -> {

                    existing.setMemberName(
                            data.getMemberName()
                    );

                    existing.setMessage(
                            data.getMessage()
                    );

                    existing.setRating(
                            data.getRating()
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