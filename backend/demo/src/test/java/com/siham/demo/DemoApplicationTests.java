package com.siham.demo;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

@SpringBootTest
@ActiveProfiles("test")
class DemoApplicationTests {
    @Test
    void contextLoads() {
        // This test will pass if the application context loads successfully
    }
}