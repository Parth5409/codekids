package com.parth.Backend.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.Set;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.parth.Backend.model.Role;
import com.parth.Backend.model.UserBadge;
import com.parth.Backend.model.UserChallenge;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UserDto {
    private Long id;
    private String username;
    private String email;
    private String password;
    @JsonInclude(JsonInclude.Include.NON_NULL)
    private String avatar;
    private Integer points;
    private String country;
    private LocalDateTime createdAt;
    private Role role;
    private Set<UserBadge> badges;
    private Set<UserChallenge> challenges;
}
