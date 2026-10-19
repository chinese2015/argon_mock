package com.example.argondemo.domain;
import jakarta.persistence.*;
@Entity
@Table(name="findings")
public class Finding {
    @Id public String id;
    public String uuid;
    public String app;
    public String application;
    public String applicationName;
    public String resource;
    @Column(length=500) public String name;
    public String category;
    public String priority;
    public String risk;
    public double score;
    public String cve="N/A";
    public String business="Demo Engineering";
    public String status="Not Started";
    public String closed="Open";
    public boolean locked;
    public String exposure="Internal";
    public String reviewed="No";
    public String severity="No";
    @Column(name="owner_comment",length=4000) public String comment="";
    public String planned="2026-12-15";
    public String actual="";
    public int age;
    // --- M0: Argon AI Brain minimal fields (plan §2.3) ---
    /** Optimistic-locking / source snapshot version. */
    public long revision=1;
    public String ownerId;
    public String ownerTeamsId;
    public String repositoryId;
    /** Fictional clone URL; local mirrors live under demo-repos/. */
    public String repositoryUrl;
    public String baseBranch="main";
    public String baseCommit;
    public String sourcePath;
    /** e.g. "24-28". */
    public String lineRange;
    public String ruleId;
    public String scanRunId;
    /** Set only when the AI Brain has taken over (plan §1.2 rule 2). */
    public String workItemId;
    public String remediationJobId;
    /** CONFIRMED / FALSE_POSITIVE / ALREADY_FIXED / NEEDS_REVIEW / UNTRIAGED. */
    public String triageResult="UNTRIAGED";
    public String codeFixCommit;
    public String prUrl;
    /** PASSED / FAILED / NOT_RUN / SMOKE_NOT_RUN / MANUAL_VERIFICATION. */
    public String verificationResult="NOT_RUN";
    public Finding() {}
}
