package com.example.mythosdemo.api;
import com.example.mythosdemo.domain.*;
import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;
import java.time.Instant;
import java.util.*;
@RestController
@RequestMapping("/api")
public class FindingController {
    private final FindingRepository findings;
    private final CaseRepository cases;
    public FindingController(FindingRepository findings, CaseRepository cases) { this.findings=findings;this.cases=cases; }
    @GetMapping("/health") public Map<String,Object> health(){return Map.of("service","mythos-demo","status","ok","data","synthetic-only");}
    @GetMapping("/findings") public List<Finding> all(){return findings.findAll().stream().sorted(Comparator.comparing(f->f.id)).toList();}
    @GetMapping("/findings/{id}") public Finding one(@PathVariable String id){return findings.findById(id).orElseThrow(()->new ResponseStatusException(HttpStatus.NOT_FOUND,"Finding not found"));}
    /** Live-aggregated overview statistics; the UI must not hardcode these (plan §2.2). */
    @GetMapping("/findings/stats") public Map<String,Object> stats(){
        List<Finding> all=findings.findAll();
        Map<String,Long> byStatus=new TreeMap<>();
        Map<String,Long> byRisk=new TreeMap<>();
        for(Finding f:all){
            byStatus.merge(f.status,1L,Long::sum);
            byRisk.merge(f.risk,1L,Long::sum);
        }
        long resolved=byStatus.getOrDefault("Resolved",0L);
        return Map.of(
            "total",all.size(),
            "open",all.size()-resolved,
            "inProgress",byStatus.getOrDefault("In Progress",0L),
            "resolved",resolved,
            "critical",byRisk.getOrDefault("CRITICAL",0L),
            "high",byRisk.getOrDefault("HIGH",0L),
            "medium",byRisk.getOrDefault("MEDIUM",0L),
            "byStatus",byStatus,
            "byRisk",byRisk,
            "generatedAt",Instant.now().toString());
    }
    public record UpdateFinding(
        @Pattern(regexp="Not Started|In Progress|Resolved|Risk Accepted|False Positive") String status,
        @Size(max=3000) String comment,
        @Size(max=80) String exposure,
        @Pattern(regexp="Yes|No") String reviewed,
        @Pattern(regexp="Yes|No") String severity,
        @Pattern(regexp="[0-9]{4}-[0-9]{2}-[0-9]{2}|^$") String planned,
        @Pattern(regexp="[0-9]{4}-[0-9]{2}-[0-9]{2}|^$") String actual,
        @Size(max=80) String triageResult,
        @Size(max=80) String verificationResult,
        @Size(max=120) String workItemId,
        @Size(max=120) String remediationJobId,
        @Size(max=120) String codeFixCommit,
        @Size(max=500) String prUrl) {}
    @PatchMapping("/findings/{id}") @Transactional public Finding update(@PathVariable String id,@Valid @RequestBody UpdateFinding req){
        Finding f=one(id);
        if(req.status()!=null){
            // Quality gate (plan §2.2): findings bound to an AI remediation job cannot be
            // closed as Resolved unless verification has actually passed.
            if(req.status().equals("Resolved")&&f.remediationJobId!=null
                &&!"PASSED".equals(f.verificationResult)){
                throw new ResponseStatusException(HttpStatus.CONFLICT,
                    "Finding is bound to remediation job "+f.remediationJobId+"; verificationResult must be PASSED before Resolved");
            }
            f.status=req.status();f.closed=req.status().equals("Resolved")?"Closed":"Open";
        }
        if(req.comment()!=null) f.comment=req.comment();
        if(req.exposure()!=null) f.exposure=req.exposure();
        if(req.reviewed()!=null) f.reviewed=req.reviewed();
        if(req.severity()!=null) f.severity=req.severity();
        if(req.planned()!=null) f.planned=req.planned();
        if(req.actual()!=null) f.actual=req.actual();
        if(req.triageResult()!=null) f.triageResult=req.triageResult();
        if(req.verificationResult()!=null) f.verificationResult=req.verificationResult();
        if(req.workItemId()!=null) f.workItemId=req.workItemId();
        if(req.remediationJobId()!=null) f.remediationJobId=req.remediationJobId();
        if(req.codeFixCommit()!=null) f.codeFixCommit=req.codeFixCommit();
        if(req.prUrl()!=null) f.prUrl=req.prUrl();
        return findings.save(f);
    }
    public record CreateCase(
        @NotBlank String findingId,
        @NotBlank @Size(max=250) String title,
        @NotBlank @Size(max=80) String owner,
        @NotBlank @Size(max=30) String priority,
        @Size(max=2000) String description){}
    @PostMapping("/cases") @ResponseStatus(HttpStatus.CREATED)
    public RemediationCase createCase(@Valid @RequestBody CreateCase req){
        one(req.findingId());
        RemediationCase c=new RemediationCase();c.id="CASE-"+UUID.randomUUID();c.findingId=req.findingId();c.title=req.title();
        c.owner=req.owner();c.priority=req.priority();c.description=req.description();c.createdAt=Instant.now();
        return cases.save(c);
    }
    @GetMapping("/cases") public List<RemediationCase> cases(){return cases.findAll();}
}
