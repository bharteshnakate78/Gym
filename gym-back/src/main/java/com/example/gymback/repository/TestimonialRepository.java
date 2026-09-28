package com.example.gymback.repository;


import com.example.gymback.entity.Testimonial;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TestimonialRepository
        extends JpaRepository<Testimonial, Long> {
}