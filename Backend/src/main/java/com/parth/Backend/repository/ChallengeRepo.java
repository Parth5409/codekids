package com.parth.Backend.repository;

import com.parth.Backend.model.Challenge;
import com.parth.Backend.model.Difficulty;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ChallengeRepo extends JpaRepository<Challenge, Long> {
    Page<Challenge> findByDifficulty(Difficulty difficulty, Pageable pageable);
    List<Challenge> findByTitleContainingIgnoreCase(String title);
}