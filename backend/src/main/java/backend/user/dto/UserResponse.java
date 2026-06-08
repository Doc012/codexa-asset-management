package backend.user.dto;

import backend.user.enums.Role;
import lombok.*;

@Builder
public record UserResponse(String fullName, String email,String department, Role role) {
}
