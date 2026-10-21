package com.example.mythosdemo;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;
@SpringBootApplication
@EnableScheduling
public class MythosApplication {
    public static void main(String[] args) { SpringApplication.run(MythosApplication.class, args); }
}
