package backend.user.dto;

public record CreateUserRequest(
        String fullName,
        String email,
        String password,
        String department) {}
