package com.lukas_r_dev.tasuke.comment.service;

import com.lukas_r_dev.tasuke.comment.domain.Comment;
import com.lukas_r_dev.tasuke.comment.dtos.CommentRequest;
import com.lukas_r_dev.tasuke.comment.dtos.CommentResponse;
import com.lukas_r_dev.tasuke.comment.mapper.CommentMapper;
import com.lukas_r_dev.tasuke.comment.repository.CommentRepository;
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
        return commentMapper.toCommentResponse(savedComment);
    }





}
