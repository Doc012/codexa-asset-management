package backend.security.jwt;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import lombok.Getter;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Date;
import java.util.Map;
import java.util.UUID;
import java.util.function.Function;

@Slf4j
@Getter
@Component
public class JwtUtil {

    @Value("${jwt.secret}")
    private String secret;

    @Value("${jwt.access-token-expiration}")
    private long accessTokenExpiration;

    @Value("${jwt.refresh-token-expiration}")
    private long refreshTokenExpiration;

    private Key getSigningKey(){
        return Keys.hmacShaKeyFor(secret.getBytes());
    }

    //_______// Token Generation \\_______
    public String generateAccessToken(String email, Map<String, Object> extraClaims){
        return buildToken(email, extraClaims, accessTokenExpiration);
    }

    public String generateRefreshToken(String email){
        return buildToken(email, Map.of(), refreshTokenExpiration);
    }

    private String buildToken(String subject, Map<String, Object> claims, long expiration){
        return Jwts.builder()
                .setClaims(claims)
                .setSubject(subject)
                .setId(UUID.randomUUID().toString())
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + expiration))
                .signWith(getSigningKey(), SignatureAlgorithm.HS256)
                .compact();

    }

    //_______// Token Validation \\_______
    public boolean isTokenValid(String token, String email){
        try {
            final String extractedEmail = extractEmail(email);
            return extractedEmail.equals(email) && !isTokenExpired(token);
        } catch (JwtException e){
            log.warn("JWT validation failed: {}", e.getMessage());
            return false;
        }
    }

    public boolean isTokenExpired(String token){
        return extractExpiration(token).before(new Date());
    }

    //_______// Claims Extraction \\_______
    public String extractEmail(String token){
        return extractClaim(token, Claims::getSubject);
    }

    public String extractTokenId(String token){
        return extractClaim(token, Claims::getId);
    }

    public Date extractExpiration(String token){
        return extractClaim(token, Claims::getExpiration);
    }

    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver){
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    private Claims extractAllClaims(String token){
        return Jwts.parserBuilder()
                .setSigningKey(getSigningKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }
}
