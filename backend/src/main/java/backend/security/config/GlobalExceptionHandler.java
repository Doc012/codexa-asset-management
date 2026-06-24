package backend.security.config;

import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ProblemDetail;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.DisabledException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.server.ResponseStatusException;

import java.nio.file.AccessDeniedException;
import java.util.Map;
import java.util.stream.Collectors;

@Slf4j
@RestControllerAdvice
public class GlobalExceptionHandler {

    //_______// Validations errors (@Valid failures) \\_______
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ProblemDetail handleValidation(MethodArgumentNotValidException ex){
        Map<String, String> fieldErrors = ex.getBindingResult().getFieldErrors().stream()
                .collect(Collectors.toMap(
                        FieldError::getField,
                        fe -> fe.getDefaultMessage() == null ? "Invalid value" : fe.getDefaultMessage(),
                        (a, b) -> a
                ));

        ProblemDetail detail = ProblemDetail.forStatus(HttpStatus.BAD_REQUEST);
        detail.setTitle("Validation Failed");
        detail.setDetail("One or more fields are invalid.");
        detail.setProperty("errors", fieldErrors);

        return detail;
    }

    //_______// HTTP status exceptions (ResponseStatusException) \\_______
    @ExceptionHandler(ResponseStatusException.class)
    public ProblemDetail handleResponseStatus(ResponseStatusException ex){
        ProblemDetail detail = ProblemDetail.forStatus(ex.getStatusCode());
        detail.setTitle(ex.getReason() != null ? ex.getReason() : "Request Error");
        detail.setDetail(ex.getMessage());

        return detail;
    }

    //_______// Wrong credentials \\_______
    @ExceptionHandler(BadCredentialsException.class)
    public ProblemDetail handleBadCredentials(BadCredentialsException ex){
        ProblemDetail detail = ProblemDetail.forStatus(HttpStatus.UNAUTHORIZED);
        detail.setTitle("Unauthorized");
        detail.setDetail("Invalid email or password.");

        return detail;
    }

    //_______// Disabled account \\_______
    @ExceptionHandler(DisabledException.class)
    public ProblemDetail handleDisable(DisabledException ex){
        ProblemDetail detail = ProblemDetail.forStatus(HttpStatus.FORBIDDEN);
        detail.setTitle("Account Not Active");
        detail.setDetail("This account is not active. Please verify your email or contact support.");
        return detail;
    }


    //_______// RBAC - user is authenticated but lacks permission \\_______
    @ExceptionHandler(AccessDeniedException.class)
    public ProblemDetail handleAccessDenied(AccessDeniedException ex){
        ProblemDetail detail = ProblemDetail.forStatus(HttpStatus.FORBIDDEN);
        detail.setTitle("Forbidden");
        detail.setDetail("You do not have permission to access this resource.");

        return detail;
    }

    //_______// Catch-all \\_______
    @ExceptionHandler(Exception.class)
    public ProblemDetail handleGeneral(Exception ex){
        log.error("Unhandled exception: {}", ex.getMessage(), ex);
        ProblemDetail detail = ProblemDetail.forStatus(HttpStatus.INTERNAL_SERVER_ERROR);
        detail.setTitle("Internal server error");
        detail.setDetail("An unexpected error occurred. Please try again later.");

        return detail;
    }
}
