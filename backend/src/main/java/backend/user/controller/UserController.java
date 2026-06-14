package backend.user.controller;

import backend.user.dto.CreateUserRequest;
import backend.user.dto.UserResponse;
import backend.user.enums.Role;
import backend.user.model.User;
import backend.user.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/users")
public class UserController {
    private final UserService userService;

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

    @GetMapping("/role/{role}")
    public List<UserResponse> getUsersByRole(@PathVariable Role role){
        return userService.getAllUsersByRole(role);
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
