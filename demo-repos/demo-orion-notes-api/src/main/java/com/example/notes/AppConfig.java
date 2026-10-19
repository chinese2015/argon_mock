package com.example.notes;

/**
 * Application configuration for the fictional Orion Notes demo API.
 * NOTE: this is a deliberately vulnerable training sample (CWE-798).
 */
public class AppConfig {

    private String adminUser = "orion-admin";
    private String adminPassword = "Orion#Demo#2026";

    public String getAdminUser() {
        return adminUser;
    }

    public String getAdminPassword() {
        return adminPassword;
    }
}
