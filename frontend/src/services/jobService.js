import { API_BASE_URL } from "../config";

// Get All Jobs For User Logic
export async function getJobs() {
    const token = localStorage.getItem("token");

    const response = await fetch(`${API_BASE_URL}/api/jobs`, {
        headers: {
            "Authorization": `Bearer ${token}`,
        }
    });

    handleExpiredSession(response);

    if (!response.ok) {
        throw new Error("Failed to fetch jobs");
    }

    return response.json();
}

// Create a Job Logic
export async function createJob(jobData) {
    const token = localStorage.getItem("token");

    const response = await fetch(`${API_BASE_URL}/api/jobs`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(jobData),
    })

    handleExpiredSession(response);

    if (!response.ok) {
        throw new Error("Failed to create job");
    }

    return response.json();

}

// Delete a Job Logic
export async function deleteJob(id) {
    const token = localStorage.getItem("token");

    const response = await fetch(`${API_BASE_URL}/api/jobs/${id}`, {
        method: "DELETE",
        headers: {
            "Authorization": `Bearer ${token}`,
        },
    });

    handleExpiredSession(response);

    if (!response.ok) {
        throw new Error("Failed to delete job");
    }
}

// Update a Job Logic
export async function updateJob(id, jobData) {
    const token = localStorage.getItem("token");

    const response = await fetch(`${API_BASE_URL}/api/jobs/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(jobData),
    });

    handleExpiredSession(response);

    if (!response.ok) {
        throw new Error("Failed to update job");
    }

    return response.json();
}

// Handle expired sessions
function handleExpiredSession(response) {
    if (response.status === 401 || response.status === 403) {
        localStorage.removeItem("token");
        localStorage.removeItem("firstName");
        window.location.href = "/login";
        throw new Error("Session expired");
    }
}