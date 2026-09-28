package com.example.gymback.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter
        extends OncePerRequestFilter {

    private final JwtService jwtService;

    private final CustomUserDetailsService userDetailsService;

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain
    ) throws ServletException, IOException {

        System.out.println(
                "REQUEST: "
                        + request.getMethod()
                        + " "
                        + request.getRequestURI()
        );

        String header =
                request.getHeader("Authorization");

        if (header == null ||
                !header.startsWith("Bearer ")) {

            System.out.println(
                    "AUTH HEADER: MISSING"
            );

            filterChain.doFilter(
                    request,
                    response
            );

            return;
        }

        System.out.println(
                "AUTH HEADER: PRESENT"
        );

        String token =
                header.substring(7);

        try {

            System.out.println(
                    "JWT: Token received"
            );

            if (!jwtService.isValid(token)) {

                System.out.println(
                        "JWT: INVALID TOKEN"
                );

                filterChain.doFilter(
                        request,
                        response
                );

                return;
            }

            System.out.println(
                    "JWT VALID: true"
            );

            String email =
                    jwtService.extractEmail(token);

            System.out.println(
                    "JWT EMAIL: " + email
            );

            UserDetails userDetails =
                    userDetailsService
                            .loadUserByUsername(email);

            UsernamePasswordAuthenticationToken authentication =
                    new UsernamePasswordAuthenticationToken(
                            userDetails,
                            null,
                            userDetails.getAuthorities()
                    );

            SecurityContextHolder
                    .getContext()
                    .setAuthentication(
                            authentication
                    );

            System.out.println(
                    "AUTHENTICATION: SUCCESS"
            );

        } catch (Exception e) {

            System.out.println(
                    "JWT FILTER ERROR: "
                            + e.getClass().getSimpleName()
                            + " - "
                            + e.getMessage()
            );

            SecurityContextHolder
                    .clearContext();
        }

        filterChain.doFilter(
                request,
                response
        );
    }
}
