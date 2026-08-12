package com.lukas_r_dev.tasuke.comment.service;

import com.lukas_r_dev.tasuke.comment.domain.Comment;
import com.lukas_r_dev.tasuke.comment.dtos.CommentRequest;
import com.lukas_r_dev.tasuke.comment.dtos.CommentResponse;
import com.lukas_r_dev.tasuke.comment.mapper.CommentMapper;
import com.lukas_r_dev.tasuke.comment.repository.CommentRepository;
import com.lukas_r_dev.tasuke.notification.dtos.NotificationRequest;
import com.lukas_r_dev.tasuke.notification.service.NotificationService;
import com.lukas_r_dev.tasuke.shared.exceptions.DomainException;
import com.lukas_r_dev.tasuke.shared.exceptions.NotFoundException;
import com.lukas_r_dev.tasuke.ticket.domain.Ticket;
import com.lukas_r_dev.tasuke.ticket.domain.TicketPriority;
import com.lukas_r_dev.tasuke.ticket.domain.TicketStatus;
import com.lukas_r_dev.tasuke.ticket.repository.TicketRepository;
import com.lukas_r_dev.tasuke.users.domain.Role;
import com.lukas_r_dev.tasuke.users.domain.User;
import com.lukas_r_dev.tasuke.users.service.UserService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.Instant;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class CommentServiceTest {

    @Mock
    private CommentRepository commentRepository;
    @Mock
    private CommentMapper commentMapper;
    @Mock
    private UserService userService;
    @Mock
    private TicketRepository ticketRepository;
    @Mock
    private NotificationService notificationService;
    @InjectMocks
    private CommentService commentService;

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

    private Ticket ticket(TicketStatus status, User owner, User agent) {
        Ticket t = new Ticket();
        t.setId(10L);
        t.setTitle("Título");
        t.setStatus(status);
        t.setPriority(TicketPriority.MEDIUM);
        t.setUser(owner);
        t.setAgent(agent);
        return t;
    }

    private CommentResponse response(String userName) {
        return new CommentResponse(1L, "Mensagem", userName, "Título", Instant.parse("2026-01-01T10:00:00Z"));
    }

    @Test
    void shouldCreateCommentAndNotifyOwnerWhenCommenterIsAgent() {
        User owner = owner();
        User agent = agent();
        Ticket ticket = ticket(TicketStatus.IN_PROGRESS, owner, agent);
        CommentRequest request = new CommentRequest("Mensagem", 10L, agent.getId());
        Comment comment = new Comment();

        when(userService.findByIdActiveTrue(agent.getId())).thenReturn(agent);
        when(ticketRepository.findById(10L)).thenReturn(Optional.of(ticket));
        when(commentMapper.toComment(request)).thenReturn(comment);
        when(commentRepository.save(comment)).thenReturn(comment);
        when(commentMapper.toCommentResponse(comment)).thenReturn(response("Agente"));

        CommentResponse result = commentService.create(request);

        assertThat(result).isNotNull();
        verify(notificationService).create(new NotificationRequest(
                "New comment", "Your ticket has received a new comment", owner.getId()));
    }

    @Test
    void shouldCreateCommentAndNotifyAgentWhenCommenterIsOwner() {
        User owner = owner();
        User agent = agent();
        Ticket ticket = ticket(TicketStatus.IN_PROGRESS, owner, agent);
        CommentRequest request = new CommentRequest("Mensagem", 10L, owner.getId());
        Comment comment = new Comment();

        when(userService.findByIdActiveTrue(owner.getId())).thenReturn(owner);
        when(ticketRepository.findById(10L)).thenReturn(Optional.of(ticket));
        when(commentMapper.toComment(request)).thenReturn(comment);
        when(commentRepository.save(comment)).thenReturn(comment);
        when(commentMapper.toCommentResponse(comment)).thenReturn(response("Dono"));

        commentService.create(request);

        verify(notificationService).create(new NotificationRequest(
                "New comment", "Your ticket has received a new comment", agent.getId()));
    }

    @Test
    void shouldNotCreateNotificationWhenTicketHasNoOtherParticipant() {
        User owner = owner();
        Ticket ticket = ticket(TicketStatus.OPEN, owner, null);
        CommentRequest request = new CommentRequest("Mensagem", 10L, owner.getId());
        Comment comment = new Comment();

        when(userService.findByIdActiveTrue(owner.getId())).thenReturn(owner);
        when(ticketRepository.findById(10L)).thenReturn(Optional.of(ticket));
        when(commentMapper.toComment(request)).thenReturn(comment);
        when(commentRepository.save(comment)).thenReturn(comment);
        when(commentMapper.toCommentResponse(comment)).thenReturn(response("Dono"));

        commentService.create(request);

        verify(notificationService, org.mockito.Mockito.never())
                .create(org.mockito.ArgumentMatchers.any());
    }

    @Test
    void shouldThrowDomainExceptionWhenTicketIsClosed() {
        Ticket ticket = ticket(TicketStatus.CLOSED, owner(), agent());
        CommentRequest request = new CommentRequest("Mensagem", 10L, 1L);
        when(userService.findByIdActiveTrue(1L)).thenReturn(owner());
        when(ticketRepository.findById(10L)).thenReturn(Optional.of(ticket));

        assertThrows(DomainException.class, () -> commentService.create(request));
    }

    @Test
    void shouldThrowNotFoundExceptionWhenTicketDoesNotExist() {
        CommentRequest request = new CommentRequest("Mensagem", 99L, 1L);
        when(userService.findByIdActiveTrue(1L)).thenReturn(owner());
        when(ticketRepository.findById(99L)).thenReturn(Optional.empty());

        assertThrows(NotFoundException.class, () -> commentService.create(request));
    }

    @Test
    void shouldThrowNotFoundExceptionWhenCommenterDoesNotExist() {
        CommentRequest request = new CommentRequest("Mensagem", 10L, 99L);
        when(userService.findByIdActiveTrue(anyLong())).thenThrow(new NotFoundException("User not found"));

        assertThrows(NotFoundException.class, () -> commentService.create(request));
    }
}
