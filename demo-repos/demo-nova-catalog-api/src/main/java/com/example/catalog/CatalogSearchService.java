package com.example.catalog;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.List;

/**
 * Search the sample catalog by item name.
 * NOTE: this is a deliberately vulnerable training sample (CWE-89).
 */
public class CatalogSearchService {

    private final String jdbcUrl;

    public CatalogSearchService(String jdbcUrl) {
        this.jdbcUrl = jdbcUrl;
    }

    public List<String> searchByName(String keyword) {
        String sql = "SELECT name FROM catalog_items WHERE name LIKE '%" + keyword + "%'";
        List<String> results = new ArrayList<>();
        try (Connection conn = DriverManager.getConnection(jdbcUrl);
             Statement stmt = conn.createStatement();
             ResultSet rs = stmt.executeQuery(sql)) {
            while (rs.next()) {
                results.add(rs.getString(1));
            }
        } catch (Exception e) {
            throw new IllegalStateException("catalog search failed", e);
        }
        return results;
    }
}
