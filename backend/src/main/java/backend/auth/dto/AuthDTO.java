package backend.auth.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public final class AuthDTO {

    private AuthDTO(){}

    //_______// REQUEST DTOs \\_______
    public record RegisterRequest(
            @NotBlank(message = "First name is required")
            String firstName,

            @NotBlank(message = "Last name is required")
            String lastName,

            @NotBlank(message = "Email is required")
            @Email(message = "Invalid email format")
            String email,

            @NotBlank(message = "Password is required")
            @Size(min = 8, message = "Password must be at least 8 characters")
            String password,

            @NotBlank(message = "Department is required")
            String department
    ){}

    public record LoginRequest(
            @NotBlank(message = "Email is required")
            @Email(message = "Invalid email format")
            String email,

            @NotBlank(message = "Password is required")
            String password
    ){}

    public record RefreshTokenRequest(
            @NotBlank(message = "Refresh token is required")
            String refreshToken
    ){}

    public record ForgotPasswordRequest(
            @NotBlank(message = "Email is required")
            @Email(message = "Invalid email format")
            String email
    ){}

    public record ResetPasswordRequest(
            @NotBlank(message = "Token is required")
            String token,

            @NotBlank(message = "New password is required")
            @Size(min = 8, message = "Password must be at least 8 characters")
            String newPassword
    ){}

    public record VerifyEmailRequest(
            @NotBlank(message = "Token is required")
            String token
    ){}

    //_______// RESPONSE DTOs \\_______
    public record AuthResponse(
            String accessToken,
            String refreshToken,
            String tokenType,
            long expiresIn,
            UserInfo user
    ){}

    public record UserInfo(
            String id,
            String firstName,
            String lastName,
            String email,
            String role,
            String department,
            String status
    ){}

    public record MessageResponse(
            String message
    ){}


}
