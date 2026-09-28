package com.example.gymback.controller;

import lombok.RequiredArgsConstructor;
import com.example.gymback.entity.Contact;
import com.example.gymback.repository.ContactRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/contacts")
@RequiredArgsConstructor
public class ContactController {

    private final ContactRepository repository;

    @PostMapping
    public ResponseEntity<Contact> create(
            @RequestBody Contact contact
    ) {

        contact.setId(null);
        contact.setReplied(false);

        return ResponseEntity.ok(
                repository.save(contact)
        );
    }

    @GetMapping
    public List<Contact> getAll() {

        return repository.findAll();
    }

    @PutMapping("/{id}/replied")
    public ResponseEntity<Contact> markReplied(
            @PathVariable Long id
    ) {

        return repository.findById(id)
                .map(contact -> {

                    contact.setReplied(true);

                    return ResponseEntity.ok(
                            repository.save(contact)
                    );
                })
                .orElse(
                        ResponseEntity.notFound().build()
                );
    }
}