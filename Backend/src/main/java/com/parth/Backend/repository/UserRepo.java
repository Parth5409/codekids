package com.parth.Backend.repository;

import com.parth.Backend.model.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface UserRepo extends JpaRepository<User, Long> {
    Optional<User> findByUsername(String username);
    Optional<User> findByEmail(String email);
    boolean existsByUsername(String username);
    boolean existsByEmail(String email);
    Page<User> findAllByOrderByPointsDesc(Pageable pageable);
    Page<User> findAllByCountryOrderByPointsDesc(String country, Pageable pageable);
    long countByPointsGreaterThan(Integer points);
    long countByPointsLessThanEqual(Integer points);
}
