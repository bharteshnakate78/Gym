package com.example.gymback.service;

import com.example.gymback.dto.BookingRequest;
import com.example.gymback.entity.Booking;
import com.example.gymback.entity.User;
import com.example.gymback.repository.BookingRepository;
import com.example.gymback.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class BookingService {

    private final BookingRepository bookingRepository;
    private final UserRepository userRepository;

    // =========================================================
    // CREATE BOOKING
    // =========================================================

    public Booking createBooking(BookingRequest request) {

        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null ||
                !authentication.isAuthenticated()) {

            throw new RuntimeException("User is not authenticated");
        }

        String email = authentication.getName();

        if (email == null || email.isBlank()) {
            throw new RuntimeException("User email not found from JWT");
        }

        System.out.println("=================================");
        System.out.println("CREATE BOOKING");
        System.out.println("EMAIL: " + email);
        System.out.println("DATE: " + request.getPreferredDate());
        System.out.println("TIME: " + request.getPreferredTime());
        System.out.println("GOAL: " + request.getFitnessGoal());
        System.out.println("=================================");

        User user = userRepository
                .findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException(
                                "User not found: " + email
                        )
                );

        Booking booking = Booking.builder()
                .userId(user.getId())
                .userEmail(user.getEmail())
                .preferredDate(request.getPreferredDate())
                .preferredTime(request.getPreferredTime())
                .fitnessGoal(request.getFitnessGoal())
                .notes(request.getNotes())
                .status("PENDING")
                .createdAt(LocalDateTime.now())
                .build();

        Booking savedBooking = bookingRepository.save(booking);

        System.out.println("=================================");
        System.out.println("BOOKING SAVED");
        System.out.println("BOOKING ID: " + savedBooking.getId());
        System.out.println("USER ID: " + savedBooking.getUserId());
        System.out.println("=================================");

        return savedBooking;
    }

    // =========================================================
    // GET MY BOOKINGS
    // =========================================================

    public List<Booking> getMyBookings() {

        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null ||
                !authentication.isAuthenticated()) {

            throw new RuntimeException("User is not authenticated");
        }

        String email = authentication.getName();

        if (email == null || email.isBlank()) {
            throw new RuntimeException("User email not found from JWT");
        }

        return bookingRepository
                .findByUserEmailOrderByCreatedAtDesc(email);
    }

    // =========================================================
    // GET ALL BOOKINGS - ADMIN
    // =========================================================

    public List<Booking> getAllBookings() {

        return bookingRepository
                .findAll()
                .stream()
                .sorted(
                        (a, b) -> b.getCreatedAt()
                                .compareTo(a.getCreatedAt())
                )
                .toList();
    }

    // =========================================================
    // GET BOOKING BY ID
    // =========================================================

    public Booking getBookingById(Long id) {

        return bookingRepository
                .findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Booking not found with id: " + id
                        )
                );
    }

    // =========================================================
    // UPDATE BOOKING STATUS
    // =========================================================

    public Booking updateBookingStatus(
            Long id,
            String status
    ) {

        Booking booking = bookingRepository
                .findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Booking not found with id: " + id
                        )
                );

        if (status == null || status.isBlank()) {
            throw new RuntimeException(
                    "Booking status cannot be empty"
            );
        }

        booking.setStatus(status.toUpperCase());

        return bookingRepository.save(booking);
    }

    // =========================================================
    // DELETE BOOKING
    // =========================================================

    public void deleteBooking(Long id) {

        if (!bookingRepository.existsById(id)) {
            throw new RuntimeException(
                    "Booking not found with id: " + id
            );
        }

        bookingRepository.deleteById(id);
    }
}