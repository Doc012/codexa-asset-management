package backend.auth.controller;

import backend.app.user.dto.UserDTO;
import backend.auth.dto.AuthDTO;
import backend.auth.service.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.time.Duration;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
@Tag(name = "Authentication", description = "Registration, login, token management, and password flow")
public class AuthController {
    private final AuthService authService;

    @PostMapping("/register")
    @Operation(summary = "Register a new user", description = "Creates a PENDING account and sends a verification email.")
    public ResponseEntity<AuthDTO.MessageResponse> register(@Valid @RequestBody AuthDTO.RegisterRequest request){
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(authService.register(request));
    }

    @PostMapping("/login")
    @Operation(summary = "Login", description = "Returns access + refresh tokens. Account must be ACTIVE (email verified")
    public ResponseEntity<AuthDTO.AuthResponse> login(@Valid @RequestBody AuthDTO.LoginRequest request, HttpServletResponse response){
        AuthDTO.AuthResponse authResponse = authService.login(request);

        ResponseCookie cookie = ResponseCookie.from("refreshToken", authResponse.refreshToken())
                .httpOnly(true)
                .secure(true)
                .path("/api/v1/auth")
                .maxAge(Duration.ofDays(7))
                .sameSite("Strict")
                .build();

        response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());
        AuthDTO.AuthResponse bodyWithoutRefreshToken = new AuthDTO.AuthResponse(
                authResponse.accessToken(),
                null,
                authResponse.tokenType(),
                authResponse.expiresIn(),
                authResponse.user()
        );


        return ResponseEntity.ok(bodyWithoutRefreshToken);
    }

    @PostMapping("/refresh")
    @Operation(summary = "Refresh access token", description = "Exchanges a valid refresh token for anew access token + refresh token pair")
    public ResponseEntity<AuthDTO.AuthResponse> refresh(@CookieValue(name = "refreshToken", required = false) String refreshToken, HttpServletResponse response){
        if (refreshToken == null){
            throw new ResponseStatusException(
                    HttpStatus.UNAUTHORIZED,
                    "No refresh token found."
            );
        }

        AuthDTO.AuthResponse authResponse = authService.refreshToken(new AuthDTO.RefreshTokenRequest(refreshToken));

        ResponseCookie cookie = ResponseCookie.from("refreshToken", authResponse.refreshToken())
                .httpOnly(true)
                .secure(true)
                .path("/api/v1/auth")
                .maxAge(Duration.ofDays(7))
                .sameSite("Strict")
                .build();

        response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());

        AuthDTO.AuthResponse bodyWithoutRefreshToken = new AuthDTO.AuthResponse(
                authResponse.accessToken(),
                null,
                authResponse.tokenType(),
                authResponse.expiresIn(),
                authResponse.user()
        );
        return ResponseEntity.ok(bodyWithoutRefreshToken);
    }

    @PostMapping("/logout")
    @Operation(summary = "Logout", description = "Blacklists the current access token and removes the refresh token from Redis.")
    public ResponseEntity<AuthDTO.MessageResponse> logout(@RequestHeader("Authorization") String authHeader){
        String token = authHeader.startsWith("Bearer ") ? authHeader.substring(7) : authHeader;

        return ResponseEntity.ok(authService.logout(token));
    }

    @GetMapping("/verify-email")
    @Operation(summary = "Verify email address", description = "Activates the user account. Token is a UUID from the verification email.")
    public ResponseEntity<AuthDTO.MessageResponse> verifyEmail(@RequestParam String token){
        return ResponseEntity.ok(authService.verifyEmail(token));
    }

    @PostMapping("/forgot-password")
    @Operation(summary = "Request a password reset link", description = "Send a reset email if the email address is registered (always returns 200 to prevent enumeration).")
    public ResponseEntity<AuthDTO.MessageResponse> forgotPassword(@Valid @RequestBody AuthDTO.ForgotPasswordRequest request){
        return ResponseEntity.ok(authService.forgotPassword(request));
    }

    @PostMapping("/reset-password")
    @Operation(summary = "Reset password using the emailed token", description = "Token expires after 15 minutes. All active sessions are invalidated on success.")
    public ResponseEntity<AuthDTO.MessageResponse> resetPassword(@Valid @RequestBody AuthDTO.ResetPasswordRequest request){
        return ResponseEntity.ok(authService.resetPassword(request));
    }

    @PutMapping("/change-password/{id}")
    @Operation(summary = "Change password", description = "Uses the logged in user to change the password")
    public ResponseEntity<String> changePassword(@PathVariable Long id, @RequestBody UserDTO.ChangePasswordRequest request){
        authService.changePassword(id, request);

        return ResponseEntity.ok("Password changed successfully.");
    }

}
