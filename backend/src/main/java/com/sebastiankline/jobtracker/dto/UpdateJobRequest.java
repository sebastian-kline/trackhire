package com.sebastiankline.jobtracker.dto;

import com.sebastiankline.jobtracker.model.JobStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import java.time.LocalDate;

public class UpdateJobRequest {

    @NotBlank(message = "Company is required")
    @Size(max = 244, message = "Company cannot be longer than 244 characters.")
    private String company;
    @NotBlank(message = "Position is required")
    @Size(max = 244, message = "Position cannot be longer than 244 characters.")
    private String position;
    private JobStatus status;
    @Size(max = 244, message = "Notes cannot be longer than 244 characters.")
    private String notes;
    @Size(max = 244, message = "Location cannot be longer than 244 characters.")
    private String location;
    @Size(max = 244, message = "Salary Expectation cannot be longer than 244 characters.")
    private String salaryExpectation;
    @Size(max = 244, message = "Industry cannot be longer than 244 characters.")
    private String industry;
    @Size(max = 244, message = "Contact cannot be longer than 244 characters.")
    private String contactPerson;
    @Size(max = 244, message = "Source cannot be longer than 244 characters.")
    private String source;
    private LocalDate dateApplied;

    // GETTERS SETTERS
    public String getCompany() {
        return company;
    }
    public void setCompany(String company) {
        this.company = company;
    }

    public String getPosition() {
        return position;
    }
    public void setPosition(String position) {
        this.position = position;
    }

    public JobStatus getStatus() {
        return status;
    }
    public void setStatus(JobStatus status) {
        this.status = status;
    }

    public String getNotes() {
        return notes;
    }
    public void setNotes(String notes) {
        this.notes = notes;
    }

    public String getLocation() {
        return location;
    }
    public void setLocation(String location) {
        this.location = location;
    }

    public String getSalaryExpectation() {
        return salaryExpectation;
    }
    public void setSalaryExpectation(String salaryExpectation) {
        this.salaryExpectation = salaryExpectation;
    }

    public String getIndustry() {
        return industry;
    }
    public void setIndustry(String industry) {
        this.industry = industry;
    }

    public String getContactPerson() {
        return contactPerson;
    }
    public void setContactPerson(String contactPerson) {
        this.contactPerson = contactPerson;
    }

    public String getSource() {
        return source;
    }
    public void setSource(String source) {
        this.source = source;
    }

    public LocalDate getDateApplied() {
        return dateApplied;
    }
    public void setDateApplied(LocalDate dateApplied) {
        this.dateApplied = dateApplied;
    }

    public UpdateJobRequest() {

    }

}
