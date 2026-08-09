package com.lukas_r_dev.tasuke.comment.dtos;

import java.time.Instant;

public record CommentResponse(Long id, String message, String userName, String ticketTitle, Instant createdAt) {
}
