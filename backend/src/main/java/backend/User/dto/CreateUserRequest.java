package backend.user.dto;
import lombok.*;

@Builder
public record CreateUserRequest(
        String fullName,
        String email,
        String password,
        String department) {}
