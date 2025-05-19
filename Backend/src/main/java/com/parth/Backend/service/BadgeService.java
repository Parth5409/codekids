package com.parth.Backend.service;

import com.parth.Backend.exception.ResourceNotFoundException;
import com.parth.Backend.model.Badge;
import com.parth.Backend.model.UserBadge;
import com.parth.Backend.repository.BadgeRepo;
import com.parth.Backend.repository.UserBadgeRepo;
import com.parth.Backend.repository.UserRepo;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class BadgeService {
    private final BadgeRepo badgeRepo;
    private final UserBadgeRepo userBadgeRepo;
    private final UserRepo userRepo;
    private final CloudinaryService cloudinaryService;

    public List<Badge> getAllBadges() {
        return badgeRepo.findAll();
    }

    public List<UserBadge> getUserBadges(Long userId) {
        return userBadgeRepo.findByUserId(userId);
    }

    @Transactional
    public UserBadge awardBadge(Long userId, Long badgeId) {
        if (userBadgeRepo.existsByUserIdAndBadgeId(userId, badgeId)) {
            throw new IllegalStateException("User already has this badge");
        }

        var user = userRepo.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        var badge = badgeRepo.findById(badgeId)
                .orElseThrow(() -> new ResourceNotFoundException("Badge not found"));

        UserBadge userBadge = new UserBadge();
        userBadge.setUser(user);
        userBadge.setBadge(badge);
        userBadge.setAwardedAt(LocalDateTime.now());

        // Update user points when badge is awarded
        user.setPoints(user.getPoints() + calculateBadgePoints(badge));
        userRepo.save(user);

        return userBadgeRepo.save(userBadge);
    }

    private int calculateBadgePoints(Badge badge) {
        // Basic points calculation for badges
        return 50; // You can implement more complex logic based on badge requirements
    }

    @Transactional
    public Badge createBadge(Badge badge, MultipartFile file) {
        if (badgeRepo.existsByTitle(badge.getTitle())) {
            throw new IllegalStateException("Badge with this title already exists");
        }

        if (file != null && !file.isEmpty()) {
            String imageUrl = cloudinaryService.uploadFile(file);
            badge.setImageUrl(imageUrl);
        }

        return badgeRepo.save(badge);
    }

    @Transactional
    public Badge updateBadge(Long id, Badge badge) {
        Badge existingBadge = badgeRepo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Badge not found"));
        
        existingBadge.setTitle(badge.getTitle());
        existingBadge.setDescription(badge.getDescription());
        existingBadge.setImageUrl(badge.getImageUrl());
        existingBadge.setRequirements(badge.getRequirements());
        
        return badgeRepo.save(existingBadge);
    }

    @Transactional
    public void deleteBadge(Long id) {
        if (!badgeRepo.existsById(id)) {
            throw new ResourceNotFoundException("Badge not found");
        }
        badgeRepo.deleteById(id);
    }
}