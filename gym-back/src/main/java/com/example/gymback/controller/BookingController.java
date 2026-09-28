package com.example.gymback.controller;

import com.example.gymback.dto.BookingRequest;
import com.example.gymback.entity.Booking;
import com.example.gymback.service.BookingService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bookings")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class BookingController {

    private final BookingService bookingService;

    // =========================================================
    // CREATE BOOKING
    // POST /api/bookings
    // =========================================================

    @PostMapping
    public ResponseEntity<Booking> createBooking(
            @Valid @RequestBody BookingRequest request
    ) {

        Booking booking =
                bookingService.createBooking(request);

        return ResponseEntity.ok(booking);
    }

    // =========================================================
    // GET ALL BOOKINGS
    // GET /api/bookings
    // =========================================================

    @GetMapping
    public ResponseEntity<List<Booking>> getAllBookings() {

        List<Booking> bookings =
                bookingService.getAllBookings();

        return ResponseEntity.ok(bookings);
    }

    // =========================================================
    // GET MY BOOKINGS
    // GET /api/bookings/my
    // =========================================================

    @GetMapping("/my")
    public ResponseEntity<List<Booking>> getMyBookings() {

        List<Booking> bookings =
                bookingService.getMyBookings();

        return ResponseEntity.ok(bookings);
    }

    // =========================================================
    // GET BOOKING BY ID
    // GET /api/bookings/{id}
    // =========================================================

    @GetMapping("/{id}")
    public ResponseEntity<Booking> getBookingById(
            @PathVariable Long id
    ) {

        return ResponseEntity.ok(
                bookingService.getBookingById(id)
        );
    }

    // =========================================================
    // UPDATE STATUS
    // PUT /api/bookings/{id}/status
    // =========================================================

    @PutMapping("/{id}/status")
    public ResponseEntity<Booking> updateBookingStatus(
            @PathVariable Long id,
            @RequestBody StatusRequest request
    ) {

        return ResponseEntity.ok(
                bookingService.updateBookingStatus(
                        id,
                        request.status()
                )
        );
    }

    // =========================================================
    // DELETE
    // DELETE /api/bookings/{id}
    // =========================================================

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBooking(
            @PathVariable Long id
    ) {

        bookingService.deleteBooking(id);

        return ResponseEntity.noContent().build();
    }

    // =========================================================
    // STATUS REQUEST
    // =========================================================

    public record StatusRequest(String status) {
    }
}