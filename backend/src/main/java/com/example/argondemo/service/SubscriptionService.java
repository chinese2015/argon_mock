package com.example.argondemo.service;
import com.example.argondemo.domain.*;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;
import java.security.*;
import java.time.*;
import java.util.*;
import java.util.stream.Collectors;
import java.util.Base64;
@Service
public class SubscriptionService {
    private final SubscriptionRepository subscriptions;
    private final FindingRepository findings;
    private final MailDelivery mail;
    private final SecureRandom rng=new SecureRandom();
    @Value("${notification.base-url:http://localhost:8080}") private String baseUrl;
    public SubscriptionService(SubscriptionRepository subs,FindingRepository findings,MailDelivery mail){this.subscriptions=subs;this.findings=findings;this.mail=mail;}
    private String newToken(){byte[] b=new byte[32];rng.nextBytes(b);return Base64.getUrlEncoder().withoutPadding().encodeToString(b);}
    private String hash(String token){
        try {byte[] h=MessageDigest.getInstance("SHA-256").digest(token.getBytes(java.nio.charset.StandardCharsets.UTF_8));return HexFormat.of().formatHex(h);}
        catch(NoSuchAlgorithmException ex){throw new IllegalStateException(ex);}
    }
    @Transactional
    public void request(String email,String frequency,String minRisk,String appCode){
        String normal=email.strip().toLowerCase(Locale.ROOT);
        if(normal.length()>254||normal.contains("\n")||normal.contains("\r"))throw new ResponseStatusException(HttpStatus.BAD_REQUEST,"Invalid email");
        if(!Set.of("DAILY","WEEKLY").contains(frequency)||!Set.of("MEDIUM","HIGH","CRITICAL").contains(minRisk))
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,"Invalid subscription settings");
        if(appCode==null)appCode="";
        if(!appCode.isEmpty()&&!Set.of("DEMO-APP-001","DEMO-APP-002","DEMO-APP-003","DEMO-APP-004","DEMO-APP-005").contains(appCode))
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,"Unknown demo application code");
        // Limits duplicates and accidental email floods. Production should add IP-based limits and CAPTCHA/auth.
        final String fAppCode=appCode;
        if(subscriptions.findAll().stream().anyMatch(s->s.email.equals(normal)&&s.appCode.equals(fAppCode)
           && (s.status.equals("ACTIVE") ||
               (s.status.equals("PENDING") && s.createdAt.isAfter(Instant.now().minus(Duration.ofHours(1)))))))return;
        String confirm=newToken(),unsub=newToken();
        Subscription s=new Subscription();s.id=UUID.randomUUID().toString();s.email=normal;s.frequency=frequency;
        s.minRisk=minRisk;s.appCode=appCode;s.status="PENDING";s.createdAt=Instant.now();
        s.confirmTokenHash=hash(confirm);s.unsubscribeTokenHash=hash(unsub);s.unsubscribeToken=unsub;
        subscriptions.save(s);
        // Public base URL is fixed config; do not trust the inbound Host header.
        String confirmUrl=baseUrl+"/#confirm="+confirm;
        mail.deliver(s.email,"Confirm your Argon DEMO findings digest",
           "You requested a subscription to a SYNTHETIC TRAINING DEMO.\n\n"
           +"Frequency: "+frequency+"\nMinimum risk: "+minRisk+"\nScope: "+(appCode.isBlank()?"All demo apps":appCode)
           +"\n\nOpen this URL, then click Confirm:\n"+confirmUrl
           +"\n\nIf this wasn't you, ignore this email. No digest will be sent until confirmed.\n");
    }
    @Transactional
    public void confirm(String token){
        Subscription s=subscriptions.findByConfirmTokenHashAndStatus(hash(token),"PENDING")
            .orElseThrow(()->new ResponseStatusException(HttpStatus.NOT_FOUND,"Expired or invalid confirmation token"));
        if(s.createdAt.isBefore(Instant.now().minus(Duration.ofHours(48))))
            throw new ResponseStatusException(HttpStatus.GONE,"Confirmation expired; request a new subscription");
        // Retire other pending requests with the same mailbox + app scope.
        for(Subscription old:subscriptions.findAll())if(!old.id.equals(s.id)
            && old.email.equals(s.email) && Objects.equals(old.appCode,s.appCode)
            && old.status.equals("PENDING")){old.status="UNSUBSCRIBED";subscriptions.save(old);}
        s.status="ACTIVE";s.confirmedAt=Instant.now();s.confirmTokenHash=hash(newToken());
        subscriptions.save(s);
    }
    @Transactional
    public void unsubscribe(String token){
        Subscription s=subscriptions.findByUnsubscribeTokenHash(hash(token))
            .orElseThrow(()->new ResponseStatusException(HttpStatus.NOT_FOUND,"Invalid unsubscribe token"));
        s.status="UNSUBSCRIBED";subscriptions.save(s);
    }
    @Scheduled(cron="${notification.cron:0 0 8 * * *}",zone="${notification.zone:UTC}")
    public void scheduled(){deliverDigests();}
    @Transactional
    public int deliverDigests(){
        ZonedDateTime now=ZonedDateTime.now(ZoneOffset.UTC);int count=0;
        for(Subscription s:subscriptions.findByStatus("ACTIVE")){
            if(s.frequency.equals("WEEKLY") && now.getDayOfWeek()!=DayOfWeek.MONDAY)continue;
            if(s.lastDeliveredAt!=null && s.lastDeliveredAt.atZone(ZoneOffset.UTC).toLocalDate().equals(now.toLocalDate()))continue;
            List<Finding> match=findings.findAll().stream().filter(f->!f.closed.equals("Closed"))
                .filter(f->s.appCode==null||s.appCode.isBlank()||s.appCode.equals(f.application))
                .filter(f->level(f.risk)>=level(s.minRisk))
                .sorted(Comparator.comparingDouble((Finding f)->f.score).reversed()).toList();
            if(match.isEmpty())continue;
            String body="Argon DEMO — Synthetic Vulnerability Digest\n\n"
                +"TRAINING DATA ONLY. DO NOT TREAT AS A REAL SECURITY ALERT.\n\n"
                +"Open findings matching your subscription: "+match.size()+"\n"
                +"Frequency: "+s.frequency+"; Minimum severity: "+s.minRisk+"\n\n"
                +match.stream().limit(20).map(f->f.id+" | "+f.risk+" | CVSS "+f.score+" | "+f.application+" | "+f.name)
                       .collect(Collectors.joining("\n"))
                + (match.size()>20?"\n... and "+(match.size()-20)+" more (see demo dashboard).":"")
                +"\n\nOpen dashboard: "+baseUrl+"/\n"
                +"Unsubscribe: "+baseUrl+"/#unsubscribe="+s.unsubscribeToken;
            mail.deliver(s.email,"[Argon DEMO] "+match.size()+" open synthetic findings",body);
            s.lastDeliveredAt=Instant.now();subscriptions.save(s);count++;
        }
        return count;
    }
    private static int level(String risk){return switch(risk){case "CRITICAL"->3;case "HIGH"->2;case "MEDIUM"->1;default->0;};}
}
