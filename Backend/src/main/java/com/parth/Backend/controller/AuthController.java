package com.parth.Backend.controller;

import com.parth.Backend.dto.AuthResponse;
import com.parth.Backend.dto.LoginRequest;
import com.parth.Backend.dto.UserDto;
import com.parth.Backend.service.AuthService;
import lombok.RequiredArgsConstructor;

import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class AuthController {
    private final AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody LoginRequest loginRequest) {
        return ResponseEntity.ok(authService.login(loginRequest));
    }

    @PostMapping(value = "/signup", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<AuthResponse> signup(
            @RequestParam("file") MultipartFile file,
            @RequestParam("username") String username,
            @RequestParam("email") String email,
            @RequestParam("password") String password,
            @RequestParam(value = "country", required = false) String country) {
        UserDto userDto = new UserDto();
        userDto.setUsername(username);
        userDto.setEmail(email);
        userDto.setPassword(password);
        userDto.setCountry(country);
        return ResponseEntity.ok(authService.signup(userDto, file));
    }

    @GetMapping("/verify")
    public ResponseEntity<Boolean> verifyToken(@RequestHeader("Authorization") String token) {
        token = token.substring(7); // Remove "Bearer " prefix
        return ResponseEntity.ok(authService.verifyToken(token));
    }
}