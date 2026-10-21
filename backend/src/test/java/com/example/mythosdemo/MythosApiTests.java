package com.example.mythosdemo;
import com.example.mythosdemo.domain.*;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.web.servlet.MockMvc;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import static org.hamcrest.Matchers.*;
@SpringBootTest
@AutoConfigureMockMvc
@TestPropertySource(properties={"spring.datasource.url=jdbc:h2:mem:mythos-test;DB_CLOSE_DELAY=-1","spring.jpa.hibernate.ddl-auto=create-drop","notification.mode=preview","notification.outbox-dir=./target/test-outbox"})
class MythosApiTests {
    @Autowired MockMvc mvc;
    @Autowired SubscriptionRepository subs;
    @Test void syntheticFindingsAreServed() throws Exception {
        mvc.perform(get("/api/findings")).andExpect(status().isOk()).andExpect(jsonPath("$",hasSize(234)))
           .andExpect(jsonPath("$[0].application").value("DEMO-APP-001"));
    }
    @Test void requestSubscriptionStaysPendingBeforeEmailConfirmation() throws Exception {
        String body="{\"email\":\"integration@example.test\",\"minRisk\":\"HIGH\",\"frequency\":\"DAILY\",\"appCode\":\"DEMO-APP-001\"}";
        mvc.perform(post("/api/subscriptions").contentType("application/json").content(body))
           .andExpect(status().isAccepted());
        org.junit.jupiter.api.Assertions.assertTrue(subs.findAll().stream().anyMatch(s->s.email.equals("integration@example.test")&&s.status.equals("PENDING")));
    }
    @Test void unknownFindingIsNotFound() throws Exception {
        mvc.perform(get("/api/findings/NOT-REAL")).andExpect(status().isNotFound());
    }
}
