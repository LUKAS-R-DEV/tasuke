package com.lukas_r_dev.tasuke.users.repository;
import com.lukas_r_dev.tasuke.users.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;


public interface UserRepository extends JpaRepository<User, Long> {
List<User>findAllByActiveTrue();
boolean existsByEmailIgnoreCase(String email);
Optional<User> findByEmailIgnoreCase(String email);

}
