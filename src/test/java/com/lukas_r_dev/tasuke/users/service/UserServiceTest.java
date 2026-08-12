package com.lukas_r_dev.tasuke.users.service;

import com.lukas_r_dev.tasuke.shared.exceptions.ConflictException;
import com.lukas_r_dev.tasuke.shared.exceptions.NotFoundException;
import com.lukas_r_dev.tasuke.users.domain.Role;
import com.lukas_r_dev.tasuke.users.domain.User;
import com.lukas_r_dev.tasuke.users.dtos.UserRequest;
import com.lukas_r_dev.tasuke.users.dtos.UserResponse;
import com.lukas_r_dev.tasuke.users.mapper.UserMapper;
import com.lukas_r_dev.tasuke.users.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class UserServiceTest {

    @Mock
    private UserRepository userRepository;
    @Mock
    private UserMapper userMapper;
    @Mock
    private PasswordEncoder passwordEncoder;
    @InjectMocks
    private UserService userService;

    private User user;
    private UserResponse response;

    @BeforeEach
    void setUp() {
        user = new User();
        user.setId(1L);
        user.setName("Ana Ribeiro");
        user.setEmail("ana@tasuke.io");
        user.setRole(Role.ROLE_ADMIN);
        user.setActive(true);
        user.setCreatedAt(Instant.parse("2026-01-01T10:00:00Z"));

        response = new UserResponse(1L, "Ana Ribeiro", "ana@tasuke.io", Role.ROLE_ADMIN, true,
                Instant.parse("2026-01-01T10:00:00Z"), Instant.parse("2026-01-01T10:00:00Z"));
    }

    @Test
    void shouldSaveUserWithEncodedPasswordWhenEmailDoesNotExist() {
        UserRequest request = new UserRequest("Ana Ribeiro", "ana@tasuke.io", "123456", Role.ROLE_ADMIN);

        when(userRepository.existsByEmailIgnoreCase("ana@tasuke.io")).thenReturn(false);
        when(userMapper.toUser(request)).thenReturn(user);
        when(passwordEncoder.encode("123456")).thenReturn("encoded-password");
        when(userRepository.save(user)).thenReturn(user);
        when(userMapper.toUserResponse(user)).thenReturn(response);

        UserResponse result = userService.save(request);

        assertThat(result).isEqualTo(response);
        verify(passwordEncoder).encode("123456");
        verify(userRepository).save(user);
    }

    @Test
    void shouldThrowConflictExceptionWhenEmailAlreadyExists() {
        UserRequest request = new UserRequest("Ana Ribeiro", "ana@tasuke.io", "123456", Role.ROLE_ADMIN);
        when(userRepository.existsByEmailIgnoreCase("ana@tasuke.io")).thenReturn(true);

        assertThrows(ConflictException.class, () -> userService.save(request));
        verify(userRepository, never()).save(any());
    }

    @Test
    void shouldReturnOnlyActiveUsersWhenFindingAll() {
        User inactive = new User();
        inactive.setId(2L);
        inactive.setActive(false);
        UserResponse activeResponse = response;
        when(userRepository.findAllByActiveTrue()).thenReturn(List.of(user));
        when(userMapper.toUserResponse(user)).thenReturn(activeResponse);

        List<UserResponse> result = userService.findAll();

        assertThat(result).extracting(UserResponse::email).containsExactly("ana@tasuke.io");
        verify(userMapper, never()).toUserResponse(inactive);
    }

    @Test
    void shouldThrowNotFoundExceptionWhenFindingUserByIdThatDoesNotExist() {
        when(userRepository.findById(anyLong())).thenReturn(Optional.empty());

        assertThrows(NotFoundException.class, () -> userService.findById(99L));
    }

    @Test
    void shouldThrowNotFoundExceptionWhenFindingActiveUserThatIsInactive() {
        when(userRepository.findByIdAndActiveTrue(anyLong())).thenReturn(Optional.empty());

        assertThrows(NotFoundException.class, () -> userService.findByIdActiveTrue(99L));
    }

    @Test
    void shouldThrowUsernameNotFoundExceptionWhenFindingEmailThatDoesNotExist() {
        when(userRepository.findByEmail(anyString())).thenReturn(Optional.empty());

        assertThrows(UsernameNotFoundException.class, () -> userService.findByEmail("missing@tasuke.io"));
    }

    @Test
    void shouldUpdateUserFieldsWhenUserExists() {
        UserRequest request = new UserRequest("Ana Atualizada", "ana@tasuke.io", "654321", Role.ROLE_AGENT);
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        when(userMapper.toUserResponse(user)).thenReturn(response);

        UserResponse result = userService.update(1L, request);

        assertThat(result).isNotNull();
        verify(userMapper).toUserUpdate(user, request);
    }

    @Test
    void shouldThrowNotFoundExceptionWhenUpdatingUserThatDoesNotExist() {
        when(userRepository.findById(anyLong())).thenReturn(Optional.empty());

        assertThrows(NotFoundException.class,
                () -> userService.update(99L, new UserRequest("X", "x@tasuke.io", "123456", Role.ROLE_CUSTOMER)));
    }

    @Test
    void shouldDeactivateUserWhenUserExists() {
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        when(userMapper.toUserResponse(user)).thenReturn(response);

        userService.deactivate(1L);

        assertThat(user.isActive()).isFalse();
    }

    @Test
    void shouldActivateUserWhenUserExists() {
        user.setActive(false);
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        when(userMapper.toUserResponse(user)).thenReturn(response);

        userService.activate(1L);

        assertThat(user.isActive()).isTrue();
    }

    @Test
    void shouldThrowNotFoundExceptionWhenDeactivatingUserThatDoesNotExist() {
        when(userRepository.findById(anyLong())).thenReturn(Optional.empty());

        assertThrows(NotFoundException.class, () -> userService.deactivate(99L));
    }
}
