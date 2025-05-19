package com.parth.Backend.service;

import com.parth.Backend.exception.ResourceNotFoundException;
import com.parth.Backend.model.Challenge;
import com.parth.Backend.model.UserChallenge;
import com.parth.Backend.model.ChallengeStatus;
import com.parth.Backend.repository.ChallengeRepo;
import com.parth.Backend.repository.UserChallengeRepo;
import com.parth.Backend.repository.UserRepo;

import lombok.RequiredArgsConstructor;

import java.time.LocalDateTime;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class ChallengeService {
    private final ChallengeRepo challengeRepo;
    private final UserChallengeRepo userChallengeRepo;
    private final UserRepo userRepo;

    public Page<Challenge> getAllChallenges(Pageable pageable) {
        return challengeRepo.findAll(pageable);
    }

    public Challenge getChallengeById(Long id) {
        return challengeRepo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Challenge not found"));
    }

    @Transactional
    public UserChallenge startChallenge(Long userId, Long challengeId) {
        UserChallenge userChallenge = new UserChallenge();
        userChallenge.setUser(userRepo.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found")));
        userChallenge.setChallenge(getChallengeById(challengeId));
        userChallenge.setStartedAt(LocalDateTime.now());
        return userChallengeRepo.save(userChallenge);
    }

    @Transactional
    private boolean evaluateSolution(Challenge challenge, String solution) {
        // Basic validation
        if (solution == null || solution.trim().isEmpty()) {
            return false;
        }

        // Here you would implement the actual solution evaluation logic
        // For now, we'll just check if the solution contains required elements
        String expectedSolution = challenge.getSolutionLogic();
        return expectedSolution != null && solution.contains(expectedSolution);
    }

    @Transactional
    public UserChallenge submitChallenge(Long userId, Long challengeId, String solution) {
        UserChallenge userChallenge = userChallengeRepo.findFirstByUserIdAndChallengeIdOrderByTimestampDesc(userId, challengeId)
                .orElseThrow(() -> new ResourceNotFoundException("Challenge attempt not found"));

        boolean isCorrect = evaluateSolution(userChallenge.getChallenge(), solution);
        
        if (isCorrect) {
            userChallenge.setStatus(ChallengeStatus.COMPLETED);
            userChallenge.setScore(calculateScore(userChallenge.getChallenge()));
            
            // Update user points
            var user = userChallenge.getUser();
            user.setPoints(user.getPoints() + userChallenge.getScore());
            userRepo.save(user);
        } else {
            userChallenge.setStatus(ChallengeStatus.FAILED);
            userChallenge.setScore(0);
        }
        
        return userChallengeRepo.save(userChallenge);
    }

    @Transactional
    public Challenge activateChallenge(Long id) {
        Challenge challenge = getChallengeById(id);
        challenge.setActive(true);
        return challengeRepo.save(challenge);
    }

    @Transactional
    public Challenge deactivateChallenge(Long id) {
        Challenge challenge = getChallengeById(id);
        challenge.setActive(false);
        return challengeRepo.save(challenge);
    }

    @Transactional
    public Challenge createChallenge(Challenge challenge) {
        // Validate challenge
        if (challenge.getTitle() == null || challenge.getTitle().trim().isEmpty()) {
            throw new IllegalArgumentException("Challenge title cannot be empty");
        }
        if (challenge.getDifficulty() == null) {
            throw new IllegalArgumentException("Challenge difficulty must be specified");
        }
        
        challenge.setActive(true); // Set default active status
        return challengeRepo.save(challenge);
    }

    @Transactional
    public Challenge updateChallenge(Long id, Challenge challenge) {
        Challenge existingChallenge = getChallengeById(id);
        
        // Update fields
        existingChallenge.setTitle(challenge.getTitle());
        existingChallenge.setDescription(challenge.getDescription());
        existingChallenge.setDifficulty(challenge.getDifficulty());
        existingChallenge.setPoints(challenge.getPoints());
        existingChallenge.setTestCases(challenge.getTestCases());
        existingChallenge.setCodeBlocks(challenge.getCodeBlocks());
        existingChallenge.setSolutionLogic(challenge.getSolutionLogic());
        
        return challengeRepo.save(existingChallenge);
    }

    @Transactional
    public void deleteChallenge(Long id) {
        Challenge challenge = getChallengeById(id);
        
        // Check if challenge has any active user attempts
        if (userChallengeRepo.existsByChallengeId(id)) {
            throw new IllegalStateException("Cannot delete challenge with active user attempts");
        }
        
        challengeRepo.delete(challenge);
    }

    private int calculateScore(Challenge challenge) {
        // Base score from challenge points
        int baseScore = challenge.getPoints() != null ? challenge.getPoints() : 0;
        
        // Difficulty multiplier
        int multiplier = switch (challenge.getDifficulty()) {
            case BEGINNER -> 1;
            case INTERMEDIATE -> 2;
            case ADVANCED -> 3;
            default -> 1;
        };
        
        return baseScore * multiplier;
    }
}