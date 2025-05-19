package com.parth.Backend.controller;

import com.parth.Backend.dto.UserDto;
import com.parth.Backend.model.UserBadge;
import com.parth.Backend.model.UserChallenge;
import com.parth.Backend.service.UserService;
import lombok.RequiredArgsConstructor;

import java.util.Set;

import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class UserController {
    private final UserService userService;

    @GetMapping("/{id}")
    public ResponseEntity<UserDto> getUser(@PathVariable Long id) {
        return ResponseEntity.ok(userService.getUserById(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<UserDto> updateUser(
            @PathVariable Long id, 
            @RequestBody UserDto userDto) {
        return ResponseEntity.ok(userService.updateUser(id, userDto));
    }

    @GetMapping("/{id}/badges")
    public ResponseEntity<Set<UserBadge>> getUserBadges(@PathVariable Long id) {
        return ResponseEntity.ok(userService.getUserBadges(id));
    }

    @GetMapping("/{id}/challenges")
    public ResponseEntity<Set<UserChallenge>> getUserChallenges(@PathVariable Long id) {
        return ResponseEntity.ok(userService.getUserChallenges(id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping(
        value = "/{id}/avatar",
        consumes = MediaType.MULTIPART_FORM_DATA_VALUE
    )
    public ResponseEntity<UserDto> uploadAvatar(
            @PathVariable Long id,
            @RequestParam("file") MultipartFile file) {
        return ResponseEntity.ok(userService.updateAvatar(id, file));
    }
}