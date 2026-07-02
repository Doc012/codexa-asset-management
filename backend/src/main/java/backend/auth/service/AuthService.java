package backend.auth.service;

import backend.app.user.dto.UserDTO;
import backend.app.user.enums.Role;
import backend.app.user.enums.Status;
import backend.app.user.model.User;
import backend.app.user.repository.UserRepository;
import backend.auth.dto.AuthDTO;
import backend.security.jwt.JwtUtil;
import backend.security.jwt.TokenStore;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.Date;
import java.util.Map;
import java.util.Objects;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authManager;
    private final JwtUtil jwtUtil;
    private final TokenStore tokenStore;
    private final EmailService emailService;

    //_______// Registration \\_______
    @Transactional
    public AuthDTO.MessageResponse register(AuthDTO.RegisterRequest request){
        if (userRepository.existsByEmail(request.email())){
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "An account with this email already exists."
            );
        }

        User user = User.builder()
                .firstName(request.firstName())
                .lastName(request.lastName())
                .email(request.email())
                .password(passwordEncoder.encode(request.password()))
                .role(Role.STAFF)
                .department(request.department())
                .status(Status.PENDING_VERIFICATION)
                .build();

        userRepository.save(user);

        String verifyToken = UUID.randomUUID().toString();
        tokenStore.saveEmailVerificationToken(verifyToken, user.getEmail());

        emailService.sendVerificationEmail(user.getEmail(), user.getFirstName(), verifyToken);

        log.info("User registered: {}", user.getEmail());
        return  new AuthDTO.MessageResponse("Registration successful. Please check your email to verify your account.");
    }

    //_______// Login \\_______
    public AuthDTO.AuthResponse login(AuthDTO.LoginRequest request){
        try {
            authManager.authenticate(new UsernamePasswordAuthenticationToken(request.email(), request.password()));
        } catch(DisabledException e){
            User user = userRepository.findByEmail(request.email())
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found."));

            String message = switch (user.getStatus()){
                case PENDING_VERIFICATION -> "Your email is not verified. Please check your inbox.";
                case PENDING_APPROVAL -> "Your account is pending admin approval.";
                case INACTIVE -> "Your account has been deactivated. Contact support.";
                default -> "Your account is not active.";
            };

            throw new ResponseStatusException(HttpStatus.FORBIDDEN, message);
        }
        catch (BadCredentialsException e){
            throw new ResponseStatusException(
                    HttpStatus.UNAUTHORIZED,
                    "Invalid email or password."
            );
        }

        User user = userRepository.findByEmail(request.email())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "User not found."
                ));

        if (user.getStatus() == Status.PENDING_VERIFICATION){
            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN,
                    "Email not verified. Please check your inbox."
            );
        }
        if (user.getStatus() == Status.PENDING_APPROVAL){
            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN,
                    "You account needs admin approval"
            );
        }

        if (user.getStatus() == Status.INACTIVE){
            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN,
                    "Your account has been deactivated."
            );
        }

        return buildAuthResponse(user);
    }

    //_______// Token Refresh \\_______
    public AuthDTO.AuthResponse refreshToken(AuthDTO.RefreshTokenRequest request){
        String refreshToken = request.refreshToken();

        String email;

        try {
            email = jwtUtil.extractEmail(refreshToken);
        } catch (Exception e){
            throw new ResponseStatusException(
                    HttpStatus.UNAUTHORIZED,
                    "Invalid refresh token."
            );
        }

        if (!tokenStore.isRefreshTokenValid(email, refreshToken)){
            throw new ResponseStatusException(
                    HttpStatus.UNAUTHORIZED,
                    "Refresh token is expired or invalid. Please log in again."
            );
        }

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "User not found."
                ));

        tokenStore.deleteRefreshToken(email);
        return buildAuthResponse(user);
    }

    //_______// Logout \\_______
    public AuthDTO.MessageResponse logout(String accessToken){
        try {
            String email = jwtUtil.extractEmail(accessToken);
            String jti = jwtUtil.extractTokenId(accessToken);
            Date exp = jwtUtil.extractExpiration(accessToken);
            long remaining = exp.getTime() - System.currentTimeMillis();

            tokenStore.blacklistAccessToken(jti, remaining);
            tokenStore.deleteRefreshToken(email);

            log.info("User logged out: {}", email);
        } catch (Exception e){
            log.warn("Logout attempted with invalid token: {}", e.getMessage());
        }

        return new AuthDTO.MessageResponse("Logged out successfully.");

    }

    //_______// Email Verification \\_______
    @Transactional
    public AuthDTO.MessageResponse verifyEmail(String token){
        String email = tokenStore.getEmailForVerificationToken(token);
        if (email == null) {

            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Verification link is invalid or has expired"
            );
        }

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "User not found."
                ));

        if (user.getStatus() == Status.ACTIVE){
            return new AuthDTO.MessageResponse("Email is already verified.");
        }

        user.setStatus(Status.PENDING_APPROVAL);
        userRepository.save(user);
        tokenStore.deleteEmailVerificationToken(token);

        log.info("Email verified for: {}", email);
        return new AuthDTO.MessageResponse("Email verified successfully. You may now log in to your account, or wait for administrator approval if required.");
    }

    //_______// Forgot Password \\_______
    public AuthDTO.MessageResponse forgotPassword(AuthDTO.ForgotPasswordRequest request){
        userRepository.findByEmail(request.email()).ifPresent(user -> {
            String resetToken = UUID.randomUUID().toString();
            tokenStore.savePasswordResetToken(resetToken, user.getEmail());
            emailService.sendPasswordResetEmail(user.getEmail(), user.getFirstName(), resetToken);

            log.info("Password reset email sent to: {}", user.getEmail());
        });

        return new AuthDTO.MessageResponse("If an account with that email exists, a password reset link has been sent.");
    }


    //_______// Reset Password \\_______
    @Transactional
    public AuthDTO.MessageResponse resetPassword(AuthDTO.ResetPasswordRequest request){
        String email = tokenStore.getEmailForPasswordRestToken(request.token());

        if (email == null) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Reset link os invalid or has expired (15 min window)."
            );
        }

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "User not found."
                ));

        user.setPassword(passwordEncoder.encode(request.newPassword()));
        userRepository.save(user);

        tokenStore.deletePasswordResetToken(request.token());
        tokenStore.deleteRefreshToken(email);

        log.info("Password reset for: {}", email);
        return new AuthDTO.MessageResponse("Password has been reset successfully. Please log in.");
    }

    //_______// Private Helpers \\_______
    private AuthDTO.AuthResponse buildAuthResponse(User user){
        Map<String, Object> claims = Map.of(
                "role", user.getRole().name(),
                "firstName", user.getFirstName(),
                "lastName", user.getLastName()
        );

        String accessToken = jwtUtil.generateAccessToken(user.getEmail(), claims);
        String refreshToken = jwtUtil.generateRefreshToken(user.getEmail());

        tokenStore.saveRefreshToken(user.getEmail(), refreshToken, jwtUtil.getRefreshTokenExpiration());

        return new AuthDTO.AuthResponse(
                accessToken,
                refreshToken,
                "Bearer",
                jwtUtil.getAccessTokenExpiration(),
                new AuthDTO.UserInfo(
                        user.getUserId().toString(),
                        user.getFirstName(),
                        user.getLastName(),
                        user.getEmail(),
                        user.getRole().name(),
                        user.getDepartment(),
                        user.getStatus().name()
                )
        );
    }

    //_______// Change Password \\_______
    public void changePassword(Long id, UserDTO.ChangePasswordRequest request){
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "User not found"
                ));

        if (passwordEncoder.matches(request.currentPassword(), user.getPassword())){
            user.setPassword(passwordEncoder.encode(request.newPassword()));
            log.info("User status {}", user.getStatus());
            userRepository.save(user);
        } else {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "The current password you entered is incorrect");
        }
    }
}
