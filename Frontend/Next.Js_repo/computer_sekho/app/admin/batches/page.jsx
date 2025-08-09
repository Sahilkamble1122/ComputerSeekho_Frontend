"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export default function ManageBatch() {
  const [batches, setBatches] = useState([]);
  const [courses, setCourses] = useState([]);
  const [form, setForm] = useState({
    batch_id: null,
    batch_name: "",
    batch_start_time: "",
    batch_end_time: "",
    course_id: "",
    presentation_date: "",
    course_fees: "",
    course_fees_from: "",
    course_fees_to: "",
    batch_is_active: true,
  });
  const [showForm, setShowForm] = useState(false);
  const formRef = useRef(null); // ⬅️ Create form reference

  // Fetch batches and courses
  useEffect(() => {
    fetch("http://localhost:8080/api/batches")
      .then((res) => res.json())
      .then((data) => setBatches(data));

    fetch("http://localhost:8080/api/courses")
      .then((res) => res.json())
      .then((data) => setCourses(data));
  }, []);

const handleInputChange = (e) => {
  const { name, value, type, checked } = e.target;
  setForm((prev) => ({
    ...prev,
    [name]: type === "checkbox" ? checked : value,
  }));
};

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = form.batch_id
      ? `http://localhost:8080/api/batches/${form.batch_id}`
      : "http://localhost:8080/api/batches";

    const method = form.batch_id ? "PUT" : "POST";

    try {
const token = sessionStorage.getItem('token');
const res = await fetch(url, {
  method,
  headers: {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  },
  body: JSON.stringify(form),
});

      if (!res.ok) throw new Error("Failed to save batch");

      toast.success(
        form.batch_id ? "Batch updated successfully!" : "Batch created!"
      );

      const updatedBatch = await res.json();
      setBatches((prev) =>
        form.batch_id
          ? prev.map((b) => (b.batch_id === updatedBatch.batch_id ? updatedBatch : b))
          : [...prev, updatedBatch]
      );

      setShowForm(false);
      setForm({
        batch_id: null,
        batch_name: "",
        batch_start_time: "",
        batch_end_time: "",
        course_id: "",
        presentation_date: "",
        course_fees: "",
        course_fees_from: "",
        course_fees_to: "",
        batch_is_active: true,
      });
    } catch (error) {
      console.error("Error saving batch:", error);
      toast.error("Something went wrong");
    }
  };

  const handleEdit = (batch) => {
    setForm(batch);
    setShowForm(true);
    setTimeout(() => {
      formRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  const handleDelete = async (batchId) => {
    try {
      const res = await fetch(`http://localhost:8080/api/batches/${batchId}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Failed to delete");

      toast.success("Batch deleted");
      setBatches((prev) => prev.filter((b) => b.batch_id !== batchId));
    } catch (error) {
      toast.error("Could not delete batch");
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6 text-center">
        <h2 className="text-3xl font-bold mb-4">Manage Batches</h2>
        <Button
          onClick={() => {
            setForm({
              batch_id: null,
              batch_name: "",
              batch_start_time: "",
              batch_end_time: "",
              course_id: "",
              presentation_date: "",
              course_fees: "",
              course_fees_from: "",
              course_fees_to: "",
              batch_is_active: true,
            });
            setShowForm(true);
            setTimeout(() => {
              formRef.current?.scrollIntoView({ behavior: "smooth" });
            }, 100);
          }}
        >
          + Add New Batch
        </Button>
      </div>

      <div className="space-y-4 mb-12">
        {batches.map((batch) => (
          <div
            key={batch.batch_id}
            className="p-4 border rounded shadow flex justify-between items-center"
          >
            <div>
              <p className="font-bold text-lg">{batch.batch_name}</p>
              <p className="text-gray-600 text-sm">
                {batch.batch_start_time} - {batch.batch_end_time}
              </p>
              <p className="text-gray-500 text-sm">
                Course ID: {batch.course_id}
              </p>
            </div>
            <div className="space-x-2">
              <Button
                variant="outline"
                onClick={() => handleEdit(batch)}
              >
                Edit
              </Button>
              <Button
                variant="destructive"
                onClick={() => handleDelete(batch.batch_id)}
              >
                Delete
              </Button>
            </div>
          </div>
        ))}
      </div>

      {showForm && (
        <div ref={formRef}>
          <form
            onSubmit={handleSubmit}
            className="bg-white p-6 rounded shadow space-y-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Batch Name</Label>
                <Input
                  name="batch_name"
                  value={form.batch_name}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <Label>Start Time</Label>
                <Input
                  name="batch_start_time"
                  value={form.batch_start_time}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <Label>End Time</Label>
                <Input
                  name="batch_end_time"
                  value={form.batch_end_time}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <Label>Course</Label>
                <select
                  name="course_id"
                  value={form.course_id}
                  onChange={handleInputChange}
                  className="w-full border rounded p-2"
                  required
                >
                  <option value="">-- Select Course --</option>
                  {courses.map((course) => (
                    <option key={course.course_id} value={course.course_id}>
                      {course.course_name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <Label>Presentation Date</Label>
                <Input
                  type="date"
                  name="presentation_date"
                  value={form.presentation_date}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <Label>Course Fees</Label>
                <Input
                  name="course_fees"
                  value={form.course_fees}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <Label>Course Fees From</Label>
                <Input
                  name="course_fees_from"
                  value={form.course_fees_from}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <Label>Course Fees To</Label>
                <Input
                  name="course_fees_to"
                  value={form.course_fees_to}
                  onChange={handleInputChange}
                />
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="batch_is_active"
                  checked={form.batch_is_active}
                  onChange={handleInputChange}
                />
                <Label>Active</Label>
              </div>
            </div>

            <Button type="submit">
              {form.batch_id ? "Update Batch" : "Create Batch"}
            </Button>
          </form>
        </div>
      )}
    </div>
  );
}
