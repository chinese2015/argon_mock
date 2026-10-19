package com.example.reports;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.io.TempDir;

import java.nio.file.Files;
import java.nio.file.Path;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;

class ReportImporterTest {

    @TempDir
    Path baseDir;

    @Test
    void importsReportInsideDirectory() throws Exception {
        Path reportDir = Files.createDirectories(baseDir.resolve("reports"));
        Files.writeString(reportDir.resolve("monthly.csv"), "month,total\n2026-09,42\n");
        ReportImporter importer = new ReportImporter(reportDir);
        assertEquals("month,total\n2026-09,42\n", importer.importReport("monthly.csv"));
    }

    @Test
    void blocksTraversalOutsideReportDirectory() throws Exception {
        Files.writeString(baseDir.resolve("secret.txt"), "top-secret-demo-value");
        Path reportDir = Files.createDirectories(baseDir.resolve("reports"));
        ReportImporter importer = new ReportImporter(reportDir);
        assertThrows(SecurityException.class, () -> importer.importReport("../secret.txt"));
    }
}
