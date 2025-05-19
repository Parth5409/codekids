package com.parth.Backend.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;

@Entity
@Table(name = "user_challenges", 
       uniqueConstraints = @UniqueConstraint(columnNames = {"user_id", "challenge_id"}))
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UserChallenge {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @JsonBackReference
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;
    
    @JsonManagedReference
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "challenge_id")
    private Challenge challenge;
    

    @Column(name = "started_at",nullable = false)
    private LocalDateTime startedAt;

    @Enumerated(EnumType.STRING)
    private ChallengeStatus status = ChallengeStatus.IN_PROGRESS;
    
    private Integer score;
    
    @Column(nullable = false)
    private LocalDateTime timestamp = LocalDateTime.now();
}