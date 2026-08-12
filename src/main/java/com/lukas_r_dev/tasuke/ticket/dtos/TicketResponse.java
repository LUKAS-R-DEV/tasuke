package com.lukas_r_dev.tasuke.ticket.dtos;

import com.lukas_r_dev.tasuke.ticket.domain.TicketPriority;
import com.lukas_r_dev.tasuke.ticket.domain.TicketStatus;

import java.time.Instant;

public record TicketResponse(Long id, String title, String description, TicketStatus status, TicketPriority priority, String userName,String agentName,
                             Instant createdAt, Instant updatedAt) {
}
