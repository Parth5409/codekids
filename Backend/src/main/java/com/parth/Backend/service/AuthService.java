package com.parth.Backend.service;

import com.parth.Backend.dto.LoginRequest;
import com.parth.Backend.dto.AuthResponse;
import com.parth.Backend.dto.UserDto;
import com.parth.Backend.exception.AuthenticationFailedException;
import com.parth.Backend.model.UserPrincipal;
import com.parth.Backend.repository.UserRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

@Service
@RequiredArgsConstructor
public class AuthService {
    private final AuthenticationManager authenticationManager;
    private final JWTService jwtService;
    private final UserRepo userRepo;
    private final UserService userService;

    public AuthResponse login(LoginRequest loginRequest) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                    loginRequest.getUsername(),
                    loginRequest.getPassword()
                )
            );
            
            if (authentication.isAuthenticated()) {
                var user = userRepo.findByUsername(loginRequest.getUsername())
                    .orElseThrow(() -> new AuthenticationFailedException("User not found"));
                String token = jwtService.generateToken(user.getUsername());
                
                return new AuthResponse(
                    token,
                    user.getId(),    // Add the user ID here
                    user.getUsername(),
                    user.getEmail(),
                    user.getAvatar(),
                    user.getPoints(),
                    user.getCountry(),
                    user.getRole()
                );
            }
            throw new AuthenticationFailedException("Authentication failed");
        } catch (AuthenticationException e) {
            throw new BadCredentialsException("Invalid username or password");
        }
    }

    @Transactional
    public AuthResponse signup(UserDto userDto, MultipartFile file) {
        UserDto createdUser = userService.createUser(userDto, file);
        String token = jwtService.generateToken(createdUser.getUsername());
        
        return new AuthResponse(
            token,
            createdUser.getId(),    // Add the user ID here
            createdUser.getUsername(),
            createdUser.getEmail(),
            createdUser.getAvatar(),
            createdUser.getPoints(),
            createdUser.getCountry(),
            createdUser.getRole()
        );
    }

    public boolean verifyToken(String token) {
        try {
            String username = jwtService.extractUserName(token);
            return userRepo.findByUsername(username)
                    .map(user -> jwtService.validateToken(token, new UserPrincipal(user)))
                    .orElse(false);
        } catch (Exception e) {
            return false;
        }
    }
}