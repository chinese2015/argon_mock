package com.example.argondemo;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;
@SpringBootApplication
@EnableScheduling
public class ArgonApplication {
    public static void main(String[] args) { SpringApplication.run(ArgonApplication.class, args); }
}
