package com.sebastiankline.jobtracker.exception;

import io.jsonwebtoken.ExpiredJwtException;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice  // Run this class when an exception happens in any controller
public class GlocalExceptionHandler {

    @ExceptionHandler(MethodArgumentNotValidException.class) // If this specific exception (validation error from @NotBlank or @Email, etc) happens, run this method
    @ResponseStatus(HttpStatus.BAD_REQUEST) // Sets HTTP response to 400 Bad Request
    public Map<String, String> handleValidationErrors(MethodArgumentNotValidException ex) {
        Map<String, String> errors = new HashMap<>();

        ex.getBindingResult().getFieldErrors().forEach(error -> {
            errors.put(error.getField(), error.getDefaultMessage());
        });

        return errors;

    }

    @ExceptionHandler(AuthException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public Map<String, String> handleAuthException(AuthException ex) {
        Map<String, String> error = new HashMap<>();

        error.put("general", ex.getMessage());

        return error;
    }

    @ExceptionHandler(ExpiredJwtException.class)
    @ResponseStatus(HttpStatus.UNAUTHORIZED)
    public Map<String, String> handleExpiredJwtException(ExpiredJwtException ex) {
        Map<String, String> error = new HashMap<>();

        error.put("general", "Session expired. Please log in again.");

        return error;
    }

}
