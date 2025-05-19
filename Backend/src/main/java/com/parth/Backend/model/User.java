package com.parth.Backend.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(unique = true, nullable = false)
    private String username;
    
    @Column(unique = true, nullable = false)
    private String email;
    
    @Column(nullable = false)
    private String password;
    
    private String avatar;
    
    private Integer points = 0;
    
    private String country;  // Add this field
    
    @CreationTimestamp
    private LocalDateTime createdAt;
    
    @Enumerated(EnumType.STRING)
    private Role role = Role.ROLE_USER;
    
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
    private Set<UserBadge> badges = new HashSet<>();
    
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
    private Set<UserChallenge> challenges = new HashSet<>();
}
