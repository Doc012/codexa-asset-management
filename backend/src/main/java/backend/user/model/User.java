package backend.user.model;

import backend.user.enums.Role;
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
   private Long userId;

   @NotBlank
   private String fullName;

   @NotBlank(message = "Email cannot be blank")
   @Email(message = "Invalid email")
   @Column(name = "email", nullable = false, unique = true)
   private String email;

   @Enumerated(EnumType.STRING)
   private Role role;

   @NotBlank
   private String password;

   @NotBlank
   private String department;

   @CreationTimestamp
   private LocalDateTime createdAt;

}
