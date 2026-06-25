package backend.app.user.controller;

import backend.app.user.dto.CreateUserRequest;
import backend.app.user.dto.UserDTO;
import backend.app.user.dto.UserResponse;
import backend.app.user.enums.Role;
import backend.app.user.model.User;
import backend.app.user.service.UserService;
import backend.auth.dto.AuthDTO;
import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import org.apache.coyote.Response;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/users")
public class UserController {
    private final UserService userService;

    /**
     * debugging purposes:
     * @return
     */
    @GetMapping
    public List<UserResponse> getAllUsers(){
        return userService.getAllUsers();
    }

    @GetMapping("/user/{id}")
    public UserResponse getUserById(@PathVariable Long id){
        return userService.getUserById(id);
    }

    @GetMapping("/user/email/{email}")
    public UserResponse getUserByEmail(@PathVariable String email){
        return userService.getUserByEmail(email);
    }

    @PutMapping("/user/profile/{id}")
    public User updateProfile(@PathVariable Long id, @RequestBody UserDTO.ProfileUpdateRequest request){
        return userService.updateProfile(id, request);
    }

    @GetMapping("/role/{role}")
    public List<UserResponse> getUsersByRole(@PathVariable String role){
        try {
            Role roleReq = Role.valueOf(role.toUpperCase());
            return userService.getAllUsersByRole(roleReq);
        } catch (IllegalArgumentException ex){
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Invalid role. Please enter the correct role." + ex.getMessage()
            );
        }
    }

    @PostMapping
    public UserResponse createUser(@RequestBody CreateUserRequest request){
        return userService.createUser(request);
    }

    @PutMapping("/user/{id}")
    public User updateUserDetails(@RequestBody CreateUserRequest request, @PathVariable Long id){
        return userService.updateUser(request, id);
    }

    @DeleteMapping("/remove/{id}")
    public String deleteUser(@PathVariable Long id){
        return userService.deleteUser(id);
    }

}
