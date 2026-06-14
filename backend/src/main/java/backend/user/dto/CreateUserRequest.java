package backend.user.dto;
import lombok.*;

@Builder
public record CreateUserRequest(
        String firstName,
        String lastName,
        String email,
        String password,
        String picUrl,
        String department) {}
