package com.example.gymback.controller;

import lombok.RequiredArgsConstructor;
import com.example.gymback.entity.User;
import com.example.gymback.repository.UserRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final UserRepository userRepository;

    @GetMapping("/users")
    public List<User> getAllUsers() {

        return userRepository.findAll();
    }
}

//package com.example.gymback.controller;
//
//import com.example.gymback.entity.Booking;
//
//import com.example.gymback.service.BookingService;
//
//import lombok.RequiredArgsConstructor;
//
//import org.springframework.http.ResponseEntity;
//import org.springframework.web.bind.annotation.*;
//
//import java.util.List;
//
//@RestController
//@RequestMapping("/api/admin/bookings")
//@RequiredArgsConstructor
//public class AdminController {
//
//    private final BookingService bookingService;
//
//    @GetMapping
//    public ResponseEntity<List<Booking>> getAllBookings() {
//
//        return ResponseEntity.ok(
//                bookingService.getAllBookings()
//        );
//    }
//
//    @GetMapping("/{id}")
//    public ResponseEntity<Booking> getBooking(
//            @PathVariable Long id
//    ) {
//
//        return ResponseEntity.ok(
//                bookingService.getBookingById(id)
//        );
//    }
//
//    @PutMapping("/{id}/status")
//    public ResponseEntity<Booking> updateStatus(
//            @PathVariable Long id,
//            @RequestParam Booking status
//    ) {
//
//        return ResponseEntity.ok(
//                bookingService.updateStatus(
//                        id,
//                        status
//                )
//        );
//    }
//
//    @DeleteMapping("/{id}")
//    public ResponseEntity<Void> deleteBooking(
//            @PathVariable Long id
//    ) {
//
//        bookingService.deleteBooking(id);
//
//        return ResponseEntity.noContent().build();
//    }
//}