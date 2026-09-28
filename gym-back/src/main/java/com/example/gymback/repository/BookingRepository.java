package com.example.gymback.repository;

import com.example.gymback.entity.Booking;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface BookingRepository extends JpaRepository<Booking, Long> {

    List<Booking> findByUserEmailOrderByCreatedAtDesc(String userEmail);

    List<Booking> findByUserIdOrderByCreatedAtDesc(Long userId);
}