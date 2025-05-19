package com.parth.Backend.service;

import com.parth.Backend.dto.LeaderboardEntryDto;
import com.parth.Backend.exception.ResourceNotFoundException;
import com.parth.Backend.model.User;
import com.parth.Backend.repository.UserRepo;
import com.parth.Backend.repository.UserChallengeRepo;
import com.parth.Backend.repository.UserBadgeRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class LeaderboardService {
    private final UserRepo userRepo;
    private final UserChallengeRepo userChallengeRepo;
    private final UserBadgeRepo userBadgeRepo;

    public Page<LeaderboardEntryDto> getLeaderboard(String country, Pageable pageable) {
        Page<User> users = country != null && !country.isEmpty() ? 
            userRepo.findAllByCountryOrderByPointsDesc(country, pageable) :
            userRepo.findAllByOrderByPointsDesc(pageable);

        return users.map(user -> mapToLeaderboardEntry(user));
    }

    private LeaderboardEntryDto mapToLeaderboardEntry(User user) {
        return new LeaderboardEntryDto(
            user.getId(),
            user.getUsername(),
            user.getAvatar(),
            user.getPoints(),
            calculateRank(user.getId()),
            countCompletedChallenges(user.getId()),
            countEarnedBadges(user.getId())
        );
    }

    public Integer getUserRank(Long userId) {
        return calculateRank(userId);
    }

    private Integer calculateRank(Long userId) {
        User user = userRepo.findById(userId)
            .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        return (int) (userRepo.countByPointsGreaterThan(user.getPoints()) + 1);
    }

    private Integer countCompletedChallenges(Long userId) {
        return userChallengeRepo.countCompletedChallengesByUserId(userId).intValue();
    }

    private Integer countEarnedBadges(Long userId) {
        return userBadgeRepo.findByUserId(userId).size();
    }
}