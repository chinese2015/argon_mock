package com.example.notes;

import org.junit.jupiter.api.Test;

import java.nio.file.Files;
import java.nio.file.Path;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotEquals;

class AppConfigSecurityTest {

    @Test
    void noHardcodedAdminPassword() throws Exception {
        Path source = Path.of("src/main/java/com/example/notes/AppConfig.java");
        String code = Files.readString(source);
        assertFalse(code.matches("(?s).*adminPassword\\s*=\\s*\"[^\"]+\".*"),
                "adminPassword must not be assigned a hardcoded literal in source");
    }

    @Test
    void leakedDemoPasswordNotPresent() {
        assertNotEquals("Orion#Demo#2026", new AppConfig().getAdminPassword(),
                "the leaked demo password must not be returned");
    }
}
