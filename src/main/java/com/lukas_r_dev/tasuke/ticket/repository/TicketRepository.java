package com.lukas_r_dev.tasuke.ticket.repository;

import com.lukas_r_dev.tasuke.ticket.domain.Ticket;
import com.lukas_r_dev.tasuke.ticket.domain.TicketStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface TicketRepository extends JpaRepository<Ticket, Long> {
    Optional<Ticket> findByIdAndStatus(Long id, TicketStatus status);
    List<Ticket> findAllByStatus(TicketStatus status);
}
