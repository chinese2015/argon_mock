package com.example.argondemo.domain;
import jakarta.persistence.*;
import java.time.Instant;
@Entity
@Table(name="remediation_cases")
public class RemediationCase {
    @Id public String id;
    public String findingId;
    @Column(length=250) public String title;
    public String owner;
    public String priority;
    @Column(length=2000) public String description;
    public Instant createdAt;
    public RemediationCase() {}
}
