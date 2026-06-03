package backend.model;

import backend.enums.Role;
import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
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

   @NotBlank
   @Email
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
