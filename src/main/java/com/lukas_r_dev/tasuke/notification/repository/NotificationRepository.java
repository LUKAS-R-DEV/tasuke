package com.lukas_r_dev.tasuke.notification.repository;

import com.lukas_r_dev.tasuke.notification.domain.Notification;
import com.lukas_r_dev.tasuke.users.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface NotificationRepository extends JpaRepository<Notification, Long> {
    List<Notification> findAllByUser(User user);
    Optional<Notification> findByIdAndUser(Long id, User user);
}