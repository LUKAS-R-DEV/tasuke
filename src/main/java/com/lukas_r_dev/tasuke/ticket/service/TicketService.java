package com.lukas_r_dev.tasuke.ticket.service;

import com.lukas_r_dev.tasuke.notification.dtos.NotificationRequest;
import com.lukas_r_dev.tasuke.notification.service.NotificationService;
import com.lukas_r_dev.tasuke.shared.exceptions.DomainException;
import com.lukas_r_dev.tasuke.shared.exceptions.NotFoundException;
import com.lukas_r_dev.tasuke.ticket.domain.Ticket;
import com.lukas_r_dev.tasuke.ticket.domain.TicketStatus;
import com.lukas_r_dev.tasuke.ticket.dtos.TicketRequest;
import com.lukas_r_dev.tasuke.ticket.dtos.TicketResponse;
import com.lukas_r_dev.tasuke.ticket.mapper.TicketMapper;
import com.lukas_r_dev.tasuke.ticket.repository.TicketRepository;
import com.lukas_r_dev.tasuke.users.domain.User;
import com.lukas_r_dev.tasuke.users.repository.UserRepository;
import com.lukas_r_dev.tasuke.users.service.UserService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TicketService {
    private final TicketRepository ticketRepository;
    private final TicketMapper ticketMapper;
    private final UserService userService;
    private final UserRepository userRepository;
    private final NotificationService notificationService;

    public List<TicketResponse> findAll(){
        return ticketRepository.findAll().stream().map(ticketMapper::toTicketResponse).toList();
    }

    public TicketResponse findById(Long id){
        Ticket ticket = ticketRepository.findById(id).orElseThrow(() -> new NotFoundException("Ticket not found"));
        return ticketMapper.toTicketResponse(ticket);
    }

    public List<TicketResponse> findAllByStatusOpen(){
        return ticketRepository.findAllByStatus(TicketStatus.OPEN).stream().map(ticketMapper::toTicketResponse).toList();
    }


    public TicketResponse create(TicketRequest ticketRequest){
        User user = userService.findByIdActiveTrue(ticketRequest.userId());
        Ticket ticket = ticketMapper.toTicket(ticketRequest);
        ticket.setUser(user);
        ticket.setStatus(TicketStatus.OPEN);
        Ticket savedTicket = ticketRepository.save(ticket);
        return ticketMapper.toTicketResponse(savedTicket);
    }

    @Transactional
    public TicketResponse setInProgress(Long id,Long agentId){
        Ticket ticket = ticketRepository.findById(id).orElseThrow(() -> new NotFoundException("Ticket not found"));
        User agent = userService.findByIdActiveTrue(agentId);
        if(!ticket.getStatus().equals(TicketStatus.OPEN)){
            throw new DomainException("Ticket is not open");
        }
        ticket.setAgent(agent);
        ticket.setStatus(TicketStatus.IN_PROGRESS);
        TicketResponse response = ticketMapper.toTicketResponse(ticket);
        if (ticket.getUser() != null) {
            notificationService.create(new NotificationRequest(
                    "Ticket in progress",
                    "Your ticket is now in progress",
                    ticket.getUser().getId()
            ));
        }
        return response;
    }
    @Transactional
    public TicketResponse setClosedTicket(Long id){
        Ticket ticket = ticketRepository.findById(id).orElseThrow(() -> new NotFoundException("Ticket not found"));
        if(!ticket.getStatus().equals(TicketStatus.IN_PROGRESS)){
            throw new DomainException("Ticket is not in progress");
        }
        ticket.setStatus(TicketStatus.CLOSED);
        TicketResponse response = ticketMapper.toTicketResponse(ticket);
        if (ticket.getUser() != null) {
            notificationService.create(new NotificationRequest(
                    "Ticket closed",
                    "Your ticket has been closed",
                    ticket.getUser().getId()
            ));
        }
        return response;
    }

}
