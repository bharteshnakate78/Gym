package com.example.gymback.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalTime;

@Getter
@Setter
public class BookingRequest {

    @NotNull
    private LocalDate preferredDate;

    @NotNull
    private LocalTime preferredTime;

    @NotBlank
    private String fitnessGoal;

    private String notes;
}