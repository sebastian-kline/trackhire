package com.sebastiankline.jobtracker.dto;

public class AuthResponse {

    private final String token;
    private String firstName;

    // GETTER - setter not needed here since token doesn't change after creation
    public String getToken() {
        return token;
    }

    public String getFirstName() {
        return firstName;
    }
    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public AuthResponse(String token) {
        this.token = token;
    }

}
