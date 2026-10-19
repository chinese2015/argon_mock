package com.example.reports;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;

/**
 * Imports report files from the configured report directory.
 * NOTE: this is a deliberately vulnerable training sample (CWE-22).
 */
public class ReportImporter {

    private final Path reportDir;

    public ReportImporter(Path reportDir) {
        this.reportDir = reportDir;
    }

    public String importReport(String fileName) {
        try {
            return Files.readString(reportDir.resolve(fileName));
        } catch (IOException e) {
            throw new IllegalStateException("cannot read report " + fileName, e);
        }
    }
}
