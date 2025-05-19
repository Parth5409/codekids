package com.parth.Backend.controller;

import com.parth.Backend.model.Badge;
import com.parth.Backend.service.BadgeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/admin/badges")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ROLE_ADMIN')")
@CrossOrigin(origins = "http://localhost:5173")
public class AdminBadgeController {
    private final BadgeService badgeService;

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Badge> createBadge(
            @RequestParam("file") MultipartFile file,
            @RequestParam("title") String title,
            @RequestParam("description") String description,
            @RequestParam("requirements") String requirements) {
        Badge badge = new Badge();
        badge.setTitle(title);
        badge.setDescription(description);
        badge.setRequirements(requirements);
        return ResponseEntity.ok(badgeService.createBadge(badge, file));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Badge> updateBadge(@PathVariable Long id, @RequestBody Badge badge) {
        return ResponseEntity.ok(badgeService.updateBadge(id, badge));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBadge(@PathVariable Long id) {
        badgeService.deleteBadge(id);
        return ResponseEntity.noContent().build();
    }
}