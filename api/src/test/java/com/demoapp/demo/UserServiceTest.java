package com.demoapp.demo;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;

import com.demoapp.demo.repository.UserRepository;
import com.demoapp.demo.service.UserService;

public class UserServiceTest {
    private UserService userService;
 
    @BeforeEach
    void setUp() {
        UserRepository mockRepo = Mockito.mock(UserRepository.class);
        userService = new UserService(mockRepo);
    }

    @Test
    void isPasswordValid_senhaForte_deveRetornarTrue() {
        assertTrue(userService.isPasswordValid("Senh@123"));
    }
 
    @Test
    void isPasswordValid_semCaractereEspecial_deveRetornarFalse() {
        assertFalse(userService.isPasswordValid("Senha123"));
    }
 
    @Test
    void isEmailValid_emailSemDominio_deveRetornarFalse() {
        assertFalse(userService.isEmailValid("emailpadrao@"));
    }

}
