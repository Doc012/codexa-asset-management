package backend.user.service;

import backend.user.dto.CreateUserRequest;
import backend.user.dto.UserResponse;
import backend.user.enums.Role;
import backend.user.model.User;
import backend.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepo;

    /**
     * Getting all users of the system
     * @return a list of all users
     */
    public List<UserResponse> getAllUsers(){
        List<User> allUsers = userRepo.findAll();

        return allUsers.stream()
                .map(user -> new UserResponse(user.getFullName(),
                        user.getEmail(),
                        user.getDepartment(),
                        user.getRole()))
                .toList();
    }

    /**
     * Get a user by their id
     * @param id user id
     * @return a user
     */
    public UserResponse getUserById(Long id){
        User user = userRepo.findById(id).orElseThrow(() ->
                new ResponseStatusException(HttpStatus.NOT_FOUND,
                        "User with id " + id + "not found!"));

        return UserResponse.builder()
                .fullName(user.getFullName())
                .email(user.getEmail())
                .department(user.getDepartment())
                .role(user.getRole())
                .build();
    }

    /**
     * Finds a user by their email
     * @param email email address of a user
     * @return a user
     */
    public UserResponse getUserByEmail(String email){
        User user = userRepo.findByEmail(email);
        return UserResponse.builder()
                .fullName(user.getFullName())
                .email(user.getEmail())
                .department(user.getDepartment())
                .role(user.getRole())
                .build();
    }

    /**
     * Getting all users by their roles
     * @param role role of a user
     * @return a list of users by their roles
     */
    public List<UserResponse> getAllUsersByRole(Role role){
        List<User> users = userRepo.findByRole(role);

        List<UserResponse> userResponse = users.stream()
                .map(user -> UserResponse.builder()
                        .fullName(user.getFullName())
                        .email(user.getEmail())
                        .department(user.getDepartment())
                        .role(user.getRole())
                        .build())
                .toList();

        return userResponse;
    }

    /**
     * Adding a new user to the system
     * @param createUserDto the new user to be added
     * @return the details of the added user
     */
    public User createUser(CreateUserRequest createUserDto){
        User user = User.builder()
                .fullName(createUserDto.fullName())
                .email(createUserDto.email())
                .password(createUserDto.password())
                .department(createUserDto.email())
                .role(Role.STAFF)
                .build();


        return userRepo.save(user);
    }

    /**
     * Deletes a user from the system
     * @param id user id
     * @return details of the deleted user
     */
    public User deleteUser(Long id){
        User user = userRepo.findById(id).orElseThrow(() ->
                new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found!"));
        userRepo.delete(user);
        return user;
    }

    /**
     * Updates user details
     * @param newUserDetails new user details
     * @param id the user id
     */
    public void updateUser(User newUserDetails, Long id){
        User user = userRepo.findById(id).orElseThrow(() ->
                new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        user.setDepartment(newUserDetails.getDepartment());
        user.setEmail(newUserDetails.getEmail());
        user.setFullName(newUserDetails.getFullName());
        user.setPassword(newUserDetails.getPassword());

    }


}
