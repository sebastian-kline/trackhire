package com.sebastiankline.jobtracker.dto;

import com.sebastiankline.jobtracker.model.JobStatus;

import java.time.LocalDate;

// Used to carry SPECIFIC data fields between layers (backend -> frontend)
// Ensures output does not expose sensitive fields from controller
public class JobResponse {

    private Long id;
    private String company;
    private String position;
    private JobStatus status;
    private String notes;
    private String location;
    private String salaryExpectation;
    private String industry;
    private String contactPerson;
    private String source;
    private LocalDate dateApplied;

    //GETTERS SETTERS
    public Long getId() {
        return id;
    }
    public void setId(Long id) {
        this.id = id;
    }

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

    public JobResponse () {

    }

}
