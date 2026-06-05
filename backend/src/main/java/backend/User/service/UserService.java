package backend.User.service;

import backend.User.enums.Role;
import backend.User.model.User;
import backend.User.repository.UserRepository;
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
    public List<User> getAllUsers(){
        return userRepo.findAll();
    }

    /**
     * Get a user by their id
     * @param id user id
     * @return a user
     */
    public User getUserById(Long id){
        return userRepo.findById(id).orElseThrow(() ->
                new ResponseStatusException(HttpStatus.NOT_FOUND,
                        "User with id " + id + "not found!"));
    }

    /**
     * Finds a user by their email
     * @param email email address of a user
     * @return a user
     */
    public User getUserByEmail(String email){
        return userRepo.findByEmail(email);
    }

    /**
     * Getting all users by their roles
     * @param role role of a user
     * @return a list of users by their roles
     */
    public List<User> getAllUsersByRole(Role role){
        return userRepo.findByRole(role);
    }

    /**
     * Adding a new user to the system
     * @param newUser the new user to be added
     * @return the details of the added user
     */
    public User addUser(User newUser){
        return userRepo.save(newUser);
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
