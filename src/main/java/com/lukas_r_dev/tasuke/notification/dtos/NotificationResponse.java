package com.lukas_r_dev.tasuke.notification.dtos;

import java.time.Instant;

public record NotificationResponse(
        Long id,
        String title,
        String message,
        Boolean isRead,
        Instant createdAt,
        String userName
) {
}
