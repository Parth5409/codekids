package com.parth.Backend.repository;

import com.parth.Backend.model.UserChallenge;
import com.parth.Backend.model.ChallengeStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserChallengeRepo extends JpaRepository<UserChallenge, Long> {
    List<UserChallenge> findByUserId(Long userId);
    List<UserChallenge> findByUserIdAndStatus(Long userId, ChallengeStatus status);
    
    @Query("SELECT uc FROM UserChallenge uc WHERE uc.user.id = :userId AND uc.challenge.id = :challengeId")
    UserChallenge findByUserIdAndChallengeId(Long userId, Long challengeId);
    
    @Query("SELECT COUNT(uc) FROM UserChallenge uc WHERE uc.user.id = :userId AND uc.status = 'COMPLETED'")
    Long countCompletedChallengesByUserId(Long userId);
    
    boolean existsByChallengeId(Long challengeId);

    Optional<UserChallenge> findFirstByUserIdAndChallengeIdOrderByTimestampDesc(Long userId, Long challengeId);
}