package com.sebastiankline.jobtracker.exception;

public class AuthException extends RuntimeException {

    public AuthException(String message) {
        super(message); // Calls constructor of RuntimeException
    }
}
