package com.example.gymback.repository;


import com.example.gymback.entity.Membership;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MembershipRepository
        extends JpaRepository<Membership, Long> {
}
