package com.parth.Backend.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;

import com.fasterxml.jackson.annotation.JsonBackReference;

@Entity
@Table(name = "challenges")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Challenge {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String title;
    
    @Column(length = 1000)
    private String description;
    
    @Enumerated(EnumType.STRING)
    private Difficulty difficulty;
    
    private Integer points;
    
    @ElementCollection
    @CollectionTable(name = "challenge_test_cases")
    @Column(name = "test_case", columnDefinition = "TEXT")
    private List<String> testCases = new ArrayList<>();
    
    @Column(columnDefinition = "TEXT")
    private String codeBlocks;
    
    @Column(columnDefinition = "TEXT")
    private String solutionLogic;
    
    @JsonBackReference
    @OneToMany(mappedBy = "challenge")
    private Set<UserChallenge> userChallenges;
    
    private boolean active = true;
}