package com.lukas_r_dev.tasuke.ticket.mapper;


import com.lukas_r_dev.tasuke.ticket.domain.Ticket;
import com.lukas_r_dev.tasuke.ticket.dtos.TicketRequest;
import com.lukas_r_dev.tasuke.ticket.dtos.TicketResponse;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface TicketMapper {

    Ticket toTicket(TicketRequest ticketRequest);

    @Mapping(target = "userName", source = "user.name")
    TicketResponse toTicketResponse(Ticket ticket);
}
