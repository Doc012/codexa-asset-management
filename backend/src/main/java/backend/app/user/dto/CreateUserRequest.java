package backend.app.user.dto;
import backend.app.user.enums.Role;
import backend.app.user.enums.Status;
import lombok.*;

@Builder
public record CreateUserRequest(
        String firstName,
        String lastName,
        String email,
        String password,
        String picUrl,
        String department,
        Status status,
        Role role) {}
