package com.lukas_r_dev.tasuke.comment.mapper;


import com.lukas_r_dev.tasuke.comment.domain.Comment;
import com.lukas_r_dev.tasuke.comment.dtos.CommentRequest;
import com.lukas_r_dev.tasuke.comment.dtos.CommentResponse;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface CommentMapper {

    Comment toComment(CommentRequest commentRequest);

    @Mapping(target = "userName",source = "user.name")
    @Mapping(target = "ticketTitle",source = "ticket.title")
    CommentResponse toCommentResponse(Comment comment);
}
