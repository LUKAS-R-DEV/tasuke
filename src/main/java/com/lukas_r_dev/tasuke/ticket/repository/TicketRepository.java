package com.lukas_r_dev.tasuke.ticket.repository;

import com.lukas_r_dev.tasuke.ticket.domain.Ticket;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TicketRepository extends JpaRepository<Ticket, Long> {
    
}
