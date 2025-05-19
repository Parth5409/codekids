package com.parth.Backend.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class LeaderboardEntryDto {
    private Long userId;
    private String username;
    private String avatar;
    private Integer points;
    private Integer rank;
    private Integer completedChallenges;
    private Integer earnedBadges;
}