package backend.User.controller;

import backend.User.service.UserService;
import backend.User.enums.Role;
import backend.User.model.User;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/users")
public class UserController {
    private final UserService userService;

    @GetMapping
    public List<User> getAllUsers(){
        return userService.getAllUsers();
    }

    @GetMapping("/user/{id}")
    public User getUserById(@PathVariable Long id){
        return userService.getUserById(id);
    }

    @GetMapping("/email/{email}")
    public User getUserByEmail(@PathVariable String email){
        return userService.getUserByEmail(email);
    }

    @GetMapping("/role/{role}")
    public List<User> getUsersByRole(@PathVariable Role role){
        return userService.getAllUsersByRole(role);
    }

    @PostMapping
    public User addUser(@RequestBody User user){
        return userService.addUser(user);
    }

    @PutMapping("/{id}")
    public void updateUserDetails(@RequestBody User user, @PathVariable Long id){
        userService.updateUser(user, id);
    }

    @DeleteMapping("/remove/{id}")
    public User deleteUser(@PathVariable Long id){
        return userService.deleteUser(id);
    }

}
