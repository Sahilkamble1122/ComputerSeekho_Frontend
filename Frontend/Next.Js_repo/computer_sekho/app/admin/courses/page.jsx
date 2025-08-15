"use client";
import { useState, useEffect } from "react";

export default function CoursePage() {
  const [courses, setCourses] = useState([]);
  const [batches, setBatches] = useState([]);
  const [activeTab, setActiveTab] = useState("courses");
  const [formVisible, setFormVisible] = useState(false);
  const [formData, setFormData] = useState({
    courseId: "",
    courseName: "",
    courseDescription: "",
    courseDuration: "",
    courseSyllabus: "",
    ageGrpType: "",
    courseIsActive: true,
    coverPhoto: "",
    videoId: null,
  });
  const [batchFormData, setBatchFormData] = useState({
    batchId: null,
    batchName: "",
    batchStartTime: "",
    batchEndTime: "",
    courseId: "",
    presentationDate: "",
    courseFees: "",
    courseFeesFrom: "",
    courseFeesTo: "",
    batchIsActive: true,
    batchLogo: "",
  });
  const [coverPhotoFile, setCoverPhotoFile] = useState(null);
  const [batchLogoFile, setBatchLogoFile] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [batchSearchTerm, setBatchSearchTerm] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState("");
  
  // Pagination state for courses
  const [currentCoursePage, setCurrentCoursePage] = useState(1);
  const [coursesPerPage] = useState(10);

  // Pagination state for batches
  const [currentBatchPage, setCurrentBatchPage] = useState(1);
  const [batchesPerPage] = useState(10);

  const API_BASE = "http://localhost:8080/api";

  useEffect(() => {
    fetchCourses();
    fetchBatches();
  }, []);

  const fetchCourses = async () => {
    try {
      const token = sessionStorage.getItem("token");
      const response = await fetch(`${API_BASE}/courses`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      if (!response.ok) {
        if (response.status === 404) {
          console.error("Backend API endpoint not found. Please ensure your Spring Boot backend is running.");
          return;
        }
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      setCourses(data);
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  };

  const fetchBatches = async () => {
    try {
      const token = sessionStorage.getItem("token");
      const response = await fetch(`${API_BASE}/batches`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      if (!response.ok) {
        if (response.status === 404) {
          console.error("Backend API endpoint not found. Please ensure your Spring Boot backend is running.");
          return;
        }
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      setBatches(data);
    } catch (error) {
      console.error("Error fetching batches:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleBatchChange = (e) => {
    const { name, value, type, checked } = e.target;
    setBatchFormData({
      ...batchFormData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setCoverPhotoFile(file);
  };

  const uploadFile = async (file) => {
    if (!file) return "";
    const formData = new FormData();
    formData.append("file", file);

    try {
      const token = sessionStorage.getItem("token");
      const res = await fetch("/api/courses/upload", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        return data.filePath || "";
      }
    } catch (err) {
      console.error("File upload error", err);
    }
    return "";
  };

  const resetCourseForm = () => {
    setFormData({
      courseId: "",
      courseName: "",
      courseDescription: "",
      courseDuration: "",
      courseSyllabus: "",
      ageGrpType: "",
      courseIsActive: true,
      coverPhoto: "",
      videoId: null,
    });
    setCoverPhotoFile(null);
  };

  const resetBatchForm = () => {
    setBatchFormData({
      batchId: null,
      batchName: "",
      batchStartTime: "",
      batchEndTime: "",
      courseId: "",
      presentationDate: "",
      courseFees: "",
      courseFeesFrom: "",
      courseFeesTo: "",
      batchIsActive: true,
      batchLogo: "",
    });
    setBatchLogoFile(null);
  };

  const closeForm = () => {
    setFormVisible(false);
    if (activeTab === "courses") {
      resetCourseForm();
    } else {
      resetBatchForm();
    }
  };

  // Function to scroll to form smoothly
  const scrollToForm = () => {
    setTimeout(() => {
      // More specific selector to find the form container
      let formElement = null;
      
      // Try to find the form based on the active tab
      if (activeTab === "courses") {
        formElement = document.querySelector('form[onSubmit]')?.closest('.bg-white.p-6.rounded.shadow');
      } else if (activeTab === "batches") {
        // For batch form, look for the specific batch form container
        formElement = document.querySelector('form[onSubmit="handleBatchSubmit"]')?.closest('.bg-white.p-6.rounded.shadow');
      }
      
      // Fallback: try to find any form container
      if (!formElement) {
        formElement = document.querySelector('.bg-white.p-6.rounded.shadow.space-y-6') || 
                     document.querySelector('.bg-white.p-6.rounded.shadow.space-y-4:last-child');
      }
      
      if (formElement) {
        formElement.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'start',
          inline: 'nearest'
        });
      } else {
        console.log('Form element not found for scrolling');
      }
    }, 150); // Increased delay to ensure form is rendered
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    setIsSubmitting(true);
    setSubmitError("");
    
    // Validate required fields
    if (!formData.courseName || !formData.courseDescription || !formData.courseDuration || !formData.courseSyllabus || !formData.ageGrpType) {
      setSubmitError("Please fill in all required fields: Course Name, Description, Duration, Syllabus, and Age Group");
      setIsSubmitting(false);
      return;
    }

    // Validate field lengths and formats
    if (formData.courseName.trim().length < 2 || formData.courseName.trim().length > 100) {
      setSubmitError("Course name must be between 2 and 100 characters");
      setIsSubmitting(false);
      return;
    }

    if (formData.courseDescription.trim().length > 1000) {
      setSubmitError("Course description must not exceed 1000 characters");
      setIsSubmitting(false);
      return;
    }

    if (formData.courseSyllabus.trim().length > 2000) {
      setSubmitError("Course syllabus must not exceed 2000 characters");
      setIsSubmitting(false);
      return;
    }

    // Validate course duration is a positive number
    const duration = parseInt(formData.courseDuration);
    if (isNaN(duration) || duration <= 0) {
      setSubmitError("Course duration must be a positive number");
      setIsSubmitting(false);
      return;
    }

    const uploadedCoverPath = await uploadFile(coverPhotoFile);

    const payload = {
      courseId: formData.courseId || null,
      courseName: formData.courseName.trim(),
      courseDescription: formData.courseDescription.trim(),
      courseDuration: duration,
      courseSyllabus: formData.courseSyllabus.trim(),
      ageGrpType: formData.ageGrpType.trim(),
      courseIsActive: formData.courseIsActive,
      coverPhoto: uploadedCoverPath || formData.coverPhoto || "",
      videoId: null,
    };

    try {
      const token = sessionStorage.getItem("token");
      
      if (!token) {
        setSubmitError("Authentication token not found. Please log in again.");
        setIsSubmitting(false);
        return;
      }
      
      const url = formData.courseId 
        ? `${API_BASE}/courses/${formData.courseId}` 
        : `${API_BASE}/courses`;
      
      let requestBody;
      try {
        requestBody = JSON.stringify(payload);
      } catch (serializeError) {
        console.error("Error serializing payload:", serializeError);
        setSubmitError("Error preparing data for submission");
        setIsSubmitting(false);
        return;
      }
      
      const response = await fetch(url, {
        method: formData.courseId ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
          "Accept": "application/json",
          "Cache-Control": "no-cache"
        },
        body: requestBody,
      });

      if (response.ok) {
        setSubmitSuccess(formData.courseId ? "Course Updated Successfully!" : "Course Added Successfully!");
        setTimeout(() => {
          resetCourseForm();
          closeForm();
          fetchCourses();
        }, 1500);
      } else {
        let errorMessage = 'Unknown error';
        let responseText = '';
        
        try {
          responseText = await response.text();
          
          if (responseText && responseText.trim()) {
            try {
              const errorData = JSON.parse(responseText);
              errorMessage = errorData.message || errorData.error || `HTTP ${response.status}: ${response.statusText}`;
            } catch (jsonParseError) {
              errorMessage = responseText;
            }
          } else {
            errorMessage = `HTTP ${response.status}: ${response.statusText}`;
          }
        } catch (textError) {
          errorMessage = `HTTP ${response.status}: ${response.statusText}`;
        }
        
        if (response.status === 400) {
          setSubmitError(`Bad Request: ${errorMessage}. Please check your input data.`);
        } else {
          setSubmitError(`Save failed: ${errorMessage}`);
        }
      }
    } catch (err) {
      console.error("Error saving course:", err);
      setSubmitError("Error saving course. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBatchSubmit = async (e) => {
    e.preventDefault();
    
    // Validate required fields
    if (!batchFormData.batchName || !batchFormData.courseId || !batchFormData.courseFees) {
      alert("Please fill in all required fields");
      return;
    }
    
    let logoPath = batchFormData.batchLogo || "";

    // Upload logo if new file is selected
    if (batchLogoFile) {
      const formData = new FormData();
      formData.append("file", batchLogoFile);

      try {
        const res = await fetch("/api/uploadBatchLogo", {
          method: "POST",
          body: formData,
        });

        if (!res.ok) throw new Error("Upload failed");

        const data = await res.json();
        logoPath = data.path;
      } catch (error) {
        alert("Logo upload failed. Please try again.");
        return;
      }
    }

    const method = batchFormData.batchId ? "PUT" : "POST";
    const url = batchFormData.batchId
      ? `${API_BASE}/batches/${batchFormData.batchId}`
      : `${API_BASE}/batches`;

    const batchData = {
      ...batchFormData,
      batchLogo: logoPath,
    };

    try {
      const token = sessionStorage.getItem("token");
      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(batchData),
      });

      if (res.ok) {
        alert(`✅ Batch ${batchFormData.batchId ? "updated" : "created"} successfully!`);
        resetBatchForm();
        closeForm();
        fetchBatches();
      } else {
        const errorData = await res.json();
        alert(`❌ Failed to save batch: ${errorData.message || 'Unknown error'}`);
      }
    } catch (err) {
      console.error("Error saving batch", err);
      alert("Error saving batch. Please try again.");
    }
  };

  const handleEdit = (course) => {
    setFormVisible(true);
    setFormData({
      ...course,
      courseDuration: course.courseDuration?.toString() || "",
      videoId: course.videoId || null, // Handle videoId from backend
    });
  };
  const handleDelete = async (courseId) => {
    if (!window.confirm("Are you sure you want to delete this course?")) return;
    try {
      const token = sessionStorage.getItem("token");
      const res = await fetch(`${API_BASE}/courses/${courseId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        fetchCourses();
        alert("Course deleted successfully!");
      } else {
        alert("Delete failed");
      }
    } catch (err) {
      console.error("Error deleting course:", err);
    }
  };

  const handleBatchEdit = (batch) => {
    setFormVisible(true);
    setBatchFormData({
      ...batch,
      courseFees: batch.courseFees?.toString() || "",
    });
  };

  const handleBatchLogoChange = (e) => {
    const file = e.target.files[0];
    setBatchLogoFile(file);
  };

  const handleBatchDelete = async (batchId) => {
    if (!window.confirm("Are you sure you want to delete this batch?")) return;
    try {
      const token = sessionStorage.getItem("token");
      const res = await fetch(`${API_BASE}/batches/${batchId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        fetchBatches();
        alert("Batch deleted successfully!");
      } else {
        alert("Delete failed");
      }
    } catch (err) {
      console.error("Error deleting batch", err);
    }
  };

  const filteredCourses = courses.filter(
    (course) =>
      course.courseName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.courseDescription.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredBatches = batches.filter((batch) =>
    (batch.batchName || "")
      .toLowerCase()
      .includes(batchSearchTerm.toLowerCase())
  );

  // Pagination logic for courses
  const indexOfLastCourse = currentCoursePage * coursesPerPage;
  const indexOfFirstCourse = indexOfLastCourse - coursesPerPage;
  const currentCourses = filteredCourses.slice(
    indexOfFirstCourse,
    indexOfLastCourse
  );
  const totalCoursePages = Math.ceil(filteredCourses.length / coursesPerPage);

  // Pagination logic for batches
  const indexOfLastBatch = currentBatchPage * batchesPerPage;
  const indexOfFirstBatch = indexOfLastBatch - batchesPerPage;
  const currentBatches = filteredBatches.slice(
    indexOfFirstBatch,
    indexOfLastBatch
  );
  const totalBatchPages = Math.ceil(filteredBatches.length / batchesPerPage);

  // Pagination handlers for courses
  const handleCoursePageChange = (pageNumber) => {
    setCurrentCoursePage(pageNumber);
  };

  // Pagination handlers for batches
  const handleBatchPageChange = (pageNumber) => {
    setCurrentBatchPage(pageNumber);
  };

  // Reset pagination when search changes
  useEffect(() => {
    setCurrentCoursePage(1);
  }, [searchTerm]);

  useEffect(() => {
    setCurrentBatchPage(1);
  }, [batchSearchTerm]);

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-8">
      <h1 className="text-3xl font-bold text-center text-black mb-4">
        Course & Batch Management
      </h1>

      {/* Tabs */}
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
        <button
          onClick={() => setActiveTab("courses")}
          className={`flex-1 py-2 px-4 rounded-md font-medium transition-colors ${
            activeTab === "courses"
              ? "bg-white text-black shadow-sm"
              : "text-gray-600 hover:text-gray-800"
          }`}
        >
          Courses
        </button>
        <button
          onClick={() => setActiveTab("batches")}
          className={`flex-1 py-2 px-4 rounded-md font-medium transition-colors ${
            activeTab === "batches"
              ? "bg-white text-black shadow-sm"
              : "text-gray-600 hover:text-gray-800"
          }`}
        >
          Batches
        </button>
      </div>

      {/* Courses Tab Content */}
      {activeTab === "courses" && (
        <div className="bg-white p-6 rounded shadow space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-black">Courses List</h2>
            <button
              onClick={() => {
                resetCourseForm();
                setFormVisible(true);
                scrollToForm(); // Call the new function here
              }}
              className="bg-black text-white px-4 py-2 rounded hover:opacity-90"
            >
              Add New Course
            </button>
          </div>

          <input
            type="text"
            placeholder="Search by name or description"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border p-2 rounded w-full md:w-1/2"
          />

          {filteredCourses.length === 0 ? (
            <p className="text-gray-500">No courses found.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 border">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                      Description
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                      Duration
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                      Age Group
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {currentCourses.map((course) => (
                    <tr key={course.courseId}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {course.courseName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        <span 
                          title={course.courseDescription}
                          className="cursor-help"
                        >
                          {course.courseDescription.length > 50 
                            ? `${course.courseDescription.substring(0, 50)}...` 
                            : course.courseDescription
                          }
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {course.courseDuration} days
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {course.ageGrpType}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm flex gap-4">
                        <button
                          onClick={() => handleEdit(course)}
                          className="text-blue-600 underline hover:opacity-80"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(course.courseId)}
                          className="text-red-600 underline hover:opacity-80"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Courses Pagination */}
              {totalCoursePages > 1 && (
                <div className="flex justify-center items-center space-x-2 mt-4">
                  <button
                    onClick={() =>
                      handleCoursePageChange(currentCoursePage - 1)
                    }
                    disabled={currentCoursePage === 1}
                    className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>

                  {Array.from(
                    { length: totalCoursePages },
                    (_, index) => index + 1
                  ).map((page) => (
                    <button
                      key={page}
                      onClick={() => handleCoursePageChange(page)}
                      className={`px-3 py-2 text-sm font-medium rounded-md ${
                        currentCoursePage === page
                          ? "bg-black text-white"
                          : "text-gray-500 bg-white border border-gray-300 hover:bg-gray-50"
                      }`}
                    >
                      {page}
                    </button>
                  ))}

                  <button
                    onClick={() =>
                      handleCoursePageChange(currentCoursePage + 1)
                    }
                    disabled={currentCoursePage === totalCoursePages}
                    className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              )}

              <div className="text-sm text-gray-500 text-center mt-2">
                Showing {indexOfFirstCourse + 1} to{" "}
                {Math.min(indexOfLastCourse, filteredCourses.length)} of{" "}
                {filteredCourses.length} courses
              </div>
            </div>
          )}
        </div>
      )}

      {/* Batches Tab Content */}
      {activeTab === "batches" && (
        <div className="bg-white p-6 rounded shadow space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-black">Batches List</h2>
            <button
              onClick={() => {
                resetBatchForm();
                setFormVisible(true);
                scrollToForm(); // Add automatic scrolling for batches
              }}
              className="bg-black text-white px-4 py-2 rounded hover:opacity-90"
            >
              Add New Batch
            </button>
          </div>

          <input
            type="text"
            placeholder="Search by batch name"
            value={batchSearchTerm}
            onChange={(e) => setBatchSearchTerm(e.target.value)}
            className="border p-2 rounded w-full md:w-1/2"
          />

          {filteredBatches.length === 0 ? (
            <p className="text-gray-500">No batches found.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 border">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                      Batch ID
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                      Time
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                      Course
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                      Fees
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                      Presentation
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {currentBatches.map((batch) => (
                    <tr key={batch.batchId}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {batch.batchId}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {batch.batchName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {batch.batchStartTime} - {batch.batchEndTime}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {batch.courseId}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        ₹{batch.courseFees}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {batch.presentationDate}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            batch.batchIsActive
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {batch.batchIsActive ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm flex gap-4">
                        <button
                          onClick={() => handleBatchEdit(batch)}
                          className="text-blue-600 underline hover:opacity-80"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleBatchDelete(batch.batchId)}
                          className="text-red-600 underline hover:opacity-80"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Batches Pagination */}
              {totalBatchPages > 1 && (
                <div className="flex justify-center items-center space-x-2 mt-4">
                  <button
                    onClick={() => handleBatchPageChange(currentBatchPage - 1)}
                    disabled={currentBatchPage === 1}
                    className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>

                  {Array.from(
                    { length: totalBatchPages },
                    (_, index) => index + 1
                  ).map((page) => (
                    <button
                      key={page}
                      onClick={() => handleBatchPageChange(page)}
                      className={`px-3 py-2 text-sm font-medium rounded-md ${
                        currentBatchPage === page
                          ? "bg-black text-white"
                          : "text-gray-500 bg-white border border-gray-300 hover:bg-gray-50"
                      }`}
                    >
                      {page}
                    </button>
                  ))}

                  <button
                    onClick={() => handleBatchPageChange(currentBatchPage + 1)}
                    disabled={currentBatchPage === totalBatchPages}
                    className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              )}

              <div className="text-sm text-gray-500 text-center mt-2">
                Showing {indexOfFirstBatch + 1} to{" "}
                {Math.min(indexOfLastBatch, filteredBatches.length)} of{" "}
                {filteredBatches.length} batches
              </div>
            </div>
          )}
        </div>
      )}

      {/* Course Form - Only show when courses tab is active */}
      {formVisible && activeTab === "courses" && (
        <div className="bg-white p-6 rounded shadow space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-black">
              {formData.courseId ? "Edit Course" : "Add New Course"}
            </h2>
            <button
              onClick={closeForm}
              className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
            >
              ×
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <label className="block">
                <span className="text-gray-700">Course Name *</span>
                <input
                  type="text"
                  name="courseName"
                  value={formData.courseName}
                  onChange={handleChange}
                  className="border p-2 rounded w-full"
                  required
                />
              </label>

              <label className="block">
                <span className="text-gray-700">Description *</span>
                <input
                  type="text"
                  name="courseDescription"
                  value={formData.courseDescription}
                  onChange={handleChange}
                  className="border p-2 rounded w-full"
                  required
                />
              </label>

              <label className="block">
                <span className="text-gray-700">Duration (days) *</span>
                <input
                  type="number"
                  name="courseDuration"
                  value={formData.courseDuration}
                  onChange={handleChange}
                  className="border p-2 rounded w-full"
                  min="1"
                  required
                />
              </label>

              <label className="block">
                <span className="text-gray-700">Age Group Type *</span>
                <input
                  type="text"
                  name="ageGrpType"
                  value={formData.ageGrpType}
                  onChange={handleChange}
                  className="border p-2 rounded w-full"
                  placeholder="e.g., 20-30, Adults, Teens, etc."
                  required
                />
              </label>

              <label className="block">
                <span className="text-gray-700">Cover Photo</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="border p-2 rounded w-full"
                />
                {formData.coverPhoto && (
                  <img
                    src={formData.coverPhoto}
                    alt="Current cover"
                    className="mt-2 w-24 h-24 object-cover border rounded"
                  />
                )}
              </label>
            </div>

            <label className="block">
              <span className="text-gray-700">Syllabus *</span>
              <textarea
                name="courseSyllabus"
                value={formData.courseSyllabus}
                onChange={handleChange}
                className="border rounded p-2 w-full"
                rows={3}
                placeholder="Enter course syllabus..."
                required
              ></textarea>
            </label>

            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                name="courseIsActive"
                checked={formData.courseIsActive}
                onChange={handleChange}
                style={{ accentColor: "rgb(0,0,0)" }}
              />
              <span>Is Active?</span>
            </label>

            <div className="flex gap-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-black text-white px-6 py-2 rounded hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Saving..." : (formData.courseId ? "Update Course" : "Add Course")}
              </button>
              <button
                type="button"
                onClick={closeForm}
                disabled={isSubmitting}
                className="bg-gray-500 text-white px-6 py-2 rounded hover:opacity-90"
              >
                Cancel
              </button>
            </div>
            
            {/* Error Display */}
            {submitError && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                <strong>Error:</strong> {submitError}
              </div>
            )}
          </form>
        </div>
      )}

      {/* Batch Form - Only show when batches tab is active */}
      {formVisible && activeTab === "batches" && (
        <div className="bg-white p-6 rounded shadow space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-black mb-2">
              {batchFormData.batchId ? "Edit Batch" : "Create New Batch"}
            </h2>
            <button
              onClick={closeForm}
              className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
            >
              ×
            </button>
          </div>
          
          <form onSubmit={handleBatchSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block mb-1 font-medium text-gray-700">
                  Batch Name *
                </label>
                <input
                  type="text"
                  name="batchName"
                  value={batchFormData.batchName}
                  onChange={handleBatchChange}
                  className="border p-2 rounded w-full"
                  required
                />
              </div>
              <div>
                <label className="block mb-1 font-medium text-gray-700">
                  Start Time *
                </label>
                <input
                  type="time"
                  name="batchStartTime"
                  value={batchFormData.batchStartTime}
                  onChange={handleBatchChange}
                  className="border p-2 rounded w-full"
                  required
                />
              </div>
              <div>
                <label className="block mb-1 font-medium text-gray-700">
                  End Time *
                </label>
                <input
                  type="time"
                  name="batchEndTime"
                  value={batchFormData.batchEndTime}
                  onChange={handleBatchChange}
                  className="border p-2 rounded w-full"
                  required
                />
              </div>
              <div>
                <label className="block mb-1 font-medium text-gray-700">
                  Course *
                </label>
                <select
                  name="courseId"
                  value={batchFormData.courseId}
                  onChange={handleBatchChange}
                  className="border p-2 rounded w-full"
                  required
                >
                  <option value="">-- Select Course --</option>
                  {courses.map((c) => (
                    <option key={c.courseId} value={c.courseId}>
                      {c.courseId} - {c.courseName}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block mb-1 font-medium text-gray-700">
                  Presentation Date *
                </label>
                <input
                  type="datetime-local"
                  name="presentationDate"
                  value={batchFormData.presentationDate}
                  onChange={handleBatchChange}
                  className="border p-2 rounded w-full"
                  required
                />
              </div>
              <div>
                <label className="block mb-1 font-medium text-gray-700">
                  Total Fees *
                </label>
                <input
                  type="number"
                  name="courseFees"
                  value={batchFormData.courseFees}
                  onChange={handleBatchChange}
                  className="border p-2 rounded w-full"
                  min="0"
                  required
                />
              </div>
              <div>
                <label className="block mb-1 font-medium text-gray-700">
                  Fees From *
                </label>
                <input
                  type="date"
                  name="courseFeesFrom"
                  value={batchFormData.courseFeesFrom}
                  onChange={handleBatchChange}
                  className="border p-2 rounded w-full"
                  required
                />
              </div>
              <div>
                <label className="block mb-1 font-medium text-gray-700">
                  Fees To *
                </label>
                <input
                  type="date"
                  name="courseFeesTo"
                  value={batchFormData.courseFeesTo}
                  onChange={handleBatchChange}
                  className="border p-2 rounded w-full"
                  required
                />
              </div>
              <div>
                <label className="block mb-1 font-medium text-gray-700">
                  Batch Logo
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleBatchLogoChange}
                  className="border p-2 rounded w-full"
                />
                {batchFormData.batchLogo && (
                  <img
                    src={batchFormData.batchLogo}
                    alt="Batch Logo"
                    className="mt-2 w-24 h-24 object-contain border rounded"
                  />
                )}
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                name="batchIsActive"
                checked={batchFormData.batchIsActive}
                onChange={handleBatchChange}
                className="accent-black"
              />
              <label className="text-gray-700 font-medium">Is Active</label>
            </div>
            <div className="flex gap-4">
              <button
                type="submit"
                className="bg-black text-white px-6 py-2 rounded hover:bg-gray-800"
              >
                {batchFormData.batchId ? "Update" : "Submit"}
              </button>
              <button
                type="button"
                onClick={closeForm}
                className="bg-gray-500 text-white px-6 py-2 rounded hover:opacity-90"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
