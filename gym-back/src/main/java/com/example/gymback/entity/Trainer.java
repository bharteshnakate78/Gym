package com.example.gymback.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "trainers")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Trainer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    private String specialization;

    private String experience;

    @Column(length = 2000)
    private String certifications;

    @Column(length = 1000)
    private String image;

    @Column(length = 3000)
    private String description;
}