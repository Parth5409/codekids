package com.parth.Backend.controller;

import com.parth.Backend.dto.LeaderboardEntryDto;
import com.parth.Backend.service.LeaderboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/leaderboard")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class LeaderboardController {
    private final LeaderboardService leaderboardService;

    @GetMapping
    public ResponseEntity<Page<LeaderboardEntryDto>> getLeaderboard(
            @RequestParam(required = false) String country,
            Pageable pageable) {
        return ResponseEntity.ok(leaderboardService.getLeaderboard(country, pageable));
    }

    @GetMapping("/user/{userId}/rank")
    public ResponseEntity<Integer> getUserRank(@PathVariable Long userId) {
        return ResponseEntity.ok(leaderboardService.getUserRank(userId));
    }
}