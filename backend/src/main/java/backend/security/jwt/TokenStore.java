package backend.security.jwt;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Component;

import java.time.Duration;

@Slf4j
@Component
@RequiredArgsConstructor
public class TokenStore {

    private static final String REFRESH_PREFIX = "refresh:";
    private static final String BLACKLIST_PREFIX = "blacklist:";
    private static final String EMAIL_VERIFY_PREFIX = "email_verify:";
    private static final String PWD_RESET_PREFIX = "pwd_reset:";

    private final StringRedisTemplate redis;

    //_______// Refresh Tokens \\_______
    public void saveRefreshToken(String email, String token, long ttlMillis){
        redis.opsForValue().set(REFRESH_PREFIX + email, token, Duration.ofMillis(ttlMillis));
        log.debug("Stored refresh token for {}", email);
    }

    public String getRefreshToken(String email){
        return redis.opsForValue().get(REFRESH_PREFIX + email);
    }

    public void deleteRefreshToken(String email){
        redis.delete(REFRESH_PREFIX + email);
        log.debug("Deleted refresh token for {}", email);
    }

    public boolean isRefreshTokenValid(String email, String token){
        String stored = getRefreshToken(email);
        return stored != null && stored.equals(token);
    }

    //_______// Access Token Blacklist \\_______
    public void blacklistAccessToken(String jti, long remainingTtlMillis){
        if (remainingTtlMillis <= 0) return;
        redis.opsForValue().set(BLACKLIST_PREFIX + jti, "1", Duration.ofMillis(remainingTtlMillis));
        log.debug("Blacklisted token jwt={}", jti);
    }

    public boolean isAccessTokenBlacklisted(String jti){
        return Boolean.TRUE.equals(redis.hasKey(BLACKLIST_PREFIX + jti));
    }

    //_______// Email Verification Token \\_______
    public void saveEmailVerificationToken(String token, String email){
        redis.opsForValue().set(EMAIL_VERIFY_PREFIX + token, email, Duration.ofHours(24));
    }

    public String getEmailForVerificationToken(String token){
        return redis.opsForValue().get(EMAIL_VERIFY_PREFIX + token);
    }

    public void deleteEmailVerificationToken(String token){
        redis.delete(EMAIL_VERIFY_PREFIX + token);
    }

    //_______// Password Reset Tokens \\_______
    public void savePasswordResetToken(String token, String email){
        redis.opsForValue().set(PWD_RESET_PREFIX + token, email, Duration.ofMinutes(15));
    }

    public String getEmailForPasswordRestToken(String token){
        return redis.opsForValue().get(PWD_RESET_PREFIX + token);
    }

    public void deletePasswordResetToken(String token){
        redis.delete(PWD_RESET_PREFIX + token);
    }






}
