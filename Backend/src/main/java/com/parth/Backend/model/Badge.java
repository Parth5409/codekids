package com.parth.Backend.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.HashSet;
import java.util.Set;

import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name = "badges")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Badge {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false, unique = true)
    private String title;
    
    @Column(length = 1000)
    private String description;
    
    @Column
    private String imageUrl;
    
    @Column(length = 500)
    private String requirements;

    @JsonIgnore
    @OneToMany(mappedBy = "badge", cascade = CascadeType.ALL)
    private Set<UserBadge> users = new HashSet<>();
}