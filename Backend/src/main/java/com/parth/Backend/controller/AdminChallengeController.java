package com.parth.Backend.controller;

import com.parth.Backend.model.Challenge;
import com.parth.Backend.service.ChallengeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/challenges")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ROLE_ADMIN')")
@CrossOrigin(origins = "http://localhost:5173")
public class AdminChallengeController {
    private final ChallengeService challengeService;

    @PostMapping
    public ResponseEntity<Challenge> createChallenge(@RequestBody Challenge challenge) {
        return ResponseEntity.ok(challengeService.createChallenge(challenge));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Challenge> updateChallenge(@PathVariable Long id, @RequestBody Challenge challenge) {
        return ResponseEntity.ok(challengeService.updateChallenge(id, challenge));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteChallenge(@PathVariable Long id) {
        challengeService.deleteChallenge(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Challenge> getChallenge(@PathVariable Long id) {
        Challenge challenge = challengeService.getChallengeById(id);
        return ResponseEntity.ok(challenge);
    }

    @PostMapping("/{id}/activate")
    public ResponseEntity<Challenge> activateChallenge(@PathVariable Long id) {
        Challenge challenge = challengeService.activateChallenge(id);
        return ResponseEntity.ok(challenge);
    }

    @PostMapping("/{id}/deactivate")
    public ResponseEntity<Challenge> deactivateChallenge(@PathVariable Long id) {
        Challenge challenge = challengeService.deactivateChallenge(id);
        return ResponseEntity.ok(challenge);
    }
}