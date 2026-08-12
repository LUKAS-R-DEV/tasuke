package com.lukas_r_dev.tasuke.ticket.controller;

import com.lukas_r_dev.tasuke.shared.response.ApiResponse;
import com.lukas_r_dev.tasuke.ticket.domain.Ticket;
import com.lukas_r_dev.tasuke.ticket.dtos.TicketRequest;
import com.lukas_r_dev.tasuke.ticket.dtos.TicketResponse;
import com.lukas_r_dev.tasuke.ticket.service.TicketService;
import com.lukas_r_dev.tasuke.users.domain.User;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/tickets")
@RequiredArgsConstructor
public class TicketController {
    private final TicketService ticketService;

    @GetMapping
    @ResponseStatus(HttpStatus.OK)
    public ApiResponse<List<TicketResponse>> findAll(){
        return ApiResponse.success(ticketService.findAll());
    }
    @GetMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    public ApiResponse<TicketResponse> findById(@PathVariable Long id){
        return ApiResponse.success(ticketService.findById(id));
    }
    @PreAuthorize("hasAnyAuthority('ROLE_CUSTOMER','ROLE_ADMIN')")
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ApiResponse<TicketResponse> create(@Valid @RequestBody TicketRequest ticketRequest,@AuthenticationPrincipal User user){

      TicketRequest request = new TicketRequest(ticketRequest.title(),ticketRequest.description(), user.getId(),ticketRequest.priority());
      return ApiResponse.success(ticketService.create(request),"Ticket created successfully");
    }
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN','ROLE_AGENT')")
    @PatchMapping("/in-progress/{id}")
    @ResponseStatus(HttpStatus.OK)
    public ApiResponse<TicketResponse> setInProgress(@PathVariable Long id,@AuthenticationPrincipal User user){
        return ApiResponse.success(ticketService.setInProgress(id,user.getId()),"Ticket set to in progress");
    }
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN','ROLE_AGENT')")
    @PatchMapping("/closed/{id}")
    @ResponseStatus(HttpStatus.OK)
    public ApiResponse<TicketResponse> setClosed(@PathVariable Long id){
        return ApiResponse.success(ticketService.setClosedTicket(id),"Ticket set to closed");
    }

}
