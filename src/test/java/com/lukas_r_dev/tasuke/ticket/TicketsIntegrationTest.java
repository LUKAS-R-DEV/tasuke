package com.lukas_r_dev.tasuke.ticket;

import com.lukas_r_dev.tasuke.AbstractIntegrationTest;
import com.lukas_r_dev.tasuke.users.domain.Role;
import com.lukas_r_dev.tasuke.users.domain.User;
import org.junit.jupiter.api.Test;
import org.springframework.http.MediaType;

import java.time.Duration;

import static org.assertj.core.api.Assertions.assertThat;
import static org.awaitility.Awaitility.await;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

class TicketsIntegrationTest extends AbstractIntegrationTest {

    private User customer;
    private User agent;
    private String customerToken;
    private String agentToken;

    private void setUpUsers() throws Exception {
        customer = createUser("Cliente", "cliente@tasuke.io", Role.ROLE_CUSTOMER);
        agent = createUser("Agente", "agente@tasuke.io", Role.ROLE_AGENT);
        customerToken = tokenFor(customer);
        agentToken = tokenFor(agent);
    }

    private long createTicket(String token, String title) throws Exception {
        String body = objectMapper.writeValueAsString(java.util.Map.of(
                "title", title,
                "description", "Descrição do chamado",
                "userId", customer.getId(),
                "priority", "MEDIUM"));
        String response = authorized(post("/tickets").contentType(MediaType.APPLICATION_JSON).content(body), token)
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.data.status").value("OPEN"))
                .andReturn().getResponse().getContentAsString();
        return objectMapper.readTree(response).path("data").path("id").asLong();
    }

    @Test
    void shouldCreateTicketAsCustomer() throws Exception {
        setUpUsers();
        long ticketId = createTicket(customerToken, "Erro no sistema");

        authorized(get("/tickets/" + ticketId), customerToken)
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.title").value("Erro no sistema"));
    }

    @Test
    void shouldListAllTickets() throws Exception {
        setUpUsers();
        createTicket(customerToken, "Primeiro");
        createTicket(customerToken, "Segundo");

        authorized(get("/tickets"), customerToken)
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.length()").value(2));
    }

    @Test
    void shouldReturnBadRequestWhenTicketValidationFails() throws Exception {
        setUpUsers();
        authorized(post("/tickets")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"title\":\"\",\"description\":\"x\",\"priority\":\"MEDIUM\"}"), customerToken)
                .andExpect(status().isBadRequest());
    }

    @Test
    void shouldMoveTicketToInProgressAndNotifyOwner() throws Exception {
        setUpUsers();
        long ticketId = createTicket(customerToken, "Em andamento");

        authorized(patch("/tickets/in-progress/" + ticketId), agentToken)
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.status").value("IN_PROGRESS"));

        await().atMost(Duration.ofSeconds(5)).untilAsserted(() ->
                assertThat(notificationRepository.findAllByUser(customer))
                        .anyMatch(n -> "Ticket in progress".equals(n.getTitle())));
    }

    @Test
    void shouldRejectSettingInProgressTwice() throws Exception {
        setUpUsers();
        long ticketId = createTicket(customerToken, "Duplo progresso");
        authorized(patch("/tickets/in-progress/" + ticketId), agentToken).andExpect(status().isOk());

        authorized(patch("/tickets/in-progress/" + ticketId), agentToken)
                .andExpect(status().isBadRequest());
    }

    @Test
    void shouldCloseTicketAndNotifyOwner() throws Exception {
        setUpUsers();
        long ticketId = createTicket(customerToken, "Fechar chamado");
        authorized(patch("/tickets/in-progress/" + ticketId), agentToken).andExpect(status().isOk());

        authorized(patch("/tickets/closed/" + ticketId), agentToken)
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.status").value("CLOSED"));

        await().atMost(Duration.ofSeconds(5)).untilAsserted(() ->
                assertThat(notificationRepository.findAllByUser(customer))
                        .anyMatch(n -> "Ticket closed".equals(n.getTitle())));
    }

    @Test
    void shouldRejectClosingOpenTicket() throws Exception {
        setUpUsers();
        long ticketId = createTicket(customerToken, "Aberto");

        authorized(patch("/tickets/closed/" + ticketId), agentToken)
                .andExpect(status().isBadRequest());
    }

    @Test
    void shouldForbidCustomerFromSettingTicketInProgress() throws Exception {
        setUpUsers();
        long ticketId = createTicket(customerToken, "Permissão");

        authorized(patch("/tickets/in-progress/" + ticketId), customerToken)
                .andExpect(status().isForbidden());
    }

    @Test
    void shouldForbidAgentFromCreatingTicket() throws Exception {
        setUpUsers();
        String body = objectMapper.writeValueAsString(java.util.Map.of(
                "title", "x",
                "description", "y",
                "userId", agent.getId(),
                "priority", "LOW"));
        authorized(post("/tickets").contentType(MediaType.APPLICATION_JSON).content(body), agentToken)
                .andExpect(status().isForbidden());
    }

    @Test
    void shouldCommentAndNotifyOtherParticipant() throws Exception {
        setUpUsers();
        long ticketId = createTicket(customerToken, "Comentários");
        authorized(patch("/tickets/in-progress/" + ticketId), agentToken).andExpect(status().isOk());

        String body = objectMapper.writeValueAsString(java.util.Map.of(
                "message", "Preciso de mais detalhes",
                "ticketId", ticketId,
                "userId", customer.getId()));
        authorized(post("/comments").contentType(MediaType.APPLICATION_JSON).content(body), customerToken)
                .andExpect(status().isCreated());

        await().atMost(Duration.ofSeconds(5)).untilAsserted(() ->
                assertThat(notificationRepository.findAllByUser(agent))
                        .anyMatch(n -> "New comment".equals(n.getTitle())));
    }

    @Test
    void shouldRejectCommentOnClosedTicket() throws Exception {
        setUpUsers();
        long ticketId = createTicket(customerToken, "Fechado");
        authorized(patch("/tickets/in-progress/" + ticketId), agentToken).andExpect(status().isOk());
        authorized(patch("/tickets/closed/" + ticketId), agentToken).andExpect(status().isOk());

        String body = objectMapper.writeValueAsString(java.util.Map.of(
                "message", "Depois de fechado",
                "ticketId", ticketId,
                "userId", customer.getId()));
        authorized(post("/comments").contentType(MediaType.APPLICATION_JSON).content(body), customerToken)
                .andExpect(status().isBadRequest());
    }

    @Test
    void shouldReturnNotFoundForMissingTicket() throws Exception {
        setUpUsers();
        mockMvc.perform(get("/tickets/99999").header("Authorization", "Bearer " + customerToken))
                .andExpect(status().isNotFound());
    }
}
