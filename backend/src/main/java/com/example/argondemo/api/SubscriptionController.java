package com.example.argondemo.api;
import com.example.argondemo.service.*;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import java.util.Map;
@RestController
@RequestMapping("/api")
public class SubscriptionController {
    private final SubscriptionService service;
    private final MailDelivery mail;
    public SubscriptionController(SubscriptionService service,MailDelivery mail){this.service=service;this.mail=mail;}
    public record SubscriptionRequest(@NotBlank @Email @Size(max=254) String email,
        @NotBlank String frequency,@NotBlank String minRisk,String appCode) {}
    public record TokenRequest(@NotBlank @Size(max=128) String token) {}
    @PostMapping("/subscriptions")
    public ResponseEntity<Map<String,String>> subscribe(@Valid @RequestBody SubscriptionRequest req){
        service.request(req.email(),req.frequency(),req.minRisk(),req.appCode());
        return ResponseEntity.status(HttpStatus.ACCEPTED).body(Map.of("message","Check your email (or local outbox) to confirm."));
    }
    @PostMapping("/subscriptions/confirm")
    public Map<String,String> confirm(@Valid @RequestBody TokenRequest req){service.confirm(req.token());return Map.of("status","ACTIVE");}
    @PostMapping("/subscriptions/unsubscribe")
    public Map<String,String> unsubscribe(@Valid @RequestBody TokenRequest req){service.unsubscribe(req.token());return Map.of("status","UNSUBSCRIBED");}
    /** Development-only local preview trigger. Never sends SMTP and rejects non-loopback callers. */
    @PostMapping("/demo/digests/run")
    public Map<String,Integer> preview(HttpServletRequest request){
        String ip=request.getRemoteAddr();
        if(!mail.isPreview()||!(ip.equals("127.0.0.1")||ip.equals("0:0:0:0:0:0:0:1")||ip.equals("::1")))
            throw new ResponseStatusException(HttpStatus.FORBIDDEN,"Preview trigger is localhost-only and requires MAIL_MODE=preview");
        return Map.of("previewEmailsWritten",service.deliverDigests());
    }
}
