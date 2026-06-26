package backend.app.user.dto;

import backend.app.user.enums.Role;
import backend.app.user.enums.Status;
import lombok.Builder;

public class UserDTO {
    @Builder
    public record CreateUserRequest(
            String firstName,
            String lastName,
            String email,
            String password,
            String picUrl,
            String department
    ) {}

    @Builder
    public record UserResponse(
            Long userId,
            String firstName,
            String lastName,
            String email,
            String picUrl,
            String department,
            Role role
    ) {}

    public record ProfileUpdateRequest(
            String firstName,
            String lastName,
            String picUrl
    ){}

    public record ChangePasswordRequest(
            String currentPassword,
            String newPassword
    ){}

    public record ChangeStatus(
            Long userId,
            Status userStatus
    ){}
}
