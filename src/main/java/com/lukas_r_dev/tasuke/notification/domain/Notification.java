package com.lukas_r_dev.tasuke.notification.domain;

import com.lukas_r_dev.tasuke.users.domain.User;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.mapstruct.Mapping;

import java.time.Instant;
import java.time.LocalDateTime;

@Entity
@Table(name = "notification")
@Setter
@Getter

public class Notification {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String title;
    private String message;
    private Instant createdAt;
    private Boolean isRead = false;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    @PrePersist
    public void prePersist() {
        this.createdAt = Instant.now();
    }

    public void markIsRead(){
        this.isRead = true;
    }
}
