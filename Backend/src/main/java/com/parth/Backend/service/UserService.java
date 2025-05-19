package com.parth.Backend.service;

import com.parth.Backend.dto.UserDto;
import com.parth.Backend.exception.ResourceNotFoundException;
import com.parth.Backend.exception.UserAlreadyExistsException;
import com.parth.Backend.mapper.UserMapper;
import com.parth.Backend.model.User;
import com.parth.Backend.model.UserBadge;
import com.parth.Backend.model.UserChallenge;
import com.parth.Backend.repository.UserRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.Set;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepo userRepo;
    private final PasswordEncoder passwordEncoder;
    private final CloudinaryService cloudinaryService;

    @Transactional
    public UserDto createUser(UserDto userDto, MultipartFile file) {
        if (userRepo.existsByUsername(userDto.getUsername())) {
            throw new UserAlreadyExistsException("Username already exists");
        }
        if (userRepo.existsByEmail(userDto.getEmail())) {
            throw new UserAlreadyExistsException("Email already exists");
        }

        User user = UserMapper.mapToUser(userDto);
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        user.setPoints(0);

        if (file != null && !file.isEmpty()) {
            String avatarUrl = cloudinaryService.uploadFile(file);
            user.setAvatar(avatarUrl);
        }

        User savedUser = userRepo.save(user);
        return UserMapper.mapToUserDto(savedUser);
    }

    public UserDto getUserById(Long id) {
        User user = userRepo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        return UserMapper.mapToUserDto(user);
    }

    @Transactional
    public UserDto updateUser(Long id, UserDto userDto) {
        User user = userRepo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        
        if (userDto.getUsername() != null) {
            if (!user.getUsername().equals(userDto.getUsername()) && 
                userRepo.existsByUsername(userDto.getUsername())) {
                throw new UserAlreadyExistsException("Username already exists");
            }
            user.setUsername(userDto.getUsername());
        }
        
        if (userDto.getEmail() != null) {
            if (!user.getEmail().equals(userDto.getEmail()) && 
                userRepo.existsByEmail(userDto.getEmail())) {
                throw new UserAlreadyExistsException("Email already exists");
            }
            user.setEmail(userDto.getEmail());
        }
        
        if (userDto.getPassword() != null) {
            user.setPassword(passwordEncoder.encode(userDto.getPassword()));
        }
        
        if (userDto.getAvatar() != null) {
            user.setAvatar(userDto.getAvatar());
        }
        
        if (userDto.getCountry() != null) {
            user.setCountry(userDto.getCountry());
        }
        
        User updatedUser = userRepo.save(user);
        return UserMapper.mapToUserDto(updatedUser);
    }

    @Transactional
    public void deleteUser(Long id) {
        if (!userRepo.existsById(id)) {
            throw new ResourceNotFoundException("User not found");
        }
        userRepo.deleteById(id);
    }

    public Set<UserBadge> getUserBadges(Long id) {
        return userRepo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"))
                .getBadges();
    }

    public Set<UserChallenge> getUserChallenges(Long id) {
        return userRepo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"))
                .getChallenges();
    }

    @Transactional
    public void updateUserPoints(Long id, Integer points) {
        User user = userRepo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        user.setPoints(user.getPoints() + points);
        userRepo.save(user);
    }

    @Transactional
    public UserDto updateAvatar(Long id, MultipartFile file) {
        User user = userRepo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        // Delete old avatar if exists
        if (user.getAvatar() != null) {
            cloudinaryService.deleteFile(user.getAvatar());
        }

        // Upload new avatar
        String avatarUrl = cloudinaryService.uploadFile(file);
        user.setAvatar(avatarUrl);
        
        User updatedUser = userRepo.save(user);
        return UserMapper.mapToUserDto(updatedUser);
    }
}