package com.sebastiankline.jobtracker.security;

import com.sebastiankline.jobtracker.model.User;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;

@Service
public class JwtService {

    @Value("${jwt.secret}")
    private String secretKey;

    // Generate JWT token from User's email
    public String generateToken(User user) {
        SecretKey key = Keys.hmacShaKeyFor(secretKey.getBytes(StandardCharsets.UTF_8)); // Creates secret key from SECRET_KEY string

        return Jwts.builder() // Starts building JWT token
                .subject(user.getEmail()) // Sets the subject as the user email
                .claim("firstName", user.getFirstName())
                .issuedAt(new Date()) // When the token was created
                .expiration(new Date(System.currentTimeMillis() + 1000 * 60 * 60)) // The token expires in 1 hour
                .signWith(key) // Signs the token (Locks in it and prevents data inside from being changed)
                .compact(); // Convert to string
    }

    // Get the email out of the token
    public String extractEmail(String token) {
        SecretKey key = Keys.hmacShaKeyFor(secretKey.getBytes(StandardCharsets.UTF_8)); // Creates secret key from SECRET_KEY string

        Claims claims = Jwts.parser() // Reads the token
                .verifyWith(key) // Checks the token was signed with secret key
                .build()
                .parseSignedClaims(token) // Decodes the token
                .getPayload(); // Gets the data inside the token

        return claims.getSubject(); // Returns the email stored earlier (stored in subjet of token)
    }

}
