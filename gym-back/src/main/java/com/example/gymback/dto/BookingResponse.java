package com.example.gymback.dto;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class BookingResponse {

    private Long id;

    private String preferredDate;

    private String preferredTime;

    private String fitnessGoal;

    private String notes;

    private String status;

    private Long userId;

    private String userName;

    private String userEmail;

    private LocalDateTime createdAt;
}