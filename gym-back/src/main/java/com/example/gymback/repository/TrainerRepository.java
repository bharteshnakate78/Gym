package com.example.gymback.repository;

import com.example.gymback.entity.Trainer;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TrainerRepository
        extends JpaRepository<Trainer, Long> {
}