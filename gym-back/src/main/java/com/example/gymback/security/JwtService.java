 package com.example.gymback.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;

@Service
public class JwtService {

    private final SecretKey secretKey;
    private final long expiration;

    public JwtService(
            @Value("${app.jwt.secret}") String secret,
            @Value("${app.jwt.expiration:86400000}") long expiration
    ) {

        if (secret == null || secret.trim().length() < 32) {
            throw new IllegalArgumentException(
                    "JWT secret must be at least 32 characters long"
            );
        }

        String cleanSecret = secret.trim();

        this.secretKey = Keys.hmacShaKeyFor(
                cleanSecret.getBytes(StandardCharsets.UTF_8)
        );

        this.expiration = expiration;

        System.out.println("=================================");
        System.out.println("JWT SERVICE INITIALIZED");
        System.out.println("JWT SECRET LENGTH: " + cleanSecret.length());
        System.out.println("JWT EXPIRATION: " + expiration);
        System.out.println("=================================");
    }

    // =====================================================
    // GENERATE TOKEN
    // =====================================================

    public String generateToken(String email, String role) {

        Date now = new Date();

        Date expiry = new Date(
                now.getTime() + expiration
        );

        return Jwts.builder()
                .subject(email)
                .claim("role", role)
                .issuedAt(now)
                .expiration(expiry)
                .signWith(secretKey)
                .compact();
    }

    // =====================================================
    // EXTRACT EMAIL
    // =====================================================

    public String extractEmail(String token) {

        return getClaims(token).getSubject();
    }

    // =====================================================
    // EXTRACT ROLE
    // =====================================================

    public String extractRole(String token) {

        return getClaims(token)
                .get("role", String.class);
    }

    // =====================================================
    // VALIDATE TOKEN
    // =====================================================

    public boolean isValid(String token) {

        try {

            Claims claims = getClaims(token);

            String email = claims.getSubject();

            Date expiry = claims.getExpiration();

            boolean valid =
                    email != null
                            && expiry != null
                            && expiry.after(new Date());

            System.out.println(
                    "JWT VALIDATION RESULT: " + valid
            );

            if (valid) {
                System.out.println(
                        "JWT EMAIL: " + email
                );
            }

            return valid;

        } catch (Exception e) {

            System.out.println(
                    "JWT VALIDATION ERROR: "
                            + e.getClass().getSimpleName()
                            + " - "
                            + e.getMessage()
            );

            return false;
        }
    }

    // =====================================================
    // PARSE JWT
    // =====================================================

    private Claims getClaims(String token) {

        return Jwts.parser()
                .verifyWith(secretKey)
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }
}
