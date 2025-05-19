package com.parth.Backend.controller;

import com.parth.Backend.model.Challenge;
import com.parth.Backend.model.UserChallenge;
import com.parth.Backend.service.ChallengeService;
import com.parth.Backend.service.JWTService;

import lombok.RequiredArgsConstructor;

import java.util.HashMap;
import java.util.Map;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/challenges")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class ChallengeController {
    private final ChallengeService challengeService;
    private final JWTService jwtService;

    @GetMapping
    public ResponseEntity<Page<Challenge>> getAllChallenges(Pageable pageable) {
        return ResponseEntity.ok(challengeService.getAllChallenges(pageable));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Challenge> getChallenge(@PathVariable Long id) {
        return ResponseEntity.ok(challengeService.getChallengeById(id));
    }

    @PostMapping("/{challengeId}/start")
    public ResponseEntity<Map<String, Object>> startChallenge(
            @RequestHeader("Authorization") String token,
            @PathVariable Long challengeId) {
        String jwt = token.substring(7);
        Long userId = jwtService.getUserIdFromToken(jwt);
        UserChallenge userChallenge = challengeService.startChallenge(userId, challengeId);
        
        Map<String, Object> response = new HashMap<>();
        response.put("id", userChallenge.getId());
        response.put("challengeId", userChallenge.getChallenge().getId());
        response.put("status", userChallenge.getStatus());
        response.put("startedAt", userChallenge.getStartedAt());
        
        return ResponseEntity.ok(response);
    }

    @PostMapping("/{challengeId}/submit")
    public ResponseEntity<UserChallenge> submitChallenge(
            @RequestHeader("Authorization") String token,
            @PathVariable Long challengeId,
            @RequestBody String solution) {
        String jwt = token.substring(7); // Remove "Bearer " prefix
        Long userId = jwtService.getUserIdFromToken(jwt);
        return ResponseEntity.ok(challengeService.submitChallenge(userId, challengeId, solution));
    }
}