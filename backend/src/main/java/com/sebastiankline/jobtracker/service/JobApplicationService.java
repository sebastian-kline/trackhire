package com.sebastiankline.jobtracker.service;

import com.sebastiankline.jobtracker.dto.CreateJobRequest;
import com.sebastiankline.jobtracker.dto.JobResponse;
import com.sebastiankline.jobtracker.dto.UpdateJobRequest;
import com.sebastiankline.jobtracker.model.JobApplication;
import com.sebastiankline.jobtracker.model.User;
import com.sebastiankline.jobtracker.repository.JobApplicationRepository;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class JobApplicationService {

    private final JobApplicationRepository jobApplicationRepository;

    public JobApplicationService(JobApplicationRepository jobApplicationRepository) {
        this.jobApplicationRepository = jobApplicationRepository;
    }

    // GET
    // Finds all jobs a user has
    public List<JobResponse> getJobsByUser(User user) {
        List<JobApplication> jobs = jobApplicationRepository.findByUserOrderByCreatedAtDesc(user); // Get data from DB

        List<JobResponse> jobResponses = new ArrayList<>(); // Create a new empty list

        for (JobApplication jobApplication : jobs) { // Loop through each job
            JobResponse response = new JobResponse(); // Convert entity -> DTO

            // Set data points
            response.setId(jobApplication.getId());
            response.setCompany(jobApplication.getCompany());
            response.setPosition(jobApplication.getPosition());
            response.setStatus(jobApplication.getStatus());
            response.setNotes(jobApplication.getNotes());
            response.setLocation(jobApplication.getLocation());
            response.setSalaryExpectation(jobApplication.getSalaryExpectation());
            response.setIndustry(jobApplication.getIndustry());
            response.setContactPerson(jobApplication.getContactPerson());
            response.setSource(jobApplication.getSource());
            response.setDateApplied(jobApplication.getDateApplied());

            jobResponses.add(response); // Add to the list
        }

        return jobResponses;

    }

    // POST
    // Creates a job for the user
    public JobResponse createJob(CreateJobRequest request, User user) {
        JobApplication jobApplication = new JobApplication();

        jobApplication.setCompany(request.getCompany());
        jobApplication.setPosition(request.getPosition());
        jobApplication.setStatus(request.getStatus());
        jobApplication.setNotes(request.getNotes());
        jobApplication.setLocation(request.getLocation());
        jobApplication.setSalaryExpectation(request.getSalaryExpectation());
        jobApplication.setIndustry(request.getIndustry());
        jobApplication.setContactPerson(request.getContactPerson());
        jobApplication.setSource(request.getSource());
        jobApplication.setDateApplied(request.getDateApplied());

        jobApplication.setUser(user);

        JobApplication savedJob = jobApplicationRepository.save(jobApplication);

        JobResponse response = new JobResponse();
        response.setId(savedJob.getId());
        response.setCompany(savedJob.getCompany());
        response.setPosition(savedJob.getPosition());
        response.setStatus(savedJob.getStatus());
        response.setNotes(savedJob.getNotes());
        response.setLocation(savedJob.getLocation());
        response.setSalaryExpectation(savedJob.getSalaryExpectation());
        response.setIndustry(savedJob.getIndustry());
        response.setContactPerson(savedJob.getContactPerson());
        response.setSource(savedJob.getSource());
        response.setDateApplied(savedJob.getDateApplied());

        return response;

    }

    // PUT
    // Updates an existing job
    public JobResponse updateJob(Long id, UpdateJobRequest request, User user) {
        Optional<JobApplication> jobOptional = jobApplicationRepository.findByIdAndUser(id, user);

        if (jobOptional.isEmpty()) {
            throw new RuntimeException("Job not found");
        }
        JobApplication job = jobOptional.get();

        job.setCompany(request.getCompany());
        job.setPosition(request.getPosition());
        job.setStatus(request.getStatus());
        job.setNotes(request.getNotes());
        job.setLocation(request.getLocation());
        job.setSalaryExpectation(request.getSalaryExpectation());
        job.setIndustry(request.getIndustry());
        job.setContactPerson(request.getContactPerson());
        job.setSource(request.getSource());
        job.setDateApplied(request.getDateApplied());

        JobApplication updatedJob = jobApplicationRepository.save(job);

        JobResponse response = new JobResponse();
        response.setId(updatedJob.getId());
        response.setCompany(updatedJob.getCompany());
        response.setPosition(updatedJob.getPosition());
        response.setStatus(updatedJob.getStatus());
        response.setNotes(updatedJob.getNotes());
        response.setLocation(updatedJob.getLocation());
        response.setSalaryExpectation(updatedJob.getSalaryExpectation());
        response.setIndustry(updatedJob.getIndustry());
        response.setContactPerson(updatedJob.getContactPerson());
        response.setSource(updatedJob.getSource());
        response.setDateApplied(updatedJob.getDateApplied());

        return response;
    }

    // DELETE
    public void deleteJob(Long id, User user) {
        Optional<JobApplication> jobOptional = jobApplicationRepository.findByIdAndUser(id, user);

        if(jobOptional.isEmpty()) {
            throw new RuntimeException("Job not found");
        }

        jobApplicationRepository.delete(jobOptional.get());

    }

}
