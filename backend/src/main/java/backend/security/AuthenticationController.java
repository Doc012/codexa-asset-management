package backend.security;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthenticationController {

    private AuthenticationService authenticationService;

    @GetMapping("/login")
    public ResponseEntity<String> login(@RequestBody LoginDTO request){
        authenticationService.login(request);

        return ResponseEntity.ok("Login successful");
    }
}
