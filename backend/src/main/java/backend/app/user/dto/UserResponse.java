package backend.app.user.dto;

import backend.app.user.enums.Role;
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
