package com.lukas_r_dev.tasuke.comment.controller;

import com.lukas_r_dev.tasuke.comment.dtos.CommentRequest;
import com.lukas_r_dev.tasuke.comment.dtos.CommentResponse;
import com.lukas_r_dev.tasuke.comment.service.CommentService;
import com.lukas_r_dev.tasuke.shared.response.ApiResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/comments")
@RequiredArgsConstructor
public class CommentController {
    private final CommentService commentService;


    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ApiResponse<CommentResponse> create(@Valid @RequestBody CommentRequest commentRequest){
        return ApiResponse.success(commentService.create(commentRequest),"Comment created successfully");
    }

    @GetMapping("/tickets/{ticketId}/comments")
    @ResponseStatus(HttpStatus.OK)
    public ApiResponse<List<CommentResponse>> getCommentsByTicketId(@PathVariable Long ticketId){
        return ApiResponse.success(commentService.findByTicketOrderByAsc(ticketId));
    }
}
