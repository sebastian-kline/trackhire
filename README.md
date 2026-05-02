
# TrackHire

TrackHire is a full-stack job application tracker that helps users organize, manage, and monitor their job search in one place. It provides a clean dashboard experience with real-time editing, filtering, and sorting, along with secure authentication.

Live App: https://trackhire.app


## Features

* User Authentication (JWT-based)  
    * Register and login securely  
    * Passwords hashed with Spring Security (BCrypt)  
    * Protected routes and session handling  
* Job Tracking Dashboard  
    * Add, edit, and delete job applications  
    * Inline editing (spreadsheet-style UI)  
    * Fields include:  
        * Company  
        * Position  
        * Status (Applied, Interviewing, Rejected, Accepted)  
        * Location  
        * Date Applied  
        * Salary (Expectation)  
        * Industry  
        * Contact 
        * Source  
        * Notes  
* Smart UI Features  
    * Search across multiple fields (company, position, contact, source, date)  
    * Filter by status  
    * Sort by columns (click headers to toggle asc/desc/reset)  
    * Default sorting by newest applications  
* Security & Backend Improvements  
    * Custom JWT filter integrated with Spring Security  
    * CORS configured for frontend domain  
    * Global exception handling  
    * Input validation using Jakarta Validation  
    * Secrets managed via environment variables (no hardcoded keys)  
## Tech Stack

#### Frontend
* React (Vite)
* JavaScript
* Custom CSS


#### Backend
* Java
* Spring Boot
* Spring Security
* JWT Authentication
* Spring Data JPA

#### Database
* PostgreSQL (Supabase)

#### Deployment
* Frontend: Vercel
* Backend: Railway
* Database: Supabase
* Domain: trackhire.app
## Architecture Overview

* REST API built with Spring Boot
* JWT-based authentication with a custom filter
* React frontend consuming secured endpoints
* PostgreSQL database hosted on Supabase
* Layered backend structure:
    * Controllers → request handling
    * Services → business logic
    * Repositories → database access
    * DTOs → request/response models
## Security Notes

* Passwords are hashed using BCrypt
* JWT tokens are validated on every request via a custom filter
* Protected endpoints require authentication
* Sensitive values (JWT secret) stored in environment variables
* CORS restricted to the frontend domain
## Getting Started (Local)

#### Backend:

* Run Spring Boot application
* Set environment variable:
    * JWT_SECRET=your-secret-key

#### Frontend:

* npm install
* npm run dev
## Future Improvements (Roadmap)

* Pagination for large datasets
* User profile editing support
* Email verification & password reset
* Improved mobile responsiveness
* Store JWT in HTTP cookie rather than localStorage (to prevent XSS attacks)
## Author

[@sebastian-kline](https://github.com/sebastian-kline)