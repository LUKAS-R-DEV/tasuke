package com.lukas_r_dev.tasuke.users;

import com.lukas_r_dev.tasuke.AbstractIntegrationTest;
import com.lukas_r_dev.tasuke.users.domain.Role;
import com.lukas_r_dev.tasuke.users.domain.User;
import org.junit.jupiter.api.Test;
import org.springframework.http.MediaType;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

class UsersIntegrationTest extends AbstractIntegrationTest {

    private String adminToken() throws Exception {
        User admin = createUser("Admin", "admin@tasuke.io", Role.ROLE_ADMIN);
        return tokenFor(admin);
    }

    @Test
    void shouldCreateUserAndThenLogin() throws Exception {
        String token = adminToken();
        String body = "{\"name\":\"Cliente Novo\",\"email\":\"cliente@tasuke.io\",\"password\":\"" + DEFAULT_PASSWORD
                + "\",\"role\":\"ROLE_CUSTOMER\"}";

        authorized(post("/users").contentType(MediaType.APPLICATION_JSON).content(body), token)
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.data.email").value("cliente@tasuke.io"));

        login("cliente@tasuke.io");
    }

    @Test
    void shouldRejectDuplicateEmailWithConflict() throws Exception {
        createUser("Cliente", "cliente@tasuke.io", Role.ROLE_CUSTOMER);
        String token = adminToken();
        String body = "{\"name\":\"Outro\",\"email\":\"cliente@tasuke.io\",\"password\":\"segredo123\",\"role\":\"ROLE_CUSTOMER\"}";

        authorized(post("/users").contentType(MediaType.APPLICATION_JSON).content(body), token)
                .andExpect(status().isConflict());
    }

    @Test
    void shouldReturnBadRequestWhenValidationFails() throws Exception {
        String token = adminToken();
        String body = "{\"name\":\"\",\"email\":\"invalido\",\"password\":\"123\",\"role\":\"ROLE_CUSTOMER\"}";

        authorized(post("/users").contentType(MediaType.APPLICATION_JSON).content(body), token)
                .andExpect(status().isBadRequest());
    }

    @Test
    void shouldListOnlyActiveUsersAfterDeactivation() throws Exception {
        String token = adminToken();
        User active = createUser("Ativo", "ativo@tasuke.io", Role.ROLE_CUSTOMER);
        User inactive = createUser("Inativo", "inativo@tasuke.io", Role.ROLE_CUSTOMER);

        authorized(patch("/users/deactivate/" + inactive.getId()), token)
                .andExpect(status().isOk());

        authorized(get("/users"), token)
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data[?(@.email == 'ativo@tasuke.io')]").isNotEmpty())
                .andExpect(jsonPath("$.data[?(@.email == 'inativo@tasuke.io')]").isEmpty());
    }

    @Test
    void shouldReactivateDeactivatedUser() throws Exception {
        String token = adminToken();
        User user = createUser("Inativo", "inativo@tasuke.io", Role.ROLE_CUSTOMER);

        authorized(patch("/users/deactivate/" + user.getId()), token).andExpect(status().isOk());
        authorized(patch("/users/activate/" + user.getId()), token).andExpect(status().isOk());

        authorized(get("/users"), token)
                .andExpect(jsonPath("$.data[?(@.email == 'inativo@tasuke.io')]").isNotEmpty());
    }

    @Test
    void shouldForbidNonAdminFromManagingUsers() throws Exception {
        User customer = createUser("Cliente", "cliente@tasuke.io", Role.ROLE_CUSTOMER);
        String token = tokenFor(customer);
        String body = "{\"name\":\"X\",\"email\":\"x@tasuke.io\",\"password\":\"segredo123\",\"role\":\"ROLE_CUSTOMER\"}";

        authorized(post("/users").contentType(MediaType.APPLICATION_JSON).content(body), token)
                .andExpect(status().isForbidden());
        authorized(get("/users"), token).andExpect(status().isForbidden());
    }

    @Test
    void shouldReturnNotFoundWhenUserDoesNotExist() throws Exception {
        String token = adminToken();

        mockMvc.perform(get("/users/99999").header("Authorization", "Bearer " + token))
                .andExpect(status().isNotFound());
    }
}
