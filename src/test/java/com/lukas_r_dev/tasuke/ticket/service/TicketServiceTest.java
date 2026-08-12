package com.lukas_r_dev.tasuke.ticket.service;

import com.lukas_r_dev.tasuke.notification.dtos.NotificationRequest;
import com.lukas_r_dev.tasuke.notification.service.NotificationService;
import com.lukas_r_dev.tasuke.shared.exceptions.DomainException;
import com.lukas_r_dev.tasuke.shared.exceptions.NotFoundException;
import com.lukas_r_dev.tasuke.ticket.domain.Ticket;
import com.lukas_r_dev.tasuke.ticket.domain.TicketPriority;
import com.lukas_r_dev.tasuke.ticket.domain.TicketStatus;
import com.lukas_r_dev.tasuke.ticket.dtos.TicketRequest;
import com.lukas_r_dev.tasuke.ticket.dtos.TicketResponse;
import com.lukas_r_dev.tasuke.ticket.mapper.TicketMapper;
import com.lukas_r_dev.tasuke.ticket.repository.TicketRepository;
import com.lukas_r_dev.tasuke.users.domain.Role;
import com.lukas_r_dev.tasuke.users.domain.User;
import com.lukas_r_dev.tasuke.users.repository.UserRepository;
import com.lukas_r_dev.tasuke.users.service.UserService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class TicketServiceTest {

    @Mock
    private TicketRepository ticketRepository;
    @Mock
    private TicketMapper ticketMapper;
    @Mock
    private UserService userService;
    @Mock
    private UserRepository userRepository;
    @Mock
    private NotificationService notificationService;
    @InjectMocks
    private TicketService ticketService;

    private User owner() {
        User u = new User();
        u.setId(1L);
        u.setName("Dono");
        u.setRole(Role.ROLE_CUSTOMER);
        return u;
    }

    private User agent() {
        User u = new User();
        u.setId(2L);
        u.setName("Agente");
        u.setRole(Role.ROLE_AGENT);
        return u;
    }

    private Ticket ticket(Long id, TicketStatus status, User owner) {
        Ticket t = new Ticket();
        t.setId(id);
        t.setTitle("Título do ticket");
        t.setDescription("Descrição do ticket");
        t.setStatus(status);
        t.setPriority(TicketPriority.MEDIUM);
        t.setUser(owner);
        t.setCreatedAt(Instant.parse("2026-01-01T10:00:00Z"));
        t.setUpdatedAt(Instant.parse("2026-01-01T10:00:00Z"));
        return t;
    }

    private TicketResponse response(Ticket t) {
        return new TicketResponse(t.getId(), t.getTitle(), t.getDescription(), t.getStatus(),
                t.getPriority(), "Dono", null, t.getCreatedAt(), t.getUpdatedAt());
    }

    @Test
    void shouldCreateTicketWithOpenStatusWhenUserIsActive() {
        User owner = owner();
        TicketRequest request = new TicketRequest("Título do ticket", "Descrição do ticket", 1L, TicketPriority.HIGH);
        Ticket ticket = ticket(99L, null, null);
        when(userService.findByIdActiveTrue(1L)).thenReturn(owner);
        when(ticketMapper.toTicket(request)).thenReturn(ticket);
        when(ticketRepository.save(ticket)).thenReturn(ticket);
        when(ticketMapper.toTicketResponse(ticket)).thenReturn(response(ticket));

        TicketResponse result = ticketService.create(request);

        assertThat(result).isNotNull();
        assertThat(ticket.getStatus()).isEqualTo(TicketStatus.OPEN);
        assertThat(ticket.getUser()).isSameAs(owner);
        verify(ticketRepository).save(ticket);
    }

    @Test
    void shouldThrowNotFoundExceptionWhenCreatingTicketWithMissingUser() {
        TicketRequest request = new TicketRequest("Título", "Descrição", 99L, TicketPriority.MEDIUM);
        when(userService.findByIdActiveTrue(99L)).thenThrow(new NotFoundException("User not found"));

        assertThrows(NotFoundException.class, () -> ticketService.create(request));
        verify(ticketRepository, never()).save(any());
    }

    @Test
    void shouldMoveTicketToInProgressAndNotifyOwnerWhenTicketIsOpen() {
        User owner = owner();
        User agent = agent();
        Ticket ticket = ticket(10L, TicketStatus.OPEN, owner);
        when(ticketRepository.findById(10L)).thenReturn(Optional.of(ticket));
        when(userService.findByIdActiveTrue(2L)).thenReturn(agent);
        when(ticketMapper.toTicketResponse(ticket)).thenReturn(response(ticket));

        ticketService.setInProgress(10L, 2L);

        assertThat(ticket.getStatus()).isEqualTo(TicketStatus.IN_PROGRESS);
        assertThat(ticket.getAgent()).isEqualTo(agent);
        verify(notificationService).create(new NotificationRequest(
                "Ticket in progress", "Your ticket is now in progress", owner.getId()));
    }

    @Test
    void shouldThrowDomainExceptionWhenMovingNonOpenTicketToInProgress() {
        Ticket ticket = ticket(10L, TicketStatus.CLOSED, owner());
        when(ticketRepository.findById(10L)).thenReturn(Optional.of(ticket));
        when(userService.findByIdActiveTrue(2L)).thenReturn(agent());

        assertThrows(DomainException.class, () -> ticketService.setInProgress(10L, 2L));
    }

    @Test
    void shouldThrowNotFoundExceptionWhenTicketToProgressDoesNotExist() {
        when(ticketRepository.findById(anyLong())).thenReturn(Optional.empty());

        assertThrows(NotFoundException.class, () -> ticketService.setInProgress(99L, 2L));
    }

    @Test
    void shouldThrowNotFoundExceptionWhenAgentIsMissingOrInactive() {
        Ticket ticket = ticket(10L, TicketStatus.OPEN, owner());
        when(ticketRepository.findById(10L)).thenReturn(Optional.of(ticket));
        when(userService.findByIdActiveTrue(99L)).thenThrow(new NotFoundException("User not found"));

        assertThrows(NotFoundException.class, () -> ticketService.setInProgress(10L, 99L));
    }

    @Test
    void shouldCloseTicketAndNotifyOwnerWhenInProgress() {
        User owner = owner();
        Ticket ticket = ticket(10L, TicketStatus.IN_PROGRESS, owner);
        when(ticketRepository.findById(10L)).thenReturn(Optional.of(ticket));
        when(ticketMapper.toTicketResponse(ticket)).thenReturn(response(ticket));

        ticketService.setClosedTicket(10L);

        assertThat(ticket.getStatus()).isEqualTo(TicketStatus.CLOSED);
        verify(notificationService).create(new NotificationRequest(
                "Ticket closed", "Your ticket has been closed", owner.getId()));
    }

    @Test
    void shouldThrowDomainExceptionWhenClosingNonInProgressTicket() {
        Ticket ticket = ticket(10L, TicketStatus.OPEN, owner());
        when(ticketRepository.findById(10L)).thenReturn(Optional.of(ticket));

        assertThrows(DomainException.class, () -> ticketService.setClosedTicket(10L));
    }

    @Test
    void shouldThrowNotFoundExceptionWhenClosingTicketThatDoesNotExist() {
        when(ticketRepository.findById(anyLong())).thenReturn(Optional.empty());

        assertThrows(NotFoundException.class, () -> ticketService.setClosedTicket(99L));
    }

    @Test
    void shouldReturnAllOpenTickets() {
        Ticket open = ticket(1L, TicketStatus.OPEN, owner());
        when(ticketRepository.findAllByStatus(TicketStatus.OPEN)).thenReturn(List.of(open));
        when(ticketMapper.toTicketResponse(open)).thenReturn(response(open));

        List<TicketResponse> result = ticketService.findAllByStatusOpen();

        assertThat(result).hasSize(1);
        assertThat(result.get(0).status()).isEqualTo(TicketStatus.OPEN);
    }

    @Test
    void shouldThrowNotFoundExceptionWhenTicketByIdDoesNotExist() {
        when(ticketRepository.findById(anyLong())).thenReturn(Optional.empty());

        assertThrows(NotFoundException.class, () -> ticketService.findById(99L));
    }
}
