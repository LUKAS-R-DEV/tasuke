package com.lukas_r_dev.tasuke.security;

import com.lukas_r_dev.tasuke.AbstractIntegrationTest;
import com.lukas_r_dev.tasuke.users.domain.Role;
import com.lukas_r_dev.tasuke.users.domain.User;
import org.junit.jupiter.api.Test;
import org.springframework.http.MediaType;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

class AuthIntegrationTest extends AbstractIntegrationTest {

    @Test
    void shouldLoginAndReturnAuthenticatedUser() throws Exception {
        createUser("Ana", "ana@tasuke.io", Role.ROLE_ADMIN);
        String token = login("ana@tasuke.io");

        mockMvc.perform(get("/auth/me").header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.email").value("ana@tasuke.io"))
                .andExpect(jsonPath("$.data.role").value("ROLE_ADMIN"));
    }

    @Test
    void shouldRejectLoginWithInvalidCredentials() throws Exception {
        createUser("Ana", "ana@tasuke.io", Role.ROLE_ADMIN);

        mockMvc.perform(post("/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"email\":\"ana@tasuke.io\",\"password\":\"wrong-password\"}"))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.message").value("Credenciais inválidas"));
    }

    @Test
    void shouldRejectLoginWithNonexistentEmail() throws Exception {
        mockMvc.perform(post("/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"email\":\"nao-existe@tasuke.io\",\"password\":\"qualquer\"}"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void shouldReturnTokenContainingSubjectEmail() throws Exception {
        User user = createUser("Ana", "ana@tasuke.io", Role.ROLE_ADMIN);

        String token = tokenFor(user);

        assertThat(token).isNotBlank();
        assertThat(new String(java.util.Base64.getUrlDecoder().decode(token.split("\\.")[1])))
                .contains("ana@tasuke.io");
    }

    @Test
    void shouldRequireAuthenticationForProtectedRoutes() throws Exception {
        mockMvc.perform(get("/tickets"))
                .andExpect(status().isUnauthorized());
    }
}
