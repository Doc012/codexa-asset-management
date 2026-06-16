package backend.user.dto;

import backend.user.enums.Role;
import lombok.*;

@Builder
public record UserResponse(
        Long userId,
        String firstName,
        String lastName,
        String email,
        String picUrl,
        String department,
        Role role) {
}
