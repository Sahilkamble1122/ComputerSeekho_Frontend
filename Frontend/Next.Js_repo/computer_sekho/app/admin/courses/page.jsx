"use client";
import { useState, useEffect } from "react";

export default function CoursePage() {
  const [courses, setCourses] = useState([]);
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
    videoId: "",
  });
  const [coverPhotoFile, setCoverPhotoFile] = useState(null);
  const [videoFile, setVideoFile] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const API_BASE = "http://localhost:8080/api/courses";

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(API_BASE, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      setCourses(data);
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setCoverPhotoFile(file);
  };

  const handleVideoChange = (e) => {
    const file = e.target.files[0];
    setVideoFile(file);
  };

  const uploadFile = async (file) => {
    if (!file) return "";
    const formData = new FormData();
    formData.append("file", file);

    try {
      const token = localStorage.getItem('token');
      const res = await fetch("http://localhost:8080/api/upload", {
        method: "POST",
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        return data.path || "";
      }
    } catch (err) {
      console.error("File upload error", err);
    }
    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const uploadedCoverPath = await uploadFile(coverPhotoFile);
    const uploadedVideoPath = await uploadFile(videoFile);

    const payload = {
      ...formData,
      courseDuration: parseInt(formData.courseDuration),
      videoId: uploadedVideoPath || formData.videoId,
      coverPhoto: uploadedCoverPath || formData.coverPhoto,
    };

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(
        formData.courseId ? `${API_BASE}/${formData.courseId}` : API_BASE,
        {
          method: formData.courseId ? "PUT" : "POST",
          headers: {
              "Content-Type": "application/json",
              'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(payload),
        }
      );

      if (response.ok) {
        alert(formData.courseId ? "Course Updated" : "Course Added");
        setFormData({
          courseId: "",
          courseName: "",
          courseDescription: "",
          courseDuration: "",
          courseSyllabus: "",
          ageGrpType: "",
          courseIsActive: true,
          coverPhoto: "",
          videoId: "",
        });
        setCoverPhotoFile(null);
        setVideoFile(null);
        setFormVisible(false);
        fetchCourses();
      } else {
        alert("Save failed");
      }
    } catch (err) {
      console.error("Error saving course:", err);
    }
  };

  const handleEdit = (course) => {
    setFormVisible(true);
    setFormData({
      ...course,
      courseDuration: course.courseDuration.toString(),
      videoId: course.videoId?.toString() || "",
    });
  };

  const handleDelete = async (courseId) => {
    if (!window.confirm("Are you sure you want to delete this course?")) return;
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_BASE}/${courseId}`, {
        method: "DELETE",
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        fetchCourses();
        alert("Course deleted");
      } else {
        alert("Delete failed");
      }
    } catch (err) {
      console.error("Error deleting course:", err);
    }
  };

  const filteredCourses = courses.filter(
    (course) =>
      course.courseName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.courseDescription.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-8">
      <h1 className="text-3xl font-bold text-center text-red-600 mb-4">
        Course Management
      </h1>

      <div className="bg-white p-6 rounded shadow space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold text-red-600">Courses List</h2>
          <button
            onClick={() => setFormVisible(true)}
            className="bg-black text-white px-4 py-2 rounded hover:opacity-90"
          >
            Add New
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
                {filteredCourses.map((course) => (
                  <tr key={course.courseId}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {course.courseName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {course.courseDescription}
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
          </div>
        )}
      </div>

      {formVisible && (
        <form
          onSubmit={handleSubmit}
          className="bg-white p-6 rounded shadow space-y-4"
        >
          <h2 className="text-xl font-semibold text-red-600">
            {formData.courseId ? "Edit Course" : "Add New Course"}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className="block">
              <span className="text-gray-700">Course Name</span>
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
              <span className="text-gray-700">Description</span>
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
              <span className="text-gray-700">Duration (days)</span>
              <input
                type="number"
                name="courseDuration"
                value={formData.courseDuration}
                onChange={handleChange}
                className="border p-2 rounded w-full"
                required
              />
            </label>

            <label className="block">
              <span className="text-gray-700">Age Group Type</span>
              <input
                type="text"
                name="ageGrpType"
                value={formData.ageGrpType}
                onChange={handleChange}
                className="border p-2 rounded w-full"
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
            </label>
          </div> 

          <label className="block">
            <span className="text-gray-700">Syllabus</span>
            <textarea
              name="courseSyllabus"
              value={formData.courseSyllabus}
              onChange={handleChange}
              className="border rounded p-2 w-full"
              rows={3}
            ></textarea>
          </label>

          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              name="courseIsActive"
              checked={formData.courseIsActive}
              onChange={handleChange}
              style={{ accentColor: "rgb(236,28,35)" }}
            />
            <span>Is Active?</span>
          </label>

          <button
            type="submit"
            className="text-white px-6 py-2 rounded hover:opacity-90"
            style={{ backgroundColor: "rgb(236,28,35)" }}
          >
            {formData.courseId ? "Update Course" : "Add Course"}
          </button>
        </form>
      )}
    </div>
  );
}
