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

        return buildUser(user);
    }

    /**
     * Finds a user by their email
     * @param email email address of a user
     * @return a user
     */
    public UserResponse getUserByEmail(String email){
        User user = userRepo.findByEmail(email);
        return buildUser(user);
    }

    public UserResponse buildUser(User user){
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

        return users.stream()
                .map(user -> UserResponse.builder()
                        .fullName(user.getFullName())
                        .email(user.getEmail())
                        .department(user.getDepartment())
                        .role(user.getRole())
                        .build())
                .toList();
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
    public UserResponse deleteUser(Long id){
        User user = userRepo.findById(id).orElseThrow(() ->
                new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found!"));
        userRepo.delete(user);


        return UserResponse.builder()
                .fullName(user.getFullName())
                .build();
    }

    /**
     * Updates user details
     * @param newUserDetails new user details from a DTO
     * @param id the user id
     */
    public User updateUser(CreateUserRequest newUserDetails, Long id){
        User user = userRepo.findById(id).orElseThrow(() ->
                new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        user.setDepartment(newUserDetails.department());
        user.setEmail(newUserDetails.email());
        user.setFullName(newUserDetails.fullName());
        user.setPassword(newUserDetails.password());

        return userRepo.save(user);
    }


}
