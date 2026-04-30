package com.sebastiankline.jobtracker.repository;

import com.sebastiankline.jobtracker.model.JobApplication;
import com.sebastiankline.jobtracker.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface JobApplicationRepository extends JpaRepository<JobApplication, Long> {

    List<JobApplication> findByUser(User user); // Find only the jobs that belong to THIS user

    Optional<JobApplication> findByIdAndUser(Long id, User user);

    List<JobApplication> findByUserOrderByCreatedAtDesc(User user);

}
