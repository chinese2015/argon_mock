package com.example.mythosdemo.api;
import org.springframework.http.*;
import org.springframework.dao.OptimisticLockingFailureException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.*;
import java.util.Map;
@RestControllerAdvice
public class ApiErrorHandler {
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String,String>> invalid(MethodArgumentNotValidException e){
        return ResponseEntity.badRequest().body(Map.of("message","Invalid request fields"));
    }
    @ExceptionHandler({OptimisticLockingFailureException.class, jakarta.persistence.OptimisticLockException.class})
    public ResponseEntity<Map<String,String>> conflict(Exception e){
        return ResponseEntity.status(HttpStatus.CONFLICT).body(Map.of("message","Finding changed concurrently; reload and retry"));
    }
}
