package com.example.mythosdemo.service;
import com.example.mythosdemo.domain.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import java.util.UUID;
@Component
public class SeedData implements CommandLineRunner {
    private final FindingRepository repo;
    public SeedData(FindingRepository repo) { this.repo=repo; }
    private static final String[][] APPS={
        {"LAB-A","DEMO-APP-001","Aster Sample Portal","demo-aster-ui-service"},
        {"LAB-B","DEMO-APP-002","Cobalt Message Queue","demo-cobalt-worker"},
        {"LAB-C","DEMO-APP-003","Orion Notes Playground","demo-orion-notes-api"},
        {"LAB-D","DEMO-APP-004","Nova Sample Catalog","demo-nova-catalog-api"},
        {"LAB-E","DEMO-APP-005","Pixel Reports Sandbox","demo-pixel-reports-batch"}
    };
    // fictional owners, one per demo app (plan §2.3 ownerId/ownerTeamsId)
    private static final String[][] OWNERS={
        {"owner-aster-01","8:orgid:f1a2demo3:owner-aster-01"},
        {"owner-cobalt-01","8:orgid:f1a2demo3:owner-cobalt-01"},
        {"owner-orion-01","8:orgid:f1a2demo3:owner-orion-01"},
        {"owner-nova-01","8:orgid:f1a2demo3:owner-nova-01"},
        {"owner-pixel-01","8:orgid:f1a2demo3:owner-pixel-01"}
    };
    // fictional repos; local mirrors under demo-repos/<repoName> with real git history
    private static final String[][] REPOS={
        {"REPO-demo-aster-ui-service","demo-aster-ui-service","6a11c9d2e8f34b0a9d5e7c61f2b8a0d4e6c3f1a2"},
        {"REPO-demo-cobalt-worker","demo-cobalt-worker","b7e2f4a1c9d54e3b8f0a6d72c3e5b9a1d8f4c6e3"},
        {"REPO-demo-orion-notes-api","demo-orion-notes-api","2ce309f4dd7a39a22fcce59ad4309a50e1df237e"},
        {"REPO-demo-nova-catalog-api","demo-nova-catalog-api","7fd32b0535fac3f6ce105a8494e2dcbba7ce355b"},
        {"REPO-demo-pixel-reports-batch","demo-pixel-reports-batch","0a67ffc801aad448a0992ba84aabc5d47d63c478"}
    };
    private static final String SCAN_RUN_ID="SCAN-2026-09-01-01";
    /** Demo findings mapped to real code in demo-repos (plan M0: 2–3 reproducible findings). */
    private static final String[][] DEMO_MAPPINGS={
        // findingId, repoIndex, sourcePath, lineRange
        {"FND-00003","2","src/main/java/com/example/notes/AppConfig.java","10"},
        {"FND-00009","3","src/main/java/com/example/catalog/CatalogSearchService.java","23"},
        {"FND-00015","4","src/main/java/com/example/reports/ReportImporter.java","21"}
    };
    private static final String[][] EXAMPLES={
        {"Example missing object-owner check in a sample API","Improper Access Control (CWE-284)","7.6"},
        {"Demo search endpoint accepts unsanitized test input","Input Validation (CWE-20)","8.1"},
        {"Placeholder configuration contains a training-only secret","Hardcoded Credentials (CWE-798)","8.8"},
        {"Mock TLS client skips certificate checks","Certificate Validation (CWE-295)","7.4"},
        {"Example expression parser needs input validation","Expression Language Injection (CWE-917)","9.9"},
        {"Sample session handler fails an authorization check","Improper Authentication (CWE-287)","9.8"},
        {"Synthetic settings file has a sample key string","Use of Hard-coded Key (CWE-321)","8.2"},
        {"Demo shared state leaks across mock request contexts","Improper Isolation (CWE-653)","8.2"},
        {"Example SQL builder uses string concatenation","SQL Injection (CWE-89)","9.0"},
        {"Training-only URL input permits internal mock redirects","Server-Side Request Forgery (CWE-918)","8.5"},
        {"Mock user role is loaded from an untrusted form value","Improper Authorization (CWE-285)","8.8"},
        {"Example document listing omits a permission filter","Missing Authorization (CWE-862)","7.5"},
        {"Placeholder login flow does not invalidate stale tokens","Improper Authentication (CWE-287)","8.0"},
        {"Sample application emits excess diagnostic information","Information Exposure (CWE-200)","6.5"},
        {"Demo file-import routine requires path normalization","Path Traversal (CWE-22)","8.6"},
        {"Example multi-user notes view lacks mock tenant scope","Improper Access Control (CWE-284)","9.1"}
    };
    @Override public void run(String... args){
        if(repo.count()>0)return;
        for(int i=0;i<234;i++){
            Finding f=new Finding();String[] a=APPS[i%APPS.length], x=EXAMPLES[i%EXAMPLES.length];
            f.id="FND-%05d".formatted(i+1);
            f.uuid=UUID.nameUUIDFromBytes(("mythos-example-"+i).getBytes(java.nio.charset.StandardCharsets.UTF_8)).toString();
            f.app=a[0];f.application=a[1];f.applicationName=a[2];f.resource=a[3];
            f.name=x[0];f.category=x[1];
            f.score=i<EXAMPLES.length?Double.parseDouble(x[2]):Math.round((6.4+(i%36)/10.0)*10.0)/10.0;
            f.risk=f.score>=9?"CRITICAL":f.score<7?"MEDIUM":"HIGH";
            f.priority=i%21==0&&i>10?"P2":"P3";
            f.status=i%9==0?"In Progress":i%23==0?"Resolved":"Not Started";
            f.closed=f.status.equals("Resolved")?"Closed":"Open";
            f.locked=i>10&&i%29==0;f.age=5+i%28;
            f.business=i%3==0?"Training Lab":"Demo Engineering";
            int appIndex=i%APPS.length;
            f.ownerId=OWNERS[appIndex][0];f.ownerTeamsId=OWNERS[appIndex][1];
            f.repositoryId=REPOS[appIndex][0];
            f.repositoryUrl="https://git.example.test/demo/"+REPOS[appIndex][1]+".git";
            f.baseBranch="main";f.baseCommit=REPOS[appIndex][2];
            f.scanRunId=SCAN_RUN_ID;f.revision=1;
            String cwe=f.category.replaceAll(".*(CWE-\\d+).*","$1");
            f.ruleId="RULE-"+cwe;
            repo.save(f);
        }
        // pin the 2–3 demo findings to verified code locations (real lines/commits in demo-repos)
        for(String[] m:DEMO_MAPPINGS){
            Finding f=repo.findById(m[0]).orElseThrow();
            String[] repoInfo=REPOS[Integer.parseInt(m[1])];
            f.repositoryId=repoInfo[0];
            f.repositoryUrl="https://git.example.test/demo/"+repoInfo[1]+".git";
            f.baseCommit=repoInfo[2];
            f.sourcePath=m[2];f.lineRange=m[3];
            repo.save(f);
        }
    }
}
