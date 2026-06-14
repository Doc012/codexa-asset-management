package backend.auth.service;

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
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.Map;
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
                .status(Status.PENDING)
                .build();

        userRepository.save(user);

        String verifyToken = UUID.randomUUID().toString();
        tokenStore.saveEmailVerificationToken(verifyToken, user.getFirstName());

        emailService.sendVerificationEmail(user.getEmail(), user.getFirstName(), verifyToken);

        log.info("User registered: {}", user.getEmail());
        return  new AuthDTO.MessageResponse("Registration successful. Please check your email to verify your account.");
    }

    //_______// Login \\_______
    public AuthDTO.AuthResponse login(AuthDTO.LoginRequest request){
        try {
            authManager.authenticate(new UsernamePasswordAuthenticationToken(request.email(), request.password()));
        } catch (BadCredentialsException e){
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

        if (user.getStatus() == Status.PENDING){
            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN,
                    "Email not verified. Please check your inbox."
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
    //_______// Email Verification \\_______
    //_______// Forgot Password \\_______
    //_______// Reset Password \\_______


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


}
