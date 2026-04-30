package com.sebastiankline.jobtracker.controller;

import com.sebastiankline.jobtracker.dto.CreateJobRequest;
import com.sebastiankline.jobtracker.dto.JobResponse;
import com.sebastiankline.jobtracker.dto.UpdateJobRequest;
import com.sebastiankline.jobtracker.model.User;
import com.sebastiankline.jobtracker.repository.UserRepository;
import com.sebastiankline.jobtracker.security.JwtService;
import com.sebastiankline.jobtracker.service.JobApplicationService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.Authentication;

import java.util.List;

@RestController
@RequestMapping("/api/jobs")
public class JobApplicationController {

    private final JobApplicationService jobApplicationService;

    public JobApplicationController(JobApplicationService jobApplicationService) {
        this.jobApplicationService = jobApplicationService;
    }

    @GetMapping
    public List<JobResponse> getJobsByUser(Authentication authentication) { // Reads token from the header
        User user = (User) authentication.getPrincipal();
        return jobApplicationService.getJobsByUser(user);
    }

    @PostMapping
    public JobResponse createJob(@Valid @RequestBody CreateJobRequest request, Authentication authentication) { // Passes through DTO to create job and uses JWT token
        User user = (User) authentication.getPrincipal();
        return jobApplicationService.createJob(request, user);
    }

    @PutMapping("/{id}")
    public JobResponse updateJob(@PathVariable Long id, @Valid @RequestBody UpdateJobRequest request, Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        return jobApplicationService.updateJob(id, request, user);
    }

    @DeleteMapping("/{id}")
    public void deleteJob(@PathVariable Long id, Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        jobApplicationService.deleteJob(id, user);
    }

}
