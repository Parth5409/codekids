package com.parth.Backend.mapper;

import com.parth.Backend.dto.UserDto;
import com.parth.Backend.model.User;
import org.springframework.stereotype.Component;

@Component
public class UserMapper {
    public static UserDto mapToUserDto(User user) {
        UserDto userDto = new UserDto();
        userDto.setId(user.getId());
        userDto.setUsername(user.getUsername());
        userDto.setEmail(user.getEmail());
        userDto.setAvatar(user.getAvatar());
        userDto.setPoints(user.getPoints());
        userDto.setCreatedAt(user.getCreatedAt());
        // We don't map password for security reasons
        return userDto;
    }

    public static User mapToUser(UserDto userDto) {
        User user = new User();
        user.setId(userDto.getId());
        user.setUsername(userDto.getUsername());
        user.setEmail(userDto.getEmail());
        user.setPassword(userDto.getPassword()); // Password will be encrypted in service layer
        user.setAvatar(userDto.getAvatar());
        user.setPoints(userDto.getPoints());
        return user;
    }
}
