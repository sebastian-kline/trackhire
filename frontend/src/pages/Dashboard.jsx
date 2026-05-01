import { useEffect, useState } from "react";
import {createJob, deleteJob, getJobs, updateJob} from "../services/jobService.js";
import "./Dashboard.css"

function Dashboard() {

    // Gets user's first name for title
    const firstName = localStorage.getItem("firstName");

    // Jobs and Form Data
    const [jobs, setJobs] = useState([]); // The current list of jobs on the screen - setJobs is how the list is replaced - starts with an empty list
    const [formData, setFormData] = useState({company: "", position: "", status: "APPLIED", notes: "", location: "", dateApplied: getTodayDate(), salaryExpectation: "", industry: "", contactPerson: "", source: "",});

    // If the user is adding a row helper
    const [isAddingRow, setIsAddingRow] = useState(false);

    // Used for editing a cell
    const [editingCell, setEditingCell] = useState(null); // Used for knowing which job is being edited
    const [editFormData, setEditFormData] = useState({company: "", position: "", status: "APPLIED", notes: "", location: "", dateApplied: getTodayDate(), salaryExpectation: "", industry: "", contactPerson: "", source: "",});

    // Error handling
    const [error, setError] = useState(""); // Used for error tracking
    const MAX_FIELD_LENGTH = 244;

    // Used for button loading states
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [savingJobId, setSavingJobId] = useState(null);

    // Filter and Search
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("ALL");
    const [sortConfig, setSortConfig] = useState({key: "dateApplied", direction: "asc",});
    const [hasUserSorted, setHasUserSorted] = useState(false);

    useEffect(() => { // When the dashboard first appears, call the backend, get the jobs, and save them into jobs
        async function loadJobs() {
            try {
                const data = await getJobs();
                setJobs(data);
            } catch (error) {
                console.error("Error loading jobs: ", error);
            }
        }

        loadJobs();
    }, []); // The empty array means run this once when the component first loads

    useEffect(() => { // Logic for adding a new job - if not adding row, disregard
        function handleKeyDown(e) {
            if (!isAddingRow) return;

            if (e.key === "Enter") {
                e.preventDefault();
                void handleInlineAddJob();
            }

            if (e.key === "Escape") {
                setIsAddingRow(false);
                setError("");
            }

        }

        window.addEventListener("keydown", handleKeyDown);

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [isAddingRow, formData]);

    // Updates the form as user is typing a new job
    function handleChange(e) {
        const {name, value} = e.target; // The input that triggered the event (e.target) is used to get name (company) and its value (Google)

        setError("");

        setFormData((prev) => ({
            ...prev, // The old form data
            [name]: value, // Changes the old form's value
        }));
    }

    // Updates the edit form as a user is editing a job
    function handleEditChange(e) {
        const {name, value} = e.target;

        setError("");

        setEditFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    }

    // When the user clicks "Add Job" logic
    async function handleSubmit(e) {
        e.preventDefault(); // Don't refresh the page when submitting

        if (!isFormValid()) {
            setError("Company are position are required.");
            return;
        }

        setIsSubmitting(true);

        try {
            await createJob(formData);

            const updatedJobs = await getJobs(); // After creating the new job, ask the backend for the updated list
            setJobs(updatedJobs); // Replaces old jobs list on the page

            setFormData({ // Clears form after submission
                company: "",
                position: "",
                status: "APPLIED",
                notes: "",
                location: "",
                dateApplied: getTodayDate(),
                salaryExpectation: "",
                industry: "",
                contactPerson: "",
                source: "",
            });
        } catch (error) {
            setError("Company and position are required.");
        } finally {
            setIsSubmitting(false);
        }
    }

    // Validation check to prevent blank data
    function isFormValid() {
        return formData.company.trim() !== "" && formData.position.trim() !== "";
    }

    // Gets today's date to auto set date applied
    function getTodayDate() {
        const today = new Date();
        const offset = today.getTimezoneOffset();
        const localDate = new Date(today.getTime() - offset * 60 * 2000);
        return localDate.toISOString().split("T")[0];
    }

    // When the user deletes a job logic
    async function handleDelete(id) {
        try {
            await deleteJob(id);

            const updatedJobs = await getJobs(); // After deleting the job, ask the backend for the updated list
            setJobs(updatedJobs); // Replaces old jobs list on the page

        } catch (error) {
            setError("Could not delete job. Please try again.");
        }
    }

    // When the user updates a field in a job
    async function handleSave(jobId, dataToSave = editFormData) {
        if (hasTooLongField(formData)) {
            setError(`Fields cannot be longer than ${MAX_FIELD_LENGTH} characters.`)
            return;
        }

        setSavingJobId(jobId);

        try {
            await updateJob(jobId, dataToSave);

            const updatedJobs = await getJobs();
            setJobs(updatedJobs);

            setEditingCell(null);

        } catch (error) {
            setError("Company and position cannot be blank.");
        } finally {
            setSavingJobId(null);
        }
    }

    // Filter and Search Jobs Logic
    const filteredJobs = sortJobs(
            jobs.filter((job) => {
            const search = searchTerm.toLowerCase();

            const matchesSearch =
                job.company?.toLowerCase().includes(search) ||
                job.position?.toLowerCase().includes(search) ||
                job.location?.toLowerCase().includes(search) ||
                job.dateApplied?.toLowerCase().includes(search) ||
                job.salaryExpectation?.toLowerCase().includes(search) ||
                job.industry?.toLowerCase().includes(search) ||
                job.contactPerson?.toLowerCase().includes(search) ||
                job.source?.toLowerCase().includes(search) ||
                job.notes?.toLowerCase().includes(search);

            const matchesStatus =
                statusFilter === "ALL" || job.status === statusFilter;

            return matchesSearch && matchesStatus;
        })
    );

    function sortJobs(jobs) {
        if (!sortConfig.key) return jobs;

        return [...jobs].sort((a,b) => {
            const aValue = a[sortConfig.key];
            const bValue = b[sortConfig.key];

            if (!aValue) return 1;
            if (!bValue) return -1;

            if (sortConfig.key === "dateApplied") {
                return sortConfig.direction === "asc"
                ? new Date(aValue) - new Date(bValue)
                    : new Date(bValue) - new Date(aValue);
            }

            if (typeof aValue === "string") {
                return sortConfig.direction === "asc"
                ? aValue.localeCompare(bValue)
                    : bValue.localeCompare(aValue);
            }

            return 0;
        })
    }

    function handleSort(key) {
        if (sortConfig.key !== key) {
            setSortConfig({key, direction: "asc"});
            setHasUserSorted(true);
            return;
        }

        if (sortConfig.direction === "asc") {
            setSortConfig({key, direction: "desc"});
        } else if (sortConfig.direction === "desc") {
            // Back to NO sort
            setSortConfig({key: "", direction: "asc"});
            setHasUserSorted(false);
        }
    }

    function getSortIcon(key) {
        if (!hasUserSorted || sortConfig.key !== key) {
            return "↕";
        }

        return sortConfig.direction === "asc" ? "↑" : "↓";
    }

    function hasTooLongField(data) {
        return Object.entries(data).some(([key, value]) => {
            if (typeof value !== "string") return false;
            return value.length > MAX_FIELD_LENGTH;
        })
    }

    async function handleInlineAddJob() {
        if (!isFormValid()) {
            setError("Company and position are required.");
            return;
        }

        if (hasTooLongField(formData)) {
            setError(`Fields cannot be longer than ${MAX_FIELD_LENGTH} characters.`)
            return;
        }

        setIsSubmitting(true);

        try {
            await createJob(formData);

            const updatedJobs = await getJobs();
            setJobs(updatedJobs);

            setFormData({
                company: "",
                position: "",
                status: "APPLIED",
                notes: "",
                location: "",
                dateApplied: getTodayDate(),
                salaryExpectation: "",
                industry: "",
                contactPerson: "",
                source: "",
            });

            setIsAddingRow(false);
        } catch (error) {
            setError("Company and position are required.");
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <div className="dashboard-container">
            <h1 className="dashboard-title">
                {firstName ? `Welcome back, ${firstName}` : "Job Tracker Dashboard"}
            </h1>

            {error && <p className="dashboard-error">{error}</p>}

            <div className="table-controls">
                <input
                    className="search-input"
                    placeholder="Search keywords..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <select
                    className="filter-select"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                >
                    <option value="ALL">All Statuses</option>
                    <option value="APPLIED">Applied</option>
                    <option value="INTERVIEWING">Interviewing</option>
                    <option value="REJECTED">Rejected</option>
                    <option value="ACCEPTED">Accepted</option>
                </select>
            </div>

            <div className="table-wrapper">
                <table className="jobs-table">
                    <thead>
                    <tr>
                        <th
                            className={hasUserSorted && sortConfig.key === "company" ? "sorted-column" : ""}
                            onClick={() => handleSort("company")}
                        >
                            Company <span className="sort-icon">{getSortIcon("company")}</span>
                        </th>
                        <th
                            className={hasUserSorted && sortConfig.key === "position" ? "sorted-column" : ""}
                            onClick={() => handleSort("position")}
                        >
                            Position <span className="sort-icon">{getSortIcon("position")}</span>
                        </th>
                        <th
                            className={hasUserSorted && sortConfig.key === "status" ? "sorted-column" : ""}
                            onClick={() => handleSort("status")}
                        >
                            Status <span className="sort-icon">{getSortIcon("status")}</span>
                        </th>
                        <th
                            className={hasUserSorted && sortConfig.key === "location" ? "sorted-column" : ""}
                            onClick={() => handleSort("location")}
                        >
                            Location <span className="sort-icon">{getSortIcon("location")}</span>
                        </th>
                        <th
                            className={hasUserSorted && sortConfig.key === "dateApplied" ? "sorted-column" : ""}
                            onClick={() => handleSort("dateApplied")}
                        >
                            Date Applied <span className="sort-icon">{getSortIcon("dateApplied")}</span>
                        </th>
                        <th
                            className={hasUserSorted && sortConfig.key === "salaryExpectation" ? "sorted-column" : ""}
                            onClick={() => handleSort("salaryExpectation")}
                        >
                            Salary <span className="sort-icon">{getSortIcon("salaryExpectation")}</span>
                        </th>
                        <th
                            className={hasUserSorted && sortConfig.key === "industry" ? "sorted-column" : ""}
                            onClick={() => handleSort("industry")}
                        >
                            Industry <span className="sort-icon">{getSortIcon("industry")}</span>
                        </th>
                        <th
                            className={hasUserSorted && sortConfig.key === "contactPerson" ? "sorted-column" : ""}
                            onClick={() => handleSort("contactPerson")}
                        >
                            Contact <span className="sort-icon">{getSortIcon("contactPerson")}</span>
                        </th>
                        <th
                            className={hasUserSorted && sortConfig.key === "source" ? "sorted-column" : ""}
                            onClick={() => handleSort("source")}
                        >
                            Source <span className="sort-icon">{getSortIcon("source")}</span>
                        </th>
                        <th>Notes</th>
                    </tr>
                    </thead>

                    <tbody>

                    {!isAddingRow ? (
                        <tr className="add-job-row" onClick={() => setIsAddingRow(true)}>
                            <td colSpan="10">
                                + Add Job
                            </td>
                        </tr>
                    ) : (
                        <>
                            <tr className="new-job-row">

                                <td>
                                    <textarea
                                        name="company"
                                        placeholder="Company"
                                        value={formData.company}
                                        maxLength={MAX_FIELD_LENGTH}
                                        onChange={(e) => {handleChange(e);
                                            e.target.style.height = "auto";
                                            e.target.style.height = e.target.scrollHeight + "px";
                                        }}
                                        onFocus={(e) => {
                                            e.target.style.height = "auto";
                                            e.target.style.height = e.target.scrollHeight + "px";
                                        }}
                                        autoFocus
                                    />
                                </td>

                                <td>
                                    <textarea
                                        name="position"
                                        placeholder="Position"
                                        value={formData.position}
                                        maxLength={MAX_FIELD_LENGTH}
                                        onChange={(e) => {handleChange(e);
                                            e.target.style.height = "auto";
                                            e.target.style.height = e.target.scrollHeight + "px";
                                        }}
                                        onFocus={(e) => {
                                            e.target.style.height = "auto";
                                            e.target.style.height = e.target.scrollHeight + "px";
                                        }}
                                        autoFocus
                                    />
                                </td>

                                <td>
                                    <select
                                        name="status"
                                        value={formData.status}
                                        onChange={handleChange}
                                        className={`status-select status-${formData.status.toLowerCase()}`}
                                    >
                                        <option value="APPLIED">Applied</option>
                                        <option value="INTERVIEWING">Interviewing</option>
                                        <option value="REJECTED">Rejected</option>
                                        <option value="ACCEPTED">Accepted</option>
                                    </select>
                                </td>

                                <td>
                                    <textarea
                                        name="location"
                                        placeholder="Location"
                                        value={formData.location}
                                        maxLength={MAX_FIELD_LENGTH}
                                        onChange={(e) => {handleChange(e);
                                            e.target.style.height = "auto";
                                            e.target.style.height = e.target.scrollHeight + "px";
                                        }}
                                        onFocus={(e) => {
                                            e.target.style.height = "auto";
                                            e.target.style.height = e.target.scrollHeight + "px";
                                        }}
                                        autoFocus
                                    />
                                </td>

                                <td>
                                    <input
                                        type="date"
                                        name="dateApplied"
                                        placeholder="dateApplied"
                                        value={formData.dateApplied}
                                        onChange={(e) => {handleChange(e);
                                            e.target.style.height = "auto";
                                            e.target.style.height = e.target.scrollHeight + "px";
                                        }}
                                        onFocus={(e) => {
                                            e.target.style.height = "auto";
                                            e.target.style.height = e.target.scrollHeight + "px";
                                        }}
                                        autoFocus
                                    />
                                </td>

                                <td>
                                    <textarea
                                        name="salaryExpectation"
                                        placeholder="Salary (e.g. 80k)"
                                        value={formData.salaryExpectation}
                                        maxLength={MAX_FIELD_LENGTH}
                                        onChange={(e) => {handleChange(e);
                                            e.target.style.height = "auto";
                                            e.target.style.height = e.target.scrollHeight + "px";
                                        }}
                                        onFocus={(e) => {
                                            e.target.style.height = "auto";
                                            e.target.style.height = e.target.scrollHeight + "px";
                                        }}
                                        autoFocus
                                    />
                                </td>

                                <td>
                                    <textarea
                                        name="industry"
                                        placeholder="Industry"
                                        value={formData.industry}
                                        maxLength={MAX_FIELD_LENGTH}
                                        onChange={(e) => {handleChange(e);
                                            e.target.style.height = "auto";
                                            e.target.style.height = e.target.scrollHeight + "px";
                                        }}
                                        onFocus={(e) => {
                                            e.target.style.height = "auto";
                                            e.target.style.height = e.target.scrollHeight + "px";
                                        }}
                                        autoFocus
                                    />
                                </td>

                                <td>
                                    <textarea
                                        name="contactPerson"
                                        placeholder="Contact"
                                        value={formData.contactPerson}
                                        maxLength={MAX_FIELD_LENGTH}
                                        onChange={(e) => {handleChange(e);
                                            e.target.style.height = "auto";
                                            e.target.style.height = e.target.scrollHeight + "px";
                                        }}
                                        onFocus={(e) => {
                                            e.target.style.height = "auto";
                                            e.target.style.height = e.target.scrollHeight + "px";
                                        }}
                                        autoFocus
                                    />
                                </td>

                                <td>
                                    <textarea
                                        name="source"
                                        placeholder="Source (LinkedIn, Referral, etc.)"
                                        value={formData.source}
                                        maxLength={MAX_FIELD_LENGTH}
                                        onChange={(e) => {handleChange(e);
                                            e.target.style.height = "auto";
                                            e.target.style.height = e.target.scrollHeight + "px";
                                        }}
                                        onFocus={(e) => {
                                            e.target.style.height = "auto";
                                            e.target.style.height = e.target.scrollHeight + "px";
                                        }}
                                        autoFocus
                                    />
                                </td>

                                <td>
                                    <textarea
                                        name="notes"
                                        placeholder="Notes"
                                        value={formData.notes}
                                        maxLength={MAX_FIELD_LENGTH}
                                        onChange={(e) => {handleChange(e);
                                            e.target.style.height = "auto";
                                            e.target.style.height = e.target.scrollHeight + "px";
                                        }}
                                        onFocus={(e) => {
                                            e.target.style.height = "auto";
                                            e.target.style.height = e.target.scrollHeight + "px";
                                        }}
                                        autoFocus
                                    />
                                </td>

                            </tr>

                            <tr className="new-job-hint-row">
                                <td colSpan="10">
                                    <span>Press Enter to save · Esc to cancel</span>
                                </td>
                            </tr>
                        </>
                    )}

                    {filteredJobs.length === 0 ? (
                        <tr>
                            <td colSpan="10" className="empty-state">No jobs found.</td>
                        </tr>
                    ) : (
                        filteredJobs.map((job) => (
                            <tr key={job.id} className="job-row">
                                <td
                                    className="editable-cell"
                                    onClick={() => {
                                        if (savingJobId === job.id) return;
                                        setEditingCell({jobId: job.id, field: "company"});
                                        setEditFormData({company: job.company, position: job.position, status: job.status, notes: job.notes, location: job.location, dateApplied: job.dateApplied, salaryExpectation: job.salaryExpectation, industry: job.industry, contactPerson: job.contactPerson, source: job.source,});
                                    }}>
                                    {editingCell?.jobId === job.id && editingCell?.field === "company" ? (
                                        <textarea
                                            name="company"
                                            value={editFormData.company}
                                            onChange={(e) => {handleEditChange(e);
                                                e.target.style.height = "auto";
                                                e.target.style.height = e.target.scrollHeight + "px";
                                            }}
                                            onFocus={(e) => {
                                                e.target.style.height = "auto";
                                                e.target.style.height = e.target.scrollHeight + "px";
                                            }}
                                            onKeyDown={(e) => {
                                                if (e.key === "Enter" && !e.shiftKey) {
                                                    e.preventDefault()
                                                    void handleSave(job.id);
                                                }
                                            }}
                                            onBlur={() => handleSave(job.id)}
                                            maxLength={MAX_FIELD_LENGTH}
                                            autoFocus
                                        />
                                    ) : savingJobId === job.id ? ( // Used for loading state
                                        <span className="saving-text">Saving...</span>
                                    ) : (
                                        job.company
                                    )}
                                </td>

                                <td
                                    className="editable-cell"
                                    onClick={() => {
                                        if (savingJobId === job.id) return;
                                        setEditingCell({jobId: job.id, field: "position"});
                                        setEditFormData({company: job.company, position: job.position, status: job.status, notes: job.notes, location: job.location, dateApplied: job.dateApplied, salaryExpectation: job.salaryExpectation, industry: job.industry, contactPerson: job.contactPerson, source: job.source,});
                                    }}>
                                    {editingCell?.jobId === job.id && editingCell?.field === "position" ? (
                                        <textarea
                                            name="position"
                                            value={editFormData.position}
                                            onChange={(e) => {handleEditChange(e);
                                                e.target.style.height = "auto";
                                                e.target.style.height = e.target.scrollHeight + "px";
                                            }}
                                            onFocus={(e) => {
                                                e.target.style.height = "auto";
                                                e.target.style.height = e.target.scrollHeight + "px";
                                            }}
                                            onKeyDown={(e) => {
                                                if (e.key === "Enter" && !e.shiftKey) {
                                                    e.preventDefault()
                                                    void handleSave(job.id);
                                                }
                                            }}
                                            onBlur={() => handleSave(job.id)}
                                            maxLength={MAX_FIELD_LENGTH}
                                            autoFocus
                                        />
                                    ) : savingJobId === job.id ? ( // Used for loading state
                                        <span className="saving-text">Saving...</span>
                                    ) : (
                                        job.position
                                    )}
                                </td>

                                <td>
                                    <select
                                        className={`status-select status-${job.status.toLowerCase()}`}
                                        value={job.status}
                                        onChange={(e) => {
                                            const updatedData = {
                                                company: job.company,
                                                position: job.position,
                                                status: e.target.value,
                                                notes: job.notes,
                                                location: job.location,
                                                dateApplied: job.dateApplied,
                                                salaryExpectation: job.salaryExpectation,
                                                industry: job.industry,
                                                contactPerson: job.contactPerson,
                                                source: job.source,
                                            };

                                            void handleSave(job.id, updatedData)
                                        }}
                                    >
                                        <option value="APPLIED">Applied</option>
                                        <option value="INTERVIEWING">Interviewing</option>
                                        <option value="REJECTED">Rejected</option>
                                        <option value="ACCEPTED">Accepted</option>
                                    </select>
                                </td>

                                <td
                                    className="editable-cell"
                                    onClick={() => {
                                        if (savingJobId === job.id) return;
                                        setEditingCell({jobId: job.id, field: "location"});
                                        setEditFormData({company: job.company, position: job.position, status: job.status, notes: job.notes, location: job.location, dateApplied: job.dateApplied, salaryExpectation: job.salaryExpectation, industry: job.industry, contactPerson: job.contactPerson, source: job.source,});
                                    }}>
                                    {editingCell?.jobId === job.id && editingCell?.field === "location" ? (
                                        <textarea
                                            name="location"
                                            value={editFormData.location}
                                            onChange={(e) => {handleEditChange(e);
                                                e.target.style.height = "auto";
                                                e.target.style.height = e.target.scrollHeight + "px";
                                            }}
                                            onFocus={(e) => {
                                                e.target.style.height = "auto";
                                                e.target.style.height = e.target.scrollHeight + "px";
                                            }}
                                            onKeyDown={(e) => {
                                                if (e.key === "Enter" && !e.shiftKey) {
                                                    e.preventDefault()
                                                    void handleSave(job.id);
                                                }
                                            }}
                                            onBlur={() => handleSave(job.id)}
                                            maxLength={MAX_FIELD_LENGTH}
                                            autoFocus
                                        />
                                    ) : savingJobId === job.id ? ( // Used for loading state
                                        <span className="saving-text">Saving...</span>
                                    ) : (
                                        job.location
                                    )}
                                </td>

                                <td
                                    className="editable-cell"
                                    onClick={() => {
                                        if (savingJobId === job.id) return;
                                        setEditingCell({jobId: job.id, field: "dateApplied"});
                                        setEditFormData({company: job.company, position: job.position, status: job.status, notes: job.notes, location: job.location, dateApplied: job.dateApplied, salaryExpectation: job.salaryExpectation, industry: job.industry, contactPerson: job.contactPerson, source: job.source,});
                                    }}>
                                    {editingCell?.jobId === job.id && editingCell?.field === "dateApplied" ? (
                                        <input
                                            type="date"
                                            name="dateApplied"
                                            value={editFormData.dateApplied}
                                            onChange={handleEditChange}
                                            onKeyDown={(e) => {
                                                if (e.key === "Enter" && !e.shiftKey) {
                                                    e.preventDefault()
                                                    void handleSave(job.id);
                                                }
                                            }}
                                            onBlur={() => handleSave(job.id)}
                                            maxLength={MAX_FIELD_LENGTH}
                                            autoFocus
                                        />
                                    ) : savingJobId === job.id ? ( // Used for loading state
                                        <span className="saving-text">Saving...</span>
                                    ) : (
                                        job.dateApplied
                                    )}
                                </td>

                                <td
                                    className="editable-cell"
                                    onClick={() => {
                                        if (savingJobId === job.id) return;
                                        setEditingCell({jobId: job.id, field: "salaryExpectation"});
                                        setEditFormData({company: job.company, position: job.position, status: job.status, notes: job.notes, location: job.location, dateApplied: job.dateApplied, salaryExpectation: job.salaryExpectation, industry: job.industry, contactPerson: job.contactPerson, source: job.source,});
                                    }}>
                                    {editingCell?.jobId === job.id && editingCell?.field === "salaryExpectation" ? (
                                        <textarea
                                            name="salaryExpectation"
                                            value={editFormData.salaryExpectation}
                                            onChange={(e) => {handleEditChange(e);
                                                e.target.style.height = "auto";
                                                e.target.style.height = e.target.scrollHeight + "px";
                                            }}
                                            onFocus={(e) => {
                                                e.target.style.height = "auto";
                                                e.target.style.height = e.target.scrollHeight + "px";
                                            }}
                                            onKeyDown={(e) => {
                                                if (e.key === "Enter" && !e.shiftKey) {
                                                    e.preventDefault()
                                                    void handleSave(job.id);
                                                }
                                            }}
                                            onBlur={() => handleSave(job.id)}
                                            maxLength={MAX_FIELD_LENGTH}
                                            autoFocus
                                        />
                                    ) : savingJobId === job.id ? ( // Used for loading state
                                        <span className="saving-text">Saving...</span>
                                    ) : (
                                        job.salaryExpectation
                                    )}
                                </td>

                                <td
                                    className="editable-cell"
                                    onClick={() => {
                                        if (savingJobId === job.id) return;
                                        setEditingCell({jobId: job.id, field: "industry"});
                                        setEditFormData({company: job.company, position: job.position, status: job.status, notes: job.notes, location: job.location, dateApplied: job.dateApplied, salaryExpectation: job.salaryExpectation, industry: job.industry, contactPerson: job.contactPerson, source: job.source,});
                                    }}>
                                    {editingCell?.jobId === job.id && editingCell?.field === "industry" ? (
                                        <textarea
                                            name="industry"
                                            value={editFormData.industry}
                                            onChange={(e) => {handleEditChange(e);
                                                e.target.style.height = "auto";
                                                e.target.style.height = e.target.scrollHeight + "px";
                                            }}
                                            onFocus={(e) => {
                                                e.target.style.height = "auto";
                                                e.target.style.height = e.target.scrollHeight + "px";
                                            }}
                                            onKeyDown={(e) => {
                                                if (e.key === "Enter" && !e.shiftKey) {
                                                    e.preventDefault()
                                                    void handleSave(job.id);
                                                }
                                            }}
                                            onBlur={() => handleSave(job.id)}
                                            maxLength={MAX_FIELD_LENGTH}
                                            autoFocus
                                        />
                                    ) : savingJobId === job.id ? ( // Used for loading state
                                        <span className="saving-text">Saving...</span>
                                    ) : (
                                        job.industry
                                    )}
                                </td>

                                <td
                                    className="editable-cell"
                                    onClick={() => {
                                        if (savingJobId === job.id) return;
                                        setEditingCell({jobId: job.id, field: "contactPerson"});
                                        setEditFormData({company: job.company, position: job.position, status: job.status, notes: job.notes, location: job.location, dateApplied: job.dateApplied, salaryExpectation: job.salaryExpectation, industry: job.industry, contactPerson: job.contactPerson, source: job.source,});
                                    }}>
                                    {editingCell?.jobId === job.id && editingCell?.field === "contactPerson" ? (
                                        <textarea
                                            name="contactPerson"
                                            value={editFormData.contactPerson}
                                            onChange={(e) => {handleEditChange(e);
                                                e.target.style.height = "auto";
                                                e.target.style.height = e.target.scrollHeight + "px";
                                            }}
                                            onFocus={(e) => {
                                                e.target.style.height = "auto";
                                                e.target.style.height = e.target.scrollHeight + "px";
                                            }}
                                            onKeyDown={(e) => {
                                                if (e.key === "Enter" && !e.shiftKey) {
                                                    e.preventDefault()
                                                    void handleSave(job.id);
                                                }
                                            }}
                                            onBlur={() => handleSave(job.id)}
                                            maxLength={MAX_FIELD_LENGTH}
                                            autoFocus
                                        />
                                    ) : savingJobId === job.id ? ( // Used for loading state
                                        <span className="saving-text">Saving...</span>
                                    ) : (
                                        job.contactPerson
                                    )}
                                </td>

                                <td
                                    className="editable-cell"
                                    onClick={() => {
                                        if (savingJobId === job.id) return;
                                        setEditingCell({jobId: job.id, field: "source"});
                                        setEditFormData({company: job.company, position: job.position, status: job.status, notes: job.notes, location: job.location, dateApplied: job.dateApplied, salaryExpectation: job.salaryExpectation, industry: job.industry, contactPerson: job.contactPerson, source: job.source,});
                                    }}>
                                    {editingCell?.jobId === job.id && editingCell?.field === "source" ? (
                                        <textarea
                                            name="source"
                                            value={editFormData.source}
                                            onChange={(e) => {handleEditChange(e);
                                                e.target.style.height = "auto";
                                                e.target.style.height = e.target.scrollHeight + "px";
                                            }}
                                            onFocus={(e) => {
                                                e.target.style.height = "auto";
                                                e.target.style.height = e.target.scrollHeight + "px";
                                            }}
                                            onKeyDown={(e) => {
                                                if (e.key === "Enter" && !e.shiftKey) {
                                                    e.preventDefault()
                                                    void handleSave(job.id);
                                                }
                                            }}
                                            onBlur={() => handleSave(job.id)}
                                            maxLength={MAX_FIELD_LENGTH}
                                            autoFocus
                                        />
                                    ) : savingJobId === job.id ? ( // Used for loading state
                                        <span className="saving-text">Saving...</span>
                                    ) : (
                                        job.source
                                    )}
                                </td>

                                <td
                                    className="editable-cell notes-cell"
                                    onClick={() => {
                                        if (savingJobId === job.id) return;
                                        setEditingCell({jobId: job.id, field: "notes"});
                                        setEditFormData({company: job.company, position: job.position, status: job.status, notes: job.notes, location: job.location, dateApplied: job.dateApplied, salaryExpectation: job.salaryExpectation, industry: job.industry, contactPerson: job.contactPerson, source: job.source,});
                                    }}>
                                    {editingCell?.jobId === job.id && editingCell?.field === "notes" ? (
                                        <textarea
                                            name="notes"
                                            value={editFormData.notes}
                                            onChange={(e) => {handleEditChange(e);
                                                e.target.style.height = "auto";
                                                e.target.style.height = e.target.scrollHeight + "px";
                                            }}
                                            onFocus={(e) => {
                                                e.target.style.height = "auto";
                                                e.target.style.height = e.target.scrollHeight + "px";
                                            }}
                                            onKeyDown={(e) => {
                                                if (e.key === "Enter" && !e.shiftKey) {
                                                    e.preventDefault()
                                                    void handleSave(job.id);
                                                }
                                            }}
                                            onBlur={() => handleSave(job.id)}
                                            maxLength={MAX_FIELD_LENGTH}
                                            autoFocus
                                        />
                                    ) : savingJobId === job.id ? ( // Used for loading state
                                        <span className="saving-text">Saving...</span>
                                    ) : (
                                        <span className="notes-content">{job.notes}</span>
                                    )}

                                    <button
                                        className="row-delete-button"
                                        onClick={(e) => {e.stopPropagation(); void handleDelete(job.id);}}
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="16"
                                            height="16"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        >
                                            <path d="M3 6h18" />
                                            <path d="M8 6V4h8v2" />
                                            <path d="M19 6l-1 14H6L5 6" />
                                            <path d="M10 11v6" />
                                            <path d="M14 11v6" />
                                        </svg>
                                    </button>

                                </td>

                            </tr>
                        ))
                    )}
                    </tbody>
                </table>
            </div>

        </div>
    );
}

export default Dashboard;