package com.parth.Backend.repository;

import com.parth.Backend.model.Badge;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BadgeRepo extends JpaRepository<Badge, Long> {
    boolean existsByTitle(String title);
}