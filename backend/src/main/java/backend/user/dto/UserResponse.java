package backend.user.dto;

import backend.user.enums.Role;
import lombok.*;

@Builder
public record UserResponse(
        Long id,
        String fullName,
        String email,
        String department,
        Role role) {
}
