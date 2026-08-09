package com.lukas_r_dev.tasuke.ticket.service;

import com.lukas_r_dev.tasuke.shared.exceptions.DomainException;
import com.lukas_r_dev.tasuke.shared.exceptions.NotFoundException;
import com.lukas_r_dev.tasuke.ticket.domain.Ticket;
import com.lukas_r_dev.tasuke.ticket.domain.TicketStatus;
import com.lukas_r_dev.tasuke.ticket.dtos.TicketRequest;
import com.lukas_r_dev.tasuke.ticket.dtos.TicketResponse;
import com.lukas_r_dev.tasuke.ticket.mapper.TicketMapper;
import com.lukas_r_dev.tasuke.ticket.repository.TicketRepository;
import com.lukas_r_dev.tasuke.users.domain.User;
import com.lukas_r_dev.tasuke.users.service.UserService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.apache.coyote.BadRequestException;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TicketService {
    private final TicketRepository ticketRepository;
    private final TicketMapper ticketMapper;
    private final UserService userService;

    public List<TicketResponse> findAll(){
        return ticketRepository.findAll().stream().map(ticketMapper::toTicketResponse).toList();
    }

    public TicketResponse findById(Long id){
        Ticket ticket = ticketRepository.findById(id).orElseThrow(() -> new NotFoundException("Ticket not found"));
        return ticketMapper.toTicketResponse(ticket);
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
    public TicketResponse setInProgress(Long id){
        Ticket ticket = ticketRepository.findById(id).orElseThrow(() -> new NotFoundException("Ticket not found"));

        if(!ticket.getStatus().equals(TicketStatus.OPEN)){
            throw new DomainException("Ticket is not open");
        }
        ticket.setStatus(TicketStatus.IN_PROGRESS);
        return ticketMapper.toTicketResponse(ticket);
    }
    @Transactional
    public TicketResponse setClosedTicket(Long id){
        Ticket ticket = ticketRepository.findById(id).orElseThrow(() -> new NotFoundException("Ticket not found"));
        if(!ticket.getStatus().equals(TicketStatus.IN_PROGRESS)){
            throw new DomainException("Ticket is not in progress");
        }
        ticket.setStatus(TicketStatus.CLOSED);
        return ticketMapper.toTicketResponse(ticket);
    }

}
