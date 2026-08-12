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
import com.lukas_r_dev.tasuke.ticket.domain.TicketStatus;
import com.lukas_r_dev.tasuke.ticket.repository.TicketRepository;
import com.lukas_r_dev.tasuke.users.domain.User;
import com.lukas_r_dev.tasuke.users.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CommentService {
    private final CommentRepository commentRepository;
    private final CommentMapper commentMapper;
    private final UserService userService;
    private final TicketRepository ticketRepository;
    private final NotificationService notificationService;

    public List<CommentResponse> findByTicketOrderByAsc(Long ticketId){
        return commentRepository.findByTicketIdOrderByCreatedAtAsc(ticketId).stream().map(commentMapper::toCommentResponse).toList();
    }

    public CommentResponse create(CommentRequest commentRequest){
       User user = userService.findByIdActiveTrue(commentRequest.userId());
        Ticket ticket = ticketRepository.findById(commentRequest.ticketId()).orElseThrow(()-> new NotFoundException("Ticket not found"));
        if(ticket.getStatus().equals(TicketStatus.CLOSED)){
            throw new DomainException("Ticket is closed");
        }
        Comment comment = commentMapper.toComment(commentRequest);
        comment.setUser(user);
        comment.setTicket(ticket);

        Comment savedComment = commentRepository.save(comment);
        CommentResponse response = commentMapper.toCommentResponse(savedComment);

        Long recipientId = resolveRecipient(ticket, commentRequest.userId());
        if (recipientId != null) {
            notificationService.create(new NotificationRequest(
                    "New comment",
                    "Your ticket has received a new comment",
                    recipientId
            ));
        }
        return response;
    }

    private Long resolveRecipient(Ticket ticket, Long commenterId) {
        if (ticket.getUser() != null && !ticket.getUser().getId().equals(commenterId)) {
            return ticket.getUser().getId();
        }
        if (ticket.getAgent() != null && !ticket.getAgent().getId().equals(commenterId)) {
            return ticket.getAgent().getId();
        }
        return null;
    }

}
