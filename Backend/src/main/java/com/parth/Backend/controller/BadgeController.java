package com.parth.Backend.controller;

import com.parth.Backend.model.Badge;
import com.parth.Backend.model.UserBadge;
import com.parth.Backend.service.BadgeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/badges")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class BadgeController {
    private final BadgeService badgeService;

    @GetMapping
    public ResponseEntity<List<Badge>> getAllBadges() {
        return ResponseEntity.ok(badgeService.getAllBadges());
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<UserBadge>> getUserBadges(@PathVariable Long userId) {
        return ResponseEntity.ok(badgeService.getUserBadges(userId));
    }
}