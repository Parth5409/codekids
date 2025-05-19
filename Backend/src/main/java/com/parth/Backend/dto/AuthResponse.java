package com.parth.Backend.dto;

import com.parth.Backend.model.Role;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class AuthResponse {
    private String token;
    private Long id;  // Add this field
    private String username;
    private String email;
    private String avatar;
    private Integer points;
    private String country;
    private Role role;
}