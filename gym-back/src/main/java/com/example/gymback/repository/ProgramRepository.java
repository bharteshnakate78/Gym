package com.example.gymback.repository;


import com.example.gymback.entity.Program;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProgramRepository
        extends JpaRepository<Program, Long> {
}