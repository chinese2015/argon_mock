package com.example.argondemo.domain;
import jakarta.persistence.*;
import java.time.Instant;
@Entity
@Table(name="subscriptions")
public class Subscription {
    @Id public String id;
    @Column(nullable=false,length=254) public String email;
    @Column(nullable=false) public String minRisk;
    public String appCode; // blank = all demo apps
    @Column(nullable=false) public String frequency; // DAILY, WEEKLY
    @Column(nullable=false) public String status; // PENDING, ACTIVE, UNSUBSCRIBED
    @Column(nullable=false,length=64) public String confirmTokenHash;
    @Column(nullable=false,length=64) public String unsubscribeTokenHash;
    // This local demo retains the unsubscribe capability token so digest URLs remain usable.
    // For production use a server-side signed URL with a managed signing key.
    @Column(nullable=false,length=64) public String unsubscribeToken;
    public Instant createdAt;
    public Instant confirmedAt;
    public Instant lastDeliveredAt;
    public Subscription() {}
}
