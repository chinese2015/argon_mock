package com.example.argondemo.service;
import org.springframework.beans.factory.ObjectProvider;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.*;
import java.time.Instant;
import java.util.*;
@Service
public class MailDelivery {
    private final ObjectProvider<JavaMailSender> senders;
    @Value("${notification.mode:preview}") private String mode;
    @Value("${notification.from:argon-demo@example.test}") private String from;
    @Value("${notification.smtp-allowed-recipients:}") private String recipients;
    @Value("${notification.outbox-dir:./data/outbox}") private String outboxDir;
    public MailDelivery(ObjectProvider<JavaMailSender> senders){this.senders=senders;}
    public boolean isPreview(){return !"smtp".equalsIgnoreCase(mode);}
    public void deliver(String to, String subject, String body){
        if(to.contains("\r")||to.contains("\n"))throw new IllegalArgumentException("Invalid recipient");
        if(isPreview()){
            try {
                Path dir=Paths.get(outboxDir);Files.createDirectories(dir);
                String safe="To: "+to+"\r\nFrom: "+from+"\r\nSubject: "+subject+"\r\nContent-Type: text/plain; charset=UTF-8\r\n\r\n"+body;
                Path file=dir.resolve(Instant.now().toEpochMilli()+"-"+UUID.randomUUID()+".eml");
                Files.writeString(file,safe,StandardCharsets.UTF_8,StandardOpenOption.CREATE_NEW);
                System.out.println("[Argon PREVIEW] EML written: "+file.toAbsolutePath());
            }catch(IOException ex){throw new IllegalStateException("Cannot write local outbox",ex);}
            return;
        }
        Set<String> allow=new HashSet<>();
        for(String x:recipients.split(","))if(!x.isBlank())allow.add(x.strip().toLowerCase(Locale.ROOT));
        if(allow.isEmpty()||!allow.contains(to.toLowerCase(Locale.ROOT)))
            throw new IllegalStateException("SMTP delivery blocked: recipient is not in SMTP_ALLOWED_RECIPIENTS");
        JavaMailSender sender=senders.getIfAvailable();
        if(sender==null)throw new IllegalStateException("SMTP_HOST must be configured for MAIL_MODE=smtp");
        SimpleMailMessage msg=new SimpleMailMessage();msg.setFrom(from);msg.setTo(to);msg.setSubject(subject);msg.setText(body);
        sender.send(msg);
    }
}
