package backend.app.user.service;

import backend.app.auditLog.enums.ActionType;
import backend.app.auditLog.enums.EntityType;
import backend.app.auditLog.model.AuditLog;
import backend.app.auditLog.service.AuditLogService;
import backend.app.user.dto.CreateUserRequest;
import backend.app.user.dto.UserResponse;
import backend.app.user.enums.Role;
import backend.app.user.model.User;
import backend.app.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepo;
    private final AuditLogService auditLogService;

    /**
     * Getting all users of the system
     * @return a list of all users
     */
    public List<UserResponse> getAllUsers(){
        List<User> allUsers = userRepo.findAll();

        return allUsers.stream()
                .map(user -> new UserResponse(
                        user.getUserId(),
                        user.getFirstName(),
                        user.getLastName(),
                        user.getEmail(),
                        user.getPicUrl(),
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

        return new UserResponse(
                user.getUserId(),
                user.getFirstName(),
                user.getLastName(),
                user.getEmail(),
                user.getPicUrl(),
                user.getDepartment(),
                user.getRole()
        );

    }

    /**
     * Finds a user by their email
     * @param email email address of a user
     * @return a user
     */
    public UserResponse getUserByEmail(String email){
        User user = userRepo.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Email does not exist"
                ));

        return new UserResponse(
                user.getUserId(),
                user.getFirstName(),
                user.getLastName(),
                user.getEmail(),
                user.getPicUrl(),
                user.getDepartment(),
                user.getRole());

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
                        .userId(user.getUserId())
                        .firstName(user.getFirstName())
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
    public UserResponse createUser(CreateUserRequest createUserDto){
        if (userRepo.findByEmail(createUserDto.email()).isPresent()){
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Email " + createUserDto.email() + " already exists"
            );
        }
        User user = User.builder()
                .firstName(createUserDto.firstName())
                .lastName(createUserDto.lastName())
                .email(createUserDto.email())
                .password(createUserDto.password())
                .picUrl(createUserDto.picUrl())
                .department("Unassigned")
                .role(Role.STAFF)
                .build();

        User savedUser = userRepo.save(user);

        AuditLog auditLog = new AuditLog().builder()
                .entityType(EntityType.USER)
                .entityId(savedUser.getUserId())
                .userId(savedUser.getUserId()) // Logged-in  user ID
                .actionType(ActionType.CREATE)
                .oldValue("N/A")
                .newValue("Created User ID: " + savedUser.getUserId())
                .message("Created " + user.getFirstName() + " " + user.getLastName())

                .build();

        auditLogService.createLog(auditLog);

        UserResponse userResponse = UserResponse.builder()
                .userId(savedUser.getUserId())
                .firstName(savedUser.getFirstName())
                .lastName(savedUser.getLastName())
                .email(savedUser.getEmail())
                .picUrl(savedUser.getFirstName())
                .department(savedUser.getDepartment())
                .role(savedUser.getRole())
                .build();


        return userResponse;

    }

    /**
     * Deletes a user from the system
     * @param id user id
     * @return details of the deleted user
     */
    public String deleteUser(Long id){
        User user = userRepo.findById(id).orElseThrow(() ->
                new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found!"));

        AuditLog auditLog = new AuditLog().builder()
                .entityType(EntityType.USER)
                .entityId(user.getUserId())
                .userId(7L) // Logged-in  user ID
                .actionType(ActionType.DELETE)
                .oldValue("N/A")
                .newValue("Deleted User ID: " + user.getUserId())
                .message("Deleted " + user.getFirstName() + " " + user.getLastName())
                .build();

        auditLogService.createLog(auditLog);

        userRepo.delete(user);




        return "User deleted successfully!";
    }

    /**
     * Updates user details
     * @param newUserDetails new user details from a DTO
     * @param id the user id
     */
    public User updateUser(CreateUserRequest newUserDetails, Long id){
        User user = userRepo.findById(id).orElseThrow(() ->
                new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

//        User oldUser = userRepo.findById(id)
//                        .orElseThrow(() -> new ResponseStatusException(
//                                HttpStatus.NOT_FOUND,
//                                "User not found"
//                        ));

        User theUpdater = userRepo.findById(1L)
                        .orElseThrow(() -> new ResponseStatusException(
                                HttpStatus.NOT_FOUND,
                                "User not found"
                        ));

        /**
         * Storing the current values in variables, before updating
         */
        String oldDepartment = user.getDepartment();
        String oldEmail = user.getEmail();
        String oldFirstName = user.getFirstName();
        String oldLastName = user.getLastName();
//        String oldPassword = user.getPassword();
//        String oldPicURL = user.getPicUrl();

        user.setDepartment(newUserDetails.department());
        user.setEmail(newUserDetails.email());
        user.setFirstName(newUserDetails.firstName());
        user.setLastName(newUserDetails.lastName());
        user.setPicUrl(newUserDetails.picUrl());


        if (theUpdater.getRole() == Role.ADMIN){
            if (!java.util.Objects.equals(user.getDepartment(), oldDepartment)){
                AuditLog log = AuditLog.builder()
                        .entityType(EntityType.USER)
                        .entityId(id)
                        .userId(theUpdater.getUserId())
                        .actionType(ActionType.UPDATE)
                        .oldValue(oldDepartment)
                        .newValue(user.getDepartment())
                        .message(theUpdater.getFirstName() + " updated the department of " + user.getFirstName())
                        .build();

                auditLogService.createLog(log);
            }
        }

        if(theUpdater.getRole() == Role.ADMIN){
            if(!java.util.Objects.equals(user.getEmail(), oldEmail)) {
                AuditLog log = AuditLog.builder()
                        .entityType(EntityType.USER)
                        .entityId(id)
                        .userId(user.getUserId())
                        .actionType(ActionType.UPDATE)
                        .oldValue(oldEmail)
                        .newValue(user.getEmail())
                        .message(theUpdater.getFirstName() + " updated the email address of: " + user.getFirstName())
                        .build();
                auditLogService.createLog(log);
            }
        }

        if(theUpdater.getRole() == Role.ADMIN){
            if(!java.util.Objects.equals(user.getFirstName(), oldFirstName)) {
                AuditLog log = AuditLog.builder()
                        .entityType(EntityType.USER)
                        .entityId(id)
                        .userId(user.getUserId())
                        .actionType(ActionType.UPDATE)
                        .oldValue(oldFirstName)
                        .newValue(user.getFirstName())
                        .message(theUpdater.getFirstName() + " updated the first name of: " + oldFirstName)
                        .build();
                auditLogService.createLog(log);
            }
        }

        if(theUpdater.getRole() == Role.ADMIN){
            if(!java.util.Objects.equals(user.getLastName(), oldLastName)) {
                AuditLog log = AuditLog.builder()
                        .entityType(EntityType.USER)
                        .entityId(id)
                        .userId(user.getUserId())
                        .actionType(ActionType.UPDATE)
                        .oldValue(oldLastName)
                        .newValue(user.getFirstName())
                        .message(theUpdater.getFirstName() + " updated the last name of: " + oldLastName)
                        .build();
                auditLogService.createLog(log);
            }
        }

        return userRepo.save(user);
    }


    public String getRole(){
        User theUpdater = userRepo.findById(1L)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "User not found"
                ));
        return theUpdater.getRole().name();
    }
}
