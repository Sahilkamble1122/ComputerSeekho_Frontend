"use client";
import { useState, useEffect } from "react";

export default function BatchPage() {
  const [form, setForm] = useState({
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

  const [batches, setBatches] = useState([]);
  const [courses, setCourses] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [batchLogoFile, setBatchLogoFile] = useState(null);
  const batchesPerPage = 5;
  const [showForm, setShowForm] = useState(false);
  const API = "http://localhost:8080/api";

  useEffect(() => {
    fetchCourses();
    fetchBatches();
  }, []);

  const fetchCourses = async () => {
    try {
      const token = sessionStorage.getItem("token");
      const res = await fetch(`${API}/courses`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setCourses(data);
    } catch (err) {
      console.error("Error loading courses", err);
    }
  };

  const fetchBatches = async () => {
    try {
      const token = sessionStorage.getItem("token");
      const res = await fetch(`${API}/batches`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setBatches(data);
    } catch (err) {
      console.error("Error loading batches", err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this batch?")) {
      try {
        const token = sessionStorage.getItem("token");
        const res = await fetch(`${API}/batches/${id}`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          alert("✅ Batch deleted successfully");
          fetchBatches();
        } else {
          alert("❌ Failed to delete batch");
        }
      } catch (err) {
        console.error("Delete error", err);
      }
    }
  };

  const handleEdit = (batch) => {
    setForm({ ...batch });
    setShowForm(true);
    window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let logoPath = form.batchLogo || "";

    // Agar naya logo select hua hai to upload karo
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

    // Batch data ke sath logo path bhejo backend API ko
    const method = form.batchId ? "PUT" : "POST";
    const url = form.batchId
      ? `${API}/batches/${form.batchId}`
      : `${API}/batches`;

    const batchData = {
      ...form,
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
        alert(`✅ Batch ${form.batchId ? "updated" : "created"} successfully!`);
        setForm({
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
        setShowForm(false);
        fetchBatches();
      } else {
        alert("❌ Failed to save batch.");
      }
    } catch (err) {
      console.error("Error saving batch", err);
    }
  };

  const filteredBatches = batches.filter((batch) =>
    (batch.batchName || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastBatch = currentPage * batchesPerPage;
  const indexOfFirstBatch = indexOfLastBatch - batchesPerPage;
  const currentBatches = filteredBatches.slice(
    indexOfFirstBatch,
    indexOfLastBatch
  );
  const totalPages = Math.ceil(filteredBatches.length / batchesPerPage);

  return (
    <div className="max-w-6xl mx-auto px-6 py-10 space-y-10">
      <h1 className="text-3xl font-bold text-center text-red-600">
        Batch Management
      </h1>

      <div className="bg-white p-6 rounded shadow space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold text-red-600">
            Existing Batches
          </h2>
          <div className="flex items-center space-x-3">
            <input
              type="text"
              placeholder="Search by batch name"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border rounded p-2"
            />
            <button
              onClick={() => {
                setForm({
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
                });
                setShowForm(true);
              }}
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
            >
              + Add New Batch
            </button>
          </div>
        </div>

        {currentBatches.length === 0 ? (
          <p className="text-gray-500">No batches found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full border">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border px-4 py-2 text-left">Batch ID</th>
                  <th className="border px-4 py-2 text-left">Name</th>
                  <th className="border px-4 py-2 text-left">Time</th>
                  <th className="border px-4 py-2 text-left">Course</th>
                  <th className="border px-4 py-2 text-left">Fees</th>
                  <th className="border px-4 py-2 text-left">Presentation</th>
                  <th className="border px-4 py-2 text-left">Status</th>
                  <th className="border px-4 py-2 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentBatches.map((batch) => (
                  <tr key={batch.batchId}>
                    <td className="border px-4 py-2">{batch.batchId}</td>
                    <td className="border px-4 py-2">{batch.batchName}</td>
                    <td className="border px-4 py-2">
                      {batch.batchStartTime} - {batch.batchEndTime}
                    </td>
                    <td className="border px-4 py-2">{batch.courseId}</td>
                    <td className="border px-4 py-2">₹{batch.courseFees}</td>
                    <td className="border px-4 py-2">
                      {batch.presentationDate}
                    </td>
                    <td className="border px-4 py-2">
                      {batch.batchIsActive ? "Active" : "Inactive"}
                    </td>
                    <td className="border px-4 py-2 space-x-2">
                      <button
                        onClick={() => handleEdit(batch)}
                        className="text-blue-600 hover:underline"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(batch.batchId)}
                        className="text-red-600 hover:underline"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="flex justify-center items-center space-x-2 mt-4">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <button
                    key={`page-${page}`} // ✅ unique key
                    onClick={() => setCurrentPage(page)}
                    className={`px-3 py-1 rounded ${
                      page === currentPage
                        ? "bg-red-600 text-white"
                        : "bg-gray-200"
                    }`}
                  >
                    {page}
                  </button>
                )
              )}
            </div>
          </div>
        )}
      </div>

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="bg-white p-6 rounded shadow space-y-6"
        >
          <h2 className="text-xl font-semibold text-red-600 mb-2">
            {form.batchId ? "Edit Batch" : "Create New Batch"}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block mb-1 font-medium text-gray-700">
                Batch Name
              </label>
              <input
                type="text"
                name="batchName"
                value={form.batchName}
                onChange={handleChange}
                className="border p-2 rounded w-full"
                required
              />
            </div>
            <div>
              <label className="block mb-1 font-medium text-gray-700">
                Start Time
              </label>
              <input
                type="time"
                name="batchStartTime"
                value={form.batchStartTime}
                onChange={handleChange}
                className="border p-2 rounded w-full"
                required
              />
            </div>
            <div>
              <label className="block mb-1 font-medium text-gray-700">
                End Time
              </label>
              <input
                type="time"
                name="batchEndTime"
                value={form.batchEndTime}
                onChange={handleChange}
                className="border p-2 rounded w-full"
                required
              />
            </div>
            <div>
              <label className="block mb-1 font-medium text-gray-700">
                Course
              </label>
              <select
                name="courseId"
                value={form.courseId}
                onChange={handleChange}
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
                Presentation Date
              </label>
              <input
                type="datetime-local"
                name="presentationDate"
                value={form.presentationDate}
                onChange={handleChange}
                className="border p-2 rounded w-full"
                required
              />
            </div>
            <div>
              <label className="block mb-1 font-medium text-gray-700">
                Total Fees
              </label>
              <input
                type="number"
                name="courseFees"
                value={form.courseFees}
                onChange={handleChange}
                className="border p-2 rounded w-full"
                required
              />
            </div>
            <div>
              <label className="block mb-1 font-medium text-gray-700">
                Fees From
              </label>
              <input
                type="date"
                name="courseFeesFrom"
                value={form.courseFeesFrom}
                onChange={handleChange}
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
                onChange={(e) => setBatchLogoFile(e.target.files[0])}
              />
              {form.batchLogo && (
                <img
                  src={form.batchLogo}
                  alt="Batch Logo"
                  className="mt-2 w-24 h-24 object-contain border"
                />
              )}
            </div>
            <div>
              <label className="block mb-1 font-medium text-gray-700">
                Fees To
              </label>
              <input
                type="date"
                name="courseFeesTo"
                value={form.courseFeesTo}
                onChange={handleChange}
                className="border p-2 rounded w-full"
                required
              />
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              name="batchIsActive"
              checked={form.batchIsActive}
              onChange={handleChange}
              className="accent-red-600"
            />
            <label className="text-gray-700 font-medium">Is Active</label>
          </div>
          <button
            type="submit"
            className="bg-red-600 text-white px-6 py-2 rounded hover:bg-red-700"
          >
            {form.batchId ? "Update" : "Submit"}
          </button>
        </form>
      )}
    </div>
  );
}
