package com.example.gymback.config;

import com.example.gymback.entity.Role;
import com.example.gymback.entity.User;
import com.example.gymback.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
@RequiredArgsConstructor
public class AdminSeeder {

    private final UserRepository userRepository;

    private final PasswordEncoder passwordEncoder;

    @Bean
    CommandLineRunner createAdmin() {

        return args -> {

            if (!userRepository.existsByEmail(
                    "admin@gym.com"
            )) {

                User admin = User.builder()
                        .name("Gym Admin")
                        .email("admin@gym.com")
                        .phone("9999999999")
                        .password(
                                passwordEncoder.encode(
                                        "Admin@123"
                                )
                        )
                        .role(Role.ADMIN)
                        .build();

                userRepository.save(admin);

                System.out.println(
                        "================================="
                );

                System.out.println(
                        "ADMIN ACCOUNT CREATED"
                );

                System.out.println(
                        "Email: admin@gym.com"
                );

                System.out.println(
                        "Password: Admin@123"
                );

                System.out.println(
                        "================================="
                );
            }
        };
    }
}