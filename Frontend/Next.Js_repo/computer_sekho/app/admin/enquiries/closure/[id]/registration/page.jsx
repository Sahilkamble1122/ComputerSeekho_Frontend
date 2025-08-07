"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";

export default function EnquiryForm() {
  const params = useParams();
  const enquiryId = params?.id;

  const initialFormState = {
    name: "",
    dob: "",
    gender: "",
    resAddress: "",
    officeAddress: "",
    phoneR: "",
    phoneO: "",
    mobile: "",
    email: "",
    qualification: "",
    course: "",
    startDate: "",
    time: "",
    paymentMode: "",
    amount: "",
    chequeNo: "",
    bankName: "",
    paymentDate: "",
    photo: null,
    batchId: "",
    courseFee: "",
    pendingFees: "",
  };

  const [form, setForm] = useState(initialFormState);
  const [errors, setErrors] = useState({});
  const [preview, setPreview] = useState(null);
  const [courses, setCourses] = useState([]);
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(false);
  const [courseError, setCourseError] = useState("");
  const [batchError, setBatchError] = useState("");
  const [selectedBatch, setSelectedBatch] = useState(null);

  const getToken = () => localStorage.getItem("token");

  useEffect(() => {
    fetchCourses();
    fetchBatches();
    if (enquiryId) {
      fetchEnquiryData(enquiryId);
    }
  }, [enquiryId]);

  const fetchEnquiryData = async (id) => {
    try {
      const token = getToken();
      const res = await fetch(`http://localhost:8080/api/enquiries/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to fetch enquiry data");
      const data = await res.json();
      setForm((prev) => ({
        ...prev,
        name: data.name || "",
        dob: data.dob || "",
        gender: data.gender || "",
        resAddress: data.enquirerAddress || "",
        officeAddress: data.officeAddress || "",
        phoneR: data.phoneR || "",
        phoneO: data.phoneO || "",
        mobile: data.mobile || "",
        email: data.email || "",
        qualification: data.qualification || "",
        course: data.courseId || "",
      }));
    } catch (err) {
      console.error("Error loading enquiry data:", err);
    }
  };

  const fetchCourses = async () => {
    setLoading(true);
    setCourseError("");
    try {
      const token = getToken();
      if (!token) throw new Error("Missing authentication token");

      const res = await fetch("http://localhost:8080/api/courses", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

      const data = await res.json();
      if (Array.isArray(data)) {
        setCourses(data);
      } else {
        setCourseError("Invalid data format received");
      }
    } catch (error) {
      setCourseError(`Failed to fetch courses: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const fetchBatches = async () => {
    setLoading(true);
    setBatchError("");
    try {
      const token = getToken();
      if (!token) throw new Error("Missing authentication token");

      const res = await fetch("http://localhost:8080/api/batches/active", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

      const data = await res.json();
      if (Array.isArray(data)) {
        setBatches(data);
      } else {
        setBatchError("Invalid data format received");
      }
    } catch (error) {
      setBatchError(`Failed to fetch batches: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (name === "batchId") {
      const selected = batches.find((b) => b.batchId.toString() === value);
      if (selected) {
        setForm((prev) => ({
          ...prev,
          courseFee: selected.courseFee,
          pendingFees: selected.courseFee,
        }));
      }
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!form.name.trim()) newErrors.name = "Name is required";
    if (!form.dob) newErrors.dob = "Date of Birth is required";
    if (!form.gender) newErrors.gender = "Gender is required";
    if (!form.resAddress.trim())
      newErrors.resAddress = "Residential address is required";
    if (!form.mobile.trim() || !/^\d{10}$/.test(form.mobile))
      newErrors.mobile = "Valid 10-digit mobile number is required";
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email))
      newErrors.email = "Valid email is required";
    if (!form.qualification.trim())
      newErrors.qualification = "Qualification is required";
    if (!form.course.trim()) newErrors.course = "Course is required";
    if (!form.batchId) newErrors.batchId = "Batch is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    form.courseFee = selectedBatch?.courseFee || 0;
    form.pendingFees = form.courseFee;
    if (!validateForm()) {
      alert("❌ Please correct the errors before submitting.");
      return;
    }

    try {
      const token = getToken();
      if (!token) {
        alert("❌ You are not logged in.");
        return;
      }

      const formData = new FormData();
      formData.append("studentName", form.name);
      formData.append("studentAddress", form.resAddress);
      formData.append("studentGender", form.gender);
      formData.append("studentDob", form.dob);
      formData.append("studentQualification", form.qualification);
      formData.append("studentMobile", form.mobile);
      formData.append("studentEmail", form.email);
      formData.append("courseId", form.course);
      formData.append("studentPassword", "pass123");
      formData.append("studentUsername", form.email);
      formData.append("batchId", form.batchId);
      if (form.photo) {
        formData.append("photo", form.photo);
      }

      const response = await fetch("http://localhost:8080/api/students/form", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Failed to register student");
      }
      // if (response.ok) {
      //   router.push("/admin/students"); // or your desired page
      // }

      alert("✅ Student registered successfully!");
      setForm(initialFormState);
      setPreview(null);
    } catch (error) {
      alert("❌ Registration failed: " + error.message);
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-white shadow-md rounded-xl">
      <div className="flex items-center justify-between mb-4">
        <img src="/logo.png" alt="VITA Logo" className="w-35 h-auto" />
        <h2 className="text-4xl font-bold text-[#2c2b5e] text-center flex-1">
          Enrollment Form
        </h2>
        <div className="w-20" />
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
          <div className="space-y-4">
            <div>
              <label className="block font-semibold">Name:</label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                className="input"
              />
              {errors.name && (
                <p className="text-red-600 text-sm">{errors.name}</p>
              )}
            </div>

            <div className="flex items-center gap-6 text-sm mt-4">
              <label className="font-semibold whitespace-nowrap">
                Date of Birth:
              </label>
              <input
                type="date"
                name="dob"
                value={form.dob}
                onChange={handleChange}
                className="border border-gray-300 rounded px-2 py-1 w-[170px]"
                required
              />

              <label className="font-semibold ml-6 whitespace-nowrap">
                Gender:
              </label>
              <label className="flex items-center gap-1">
                <input
                  type="radio"
                  name="gender"
                  value="Male"
                  checked={form.gender === "Male"}
                  onChange={handleChange}
                />{" "}
                Male
              </label>
              <label className="flex items-center gap-1">
                <input
                  type="radio"
                  name="gender"
                  value="Female"
                  checked={form.gender === "Female"}
                  onChange={handleChange}
                />{" "}
                Female
              </label>
            </div>
          </div>

          <div className="flex flex-col items-center justify-start w-full md:w-44 border rounded-lg p-3 bg-gray-50 shadow-sm ml-auto">
            <label className="text-sm font-semibold text-center mb-2">
              Student Photo
            </label>
            <div className="w-24 h-24 border rounded bg-white flex items-center justify-center overflow-hidden">
              {preview ? (
                <img
                  src={preview}
                  alt="Preview"
                  className="object-cover w-full h-full"
                />
              ) : (
                <span className="text-gray-400 text-xs text-center">
                  No Image
                </span>
              )}
            </div>
            <label className="mt-2 cursor-pointer text-blue-600 text-sm hover:underline">
              Upload
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) {
                    setForm((prev) => ({ ...prev, photo: file }));
                    const reader = new FileReader();
                    reader.onloadend = () => setPreview(reader.result);
                    reader.readAsDataURL(file);
                  }
                }}
                className="hidden"
              />
            </label>
          </div>
        </div>

        <label className="block font-semibold">Residential Address:</label>
        <textarea
          name="resAddress"
          value={form.resAddress}
          onChange={handleChange}
          className="input h-20"
        />
        {errors.resAddress && (
          <p className="text-red-600 text-sm">{errors.resAddress}</p>
        )}

        <label className="block font-semibold">Official Address:</label>
        <textarea
          name="officeAddress"
          value={form.officeAddress}
          onChange={handleChange}
          className="input h-20"
        />

        <div className="flex items-center flex-wrap gap-4 text-sm mt-4">
          <label className="font-semibold">Phone:</label>
          <input
            type="tel"
            name="phoneR"
            value={form.phoneR}
            onChange={handleChange}
            className="border border-gray-300 rounded px-2 py-1 w-[150px]"
            pattern="[0-9]{6,12}"
          />

          <label className="font-semibold">Secondary Phone :</label>
          <input
            type="tel"
            name="phoneO"
            value={form.phoneO}
            onChange={handleChange}
            className="border border-gray-300 rounded px-2 py-1 w-[150px]"
            pattern="[0-9]{6,12}"
          />

          <label className="font-semibold">Mobile:</label>
          <input
            type="tel"
            name="mobile"
            value={form.mobile}
            onChange={handleChange}
            className="border border-gray-300 rounded px-2 py-1 w-[150px]"
            pattern="[0-9]{10}"
          />
        </div>

        <div>
          <label className="block font-semibold mb-1">Email ID:</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            className="input"
          />
          {errors.email && (
            <p className="text-red-600 text-sm">{errors.email}</p>
          )}
        </div>

        <div>
          <label className="block font-semibold mb-1">
            Educational Qualification:
          </label>
          <input
            type="text"
            name="qualification"
            value={form.qualification}
            onChange={handleChange}
            className="input"
          />
          {errors.qualification && (
            <p className="text-red-600 text-sm">{errors.qualification}</p>
          )}
        </div>

        <div>
          <label className="block font-semibold mb-1">
            Course Enrolled For:
          </label>
          <select
            name="course"
            value={form.course}
            onChange={handleChange}
            className="input"
            disabled={loading}
          >
            <option value="">-- Select Course --</option>
            {courses.map((course) => (
              <option key={course.courseId} value={course.courseId}>
                {course.courseId} - {course.courseName}
              </option>
            ))}
          </select>
          {errors.course && (
            <p className="text-red-600 text-sm">{errors.course}</p>
          )}
          {courseError && <p className="text-red-600 text-sm">{courseError}</p>}
        </div>

        <div>
          <label className="block font-semibold mb-1">Batch Name:</label>

          <select
            id="batchId"
            name="batchId"
            value={form.batchId}
            onChange={(e) => {
              const selected = batches.find(
                (batch) => batch.batchId === parseInt(e.target.value)
              );
              setForm((prevForm) => ({
                ...prevForm,
                batchId: e.target.value,
                courseFee: selected?.courseFee || 0,
                pendingFees: selected?.courseFees || 0,
              }));
              setSelectedBatch(selected); // <- define this in useState
            }}
            className="w-full border border-gray-300 p-2 rounded"
            required
          >
            <option value="">Select Batch</option>
            {batches.map((batch) => (
              <option key={batch.batchId} value={batch.batchId}>
                {batch.batchName}
              </option>
            ))}
          </select>
          {form.courseFees && (
            <p className="text-sm text-green-600 mt-1">
              Total Fees: ₹{form.courseFee}
            </p>
          )}

          {errors.batchId && (
            <p className="text-red-600 text-sm">{errors.batchId}</p>
          )}
          {batchError && <p className="text-red-600 text-sm">{batchError}</p>}
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
          disabled={loading}
        >
          {loading ? "Loading..." : "Submit"}
        </button>
      </form>
    </div>
  );
}
