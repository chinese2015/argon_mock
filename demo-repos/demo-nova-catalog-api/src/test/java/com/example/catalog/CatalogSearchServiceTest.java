package com.example.catalog;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.Statement;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

class CatalogSearchServiceTest {

    static final String URL = "jdbc:h2:mem:catalog;DB_CLOSE_DELAY=-1";

    private final CatalogSearchService service = new CatalogSearchService(URL);

    @BeforeEach
    void seed() throws Exception {
        try (Connection c = DriverManager.getConnection(URL); Statement s = c.createStatement()) {
            s.execute("CREATE TABLE IF NOT EXISTS catalog_items(name VARCHAR(200))");
            s.execute("DELETE FROM catalog_items");
            s.execute("INSERT INTO catalog_items VALUES ('red scarf'), ('blue mug'), ('green pen')");
        }
    }

    @Test
    void findsMatchingItems() {
        List<String> results = service.searchByName("red");
        assertEquals(List.of("red scarf"), results);
    }

    @Test
    void maliciousInputReturnsNothing() {
        List<String> results = service.searchByName("' OR '1'='1");
        assertTrue(results.isEmpty(), "injection payload must not return rows, got: " + results);
    }
}
