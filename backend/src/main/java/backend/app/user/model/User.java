package backend.app.user.model;

import backend.app.user.enums.Status;
import backend.app.user.enums.Role;
import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "users")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "user_id")
    private Long userId;

   @NotBlank
   @Column(name = "first_name", nullable = false)
   private String firstName;

   @Column(name = "last_name", nullable = false)
   private String lastName;

   @NotBlank(message = "Email cannot be blank")
   @Email(message = "Invalid email")
   @Column(name = "email", nullable = false, unique = true)
   private String email;

   @Enumerated(EnumType.STRING)
   private Role role;

   @Enumerated(EnumType.STRING)
   private Status status;

   @Column(name = "profile_picture_url")
   private String picUrl;

   @NotBlank
   private String password;

   @NotBlank
   private String department;

   @CreationTimestamp
   private LocalDateTime createdAt;

}
