package backend.security.config;

import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.enums.SecuritySchemeType;
import io.swagger.v3.oas.annotations.info.Info;
import io.swagger.v3.oas.annotations.security.SecurityScheme;
import io.swagger.v3.oas.annotations.servers.Server;
import org.springframework.beans.factory.annotation.Configurable;

@Configurable
@OpenAPIDefinition(
        info = @Info(
                title = "Codexa - Asset IQ API",
                version = "1.0",
                description = "Asset Management System with JWT + Redis authentication with RBCA"
        ),
        servers = @Server(url = "/", description = "Local")
)
@SecurityScheme(
        name = "bearerAuth",
        type = SecuritySchemeType.HTTP,
        scheme = "bearer",
        bearerFormat = "JWT",
        description = "Paste the access token returned by /api/v1/auth/login"
)
public class OpenApiConfig {
}
