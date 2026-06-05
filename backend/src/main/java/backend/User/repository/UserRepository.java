package backend.User.repository;

import backend.User.enums.Role;
import backend.User.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    List<User> findByRole(Role role);

    User findByEmail(String email);
}
