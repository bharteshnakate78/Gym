package com.example.gymback.controller;

import lombok.RequiredArgsConstructor;
import com.example.gymback.entity.Membership;
import com.example.gymback.repository.MembershipRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/memberships")
@RequiredArgsConstructor
public class MembershipController {

    private final MembershipRepository repository;

    @GetMapping
    public List<Membership> getAll() {
        return repository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Membership> getById(
            @PathVariable Long id
    ) {

        return repository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(
                        ResponseEntity.notFound().build()
                );
    }

    @PostMapping
    public Membership create(
            @RequestBody Membership membership
    ) {

        return repository.save(membership);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Membership> update(
            @PathVariable Long id,
            @RequestBody Membership data
    ) {

        return repository.findById(id)
                .map(existing -> {

                    existing.setName(data.getName());
                    existing.setPrice(data.getPrice());
                    existing.setDurationMonths(
                            data.getDurationMonths()
                    );
                    existing.setBenefits(
                            data.getBenefits()
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