"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";

export default function EnquiryForm() {
  const params = useParams();
  const enquiryId = params?.id;
  const router = useRouter();

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
    courseFees: "",
    pendingFees: "",
    paymentTypeId: "",
    initialPayment: "",
  };

  const [form, setForm] = useState(initialFormState);
  const [errors, setErrors] = useState({});
  const [preview, setPreview] = useState(null);
  const [courses, setCourses] = useState([]);
  const [allBatches, setAllBatches] = useState([]);
  const [filteredBatches, setFilteredBatches] = useState([]);
  const [loading, setLoading] = useState(false);
  const [courseError, setCourseError] = useState("");
  const [batchError, setBatchError] = useState("");
  const [selectedBatch, setSelectedBatch] = useState(null);
  const [paymentTypes, setPaymentTypes] = useState([]);

  const getToken = () => sessionStorage.getItem("token");

  // Helper function to validate image files
  const validateImageFile = (file) => {
    const allowedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/gif",
      "image/webp",
    ];
    const maxSize = 5 * 1024 * 1024; // 5MB

    if (!allowedTypes.includes(file.type)) {
      return {
        valid: false,
        error: "❌ Please select a valid image file (JPEG, PNG, GIF, or WebP)",
      };
    }

    if (file.size > maxSize) {
      return { valid: false, error: "❌ Image size should be less than 5MB" };
    }

    return { valid: true };
  };

  useEffect(() => {
    fetchCourses();
    fetchBatches();
    fetchPaymentTypes();
    if (enquiryId) {
      fetchEnquiryData(enquiryId);
    }
  }, [enquiryId]);

  // Filter batches when course changes
  useEffect(() => {
    if (form.course && allBatches.length > 0) {
      const filtered = allBatches.filter(
        (batch) =>
          batch.courseId && batch.courseId.toString() === form.course.toString()
      );
      setFilteredBatches(filtered);

      // Clear batch selection if current batch doesn't match new course
      if (
        form.batchId &&
        !filtered.find((b) => b.batchId.toString() === form.batchId.toString())
      ) {
        setForm((prev) => ({
          ...prev,
          batchId: "",
          courseFees: "",
          pendingFees: "",
        }));
        setSelectedBatch(null);
      }
    } else {
      setFilteredBatches([]);
      setForm((prev) => ({
        ...prev,
        batchId: "",
        courseFees: "",
        pendingFees: "",
      }));
      setSelectedBatch(null);
    }
  }, [form.course, allBatches]);

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
        name: data.studentName || data.enquirerName || "",
        dob: data.dob || "",
        gender: data.gender || "",
        resAddress: data.enquirerAddress || "",
        officeAddress: data.officeAddress || "",
        phoneR: data.phoneR || "",
        phoneO: data.phoneO || "",
        mobile: (data.enquirerMobile && String(data.enquirerMobile)) || "",
        email: data.enquirerEmailId || "",
        qualification: data.qualification || "",
        course: data.courseId ? String(data.courseId) : "",
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

      const res = await fetch("http://localhost:8080/api/batches", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

      const data = await res.json();
      if (Array.isArray(data)) {
        setAllBatches(data);
        setFilteredBatches([]);
      } else {
        setBatchError("Invalid data format received");
      }
    } catch (error) {
      setBatchError(`Failed to fetch batches: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const fetchPaymentTypes = async () => {
    try {
      const token = getToken();
      if (!token) throw new Error("Missing authentication token");

      const res = await fetch("http://localhost:8080/api/payment-types", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

      const data = await res.json();
      if (Array.isArray(data)) {
        setPaymentTypes(data);
      }
    } catch (error) {
      console.error("Failed to fetch payment types:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));

    if (name === "course") {
      setForm((prev) => ({
        ...prev,
        batchId: "",
        courseFees: "",
        pendingFees: "",
      }));
      setSelectedBatch(null);
    }

    if (name === "batchId") {
      const selected = filteredBatches.find(
        (b) => b.batchId.toString() === value
      );
      if (selected) {
        setForm((prev) => ({
          ...prev,
          courseFees: selected.courseFees,
          pendingFees: selected.courseFees,
        }));
        setSelectedBatch(selected);
      }
    }

    if (name === "initialPayment") {
      const paymentAmount = parseFloat(value) || 0;
      const courseFee = parseFloat(form.courseFees) || 0;
      const newPendingFees = Math.max(0, courseFee - paymentAmount);
      setForm((prev) => ({
        ...prev,
        pendingFees: newPendingFees,
      }));
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
    if (!String(form.course).trim()) newErrors.course = "Course is required";
    if (!String(form.batchId).trim()) newErrors.batchId = "Batch is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      alert("❌ Please correct the errors before submitting.");
      return;
    }

    try {
      setLoading(true);
      const token = getToken();
      if (!token) {
        alert("❌ You are not logged in.");
        return;
      }

      // Calculate fees
      const computedCourseFees =
        selectedBatch?.courseFees || parseFloat(form.courseFees) || 0;
      const computedPendingFees = Math.max(
        0,
        computedCourseFees - (parseFloat(form.initialPayment) || 0)
      );

      let studentResult = null;
      let studentId = null;
      let photoPath = null;

      // First, upload photo if available
      if (form.photo instanceof File) {
        try {
          const photoFormData = new FormData();
          photoFormData.append("photo", form.photo);

          const photoResponse = await fetch("/api/upload-student-photo", {
            method: "POST",
            body: photoFormData,
          });

          if (photoResponse.ok) {
            const photoData = await photoResponse.json();
            photoPath = photoData.path; // This will be like "/students/1234567890_photo.jpg"
            console.log("✅ Photo uploaded successfully:", photoPath);
          } else {
            throw new Error("Photo upload failed");
          }
        } catch (photoError) {
          console.warn("Photo upload failed:", photoError);
          alert("⚠️ Photo upload failed, but continuing with registration...");
        }
      }

      // Now register the student with the photo path
      const payload = {
        studentName: form.name,
        studentAddress: form.resAddress,
        studentGender: form.gender,
        studentDob: form.dob,
        studentQualification: form.qualification,
        studentMobile: form.mobile,
        studentEmail: form.email,
        studentUsername: form.email,
        studentPassword: "pass123",
        courseId: parseInt(form.course),
        batchId: parseInt(form.batchId),
        courseFee: computedCourseFees,
        pendingFees: computedPendingFees,
        photoUrl: photoPath, // Send the photo path to backend
      };

      const response = await fetch("http://localhost:8080/api/students", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`Registration failed: ${JSON.stringify(errorData)}`);
      }

      studentResult = await response.json();
      studentId = studentResult.id || studentResult.studentId;

      if (photoPath) {
        console.log("✅ Student registered with photo:", studentResult);
        alert("✅ Student registered successfully with photo!");
      } else {
        console.log("✅ Student registered without photo:", studentResult);
        alert("✅ Student registered successfully!");
      }

      // Immediately mark enquiry as processed after successful student registration
      try {
        console.log("🔄 Marking enquiry as processed...");
        const processedResponse = await fetch(
          `http://localhost:8080/api/enquiries/${enquiryId}/status?status=true`,
          {
            method: "PATCH",
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (processedResponse.ok) {
          console.log("✅ Enquiry marked as processed successfully");
        } else {
          const errorText = await processedResponse.text();
          console.error("❌ Failed to mark enquiry as processed:", errorText);
        }
      } catch (error) {
        console.error("❌ Error marking enquiry as processed:", error);
        // Don't block user if this fails
      }

      // Process initial payment if provided
      if (
        form.initialPayment &&
        parseFloat(form.initialPayment) > 0 &&
        form.paymentTypeId
      ) {
        try {
          const paymentResponse = await fetch("/api/payments/process", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              studentId: studentId,
              paymentTypeId: parseInt(form.paymentTypeId),
              paymentDate:
                form.paymentDate || new Date().toISOString().split("T")[0],
              courseId: parseInt(form.course),
              batchId: parseInt(form.batchId),
              amount: parseFloat(form.initialPayment),
              status: "Successful",
            }),
          });

          if (paymentResponse.ok) {
            const paymentResult = await paymentResponse.json();
            if (paymentResult.success) {
              alert("✅ Student registered successfully with initial payment!");
            } else {
              alert(
                `✅ Student registered successfully! (Payment processing done!!: ${paymentResult.error})`
              );
            }
          } else {
            alert(
              "✅ Student registered successfully! (Payment processing failed)"
            );
          }
        } catch (paymentError) {
          console.error("Payment processing error:", paymentError);
          alert(
            "✅ Student registered successfully! (Payment processing failed)"
          );
        }
      }

      // Update enquiry closure (optional - only if this endpoint exists)
      try {
        console.log("🔄 Updating enquiry closure...");
        const closureResponse = await fetch(
          `http://localhost:8080/api/enquiries/${enquiryId}/closure`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              closureReasonId: null,
              closureReason: "Success",
            }),
          }
        );

        if (closureResponse.ok) {
          console.log("✅ Enquiry closure updated successfully");
        } else {
          console.log("⚠️ Enquiry closure update failed (this is optional)");
        }
      } catch (error) {
        console.log("⚠️ Enquiry closure update failed (this is optional)");
      }

      // Reset form and redirect
      setForm(initialFormState);
      setPreview(null);

      if (studentId) {
        router.push(`/admin/payments/${studentId}/new-payment`);
      }
    } catch (error) {
      console.error("Registration error:", error);
      alert("❌ Registration failed: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePrintForm = () => {
    const printContent = document.getElementById("print-content").innerHTML;
    const printWindow = window.open("", "_blank", "width=800,height=600");

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Student Enrollment Form</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 0; padding: 20px; }
            .header { text-align: center; margin-bottom: 30px; }
            .header h1 { color: #2c2b5e; margin-bottom: 10px; }
            .section { margin-bottom: 25px; }
            .section h3 { border-bottom: 2px solid #e5e7eb; padding-bottom: 8px; margin-bottom: 15px; }
            .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
            .field { margin-bottom: 10px; }
            .field strong { display: inline-block; width: 180px; }
            .signatures { text-align: center; margin-top: 40px; }
            .signature-box { display: inline-block; border: 2px solid #d1d5db; padding: 15px; border-radius: 8px; margin: 0 20px; }
            .signature-line { width: 120px; height: 60px; border-bottom: 2px solid #9ca3af; margin-top: 10px; }
            @media print {
              body { margin: 0; }
              .no-print { display: none; }
            }
          </style>
        </head>
        <body>
          ${printContent}
          <div class="no-print" style="text-align: center; margin-top: 30px;">
            <button onclick="window.print()" style="padding: 10px 20px; background: #3b82f6; color: white; border: none; border-radius: 5px; cursor: pointer;">Print Form</button>
            <button onclick="window.close()" style="padding: 10px 20px; background: #6b7280; color: white; border: none; border-radius: 5px; cursor: pointer; margin-left: 10px;">Close</button>
          </div>
        </body>
      </html>
    `);

    printWindow.document.close();
  };

  const handleDownloadForm = () => {
    const printContent = document.getElementById("print-content").innerHTML;
    const fullHTML = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Student Enrollment Form - ${form.name || "Student"}</title>
          <meta charset="utf-8">
          <style>
            body { 
              font-family: Arial, sans-serif; 
              margin: 0; 
              padding: 20px; 
              background: white;
            }
            .header { 
              text-align: center; 
              margin-bottom: 30px; 
              border-bottom: 3px solid #2c2b5e;
              padding-bottom: 20px;
            }
            .header h1 { 
              color: #2c2b5e; 
              margin-bottom: 10px; 
              font-size: 28px;
            }
            .section { 
              margin-bottom: 25px; 
              padding: 15px;
              border: 1px solid #e5e7eb;
              border-radius: 8px;
            }
            .section h3 { 
              border-bottom: 2px solid #e5e7eb; 
              padding-bottom: 8px; 
              margin-bottom: 15px;
              color: #374151;
            }
            .grid { 
              display: grid; 
              grid-template-columns: 1fr 1fr; 
              gap: 20px; 
            }
            .field { 
              margin-bottom: 12px; 
              padding: 8px;
              background: #f9fafb;
              border-radius: 4px;
            }
            .field strong { 
              display: inline-block; 
              width: 180px; 
              color: #374151;
            }
            .signatures { 
              text-align: center; 
              margin-top: 40px; 
            }
            .signature-box { 
              display: inline-block; 
              border: 2px solid #d1d5db; 
              padding: 15px; 
              border-radius: 8px; 
              margin: 0 20px; 
              background: #f9fafb;
            }
            .signature-line { 
              width: 120px; 
              height: 60px; 
              border-bottom: 2px solid #9ca3af; 
              margin-top: 10px; 
            }
            .footer {
              margin-top: 40px;
              text-align: center;
              color: #6b7280;
              font-size: 12px;
              border-top: 1px solid #e5e7eb;
              padding-top: 20px;
            }
            @media print {
              body { margin: 0; }
              .section { border: none; }
              .field { background: white; }
            }
          </style>
        </head>
        <body>
          ${printContent}
          <div class="footer">
            <p>Generated on: ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}</p>
            <p>Computer Seekho - Student Enrollment Form</p>
          </div>
        </body>
      </html>
    `;

    // Create a blob and download link
    const blob = new Blob([fullHTML], { type: "text/html" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Student_Enrollment_Form_${form.name || "Student"}_${
      new Date().toISOString().split("T")[0]
    }.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
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

      <form onSubmit={handleSubmit} noValidate className="space-y-4">
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
                    const validationResult = validateImageFile(file);
                    if (!validationResult.valid) {
                      alert(validationResult.error);
                      return;
                    }
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
            onChange={handleChange}
            className="w-full border border-gray-300 p-2 rounded"
            required
            disabled={!form.course || filteredBatches.length === 0}
          >
            <option value="">
              {!form.course
                ? "Please select a course first"
                : filteredBatches.length === 0
                ? "No batches available for this course"
                : "Select Batch"}
            </option>
            {filteredBatches.map((batch) => (
              <option key={batch.batchId} value={batch.batchId}>
                {batch.batchName} - ₹{batch.courseFees}
              </option>
            ))}
          </select>

          {form.course && filteredBatches.length === 0 && (
            <p className="text-sm text-orange-600 mt-1">
              No batches available for the selected course
            </p>
          )}

          {form.courseFees && (
            <p className="text-sm text-green-600 mt-1">
              Total Fees: ₹{form.courseFees}
            </p>
          )}

          {errors.batchId && (
            <p className="text-red-600 text-sm">{errors.batchId}</p>
          )}
          {batchError && <p className="text-red-600 text-sm">{batchError}</p>}
        </div>

        {/* Payment Section */}
        {form.courseFees && (
          <div className="space-y-4 border-t pt-4">
            <h3 className="text-lg font-semibold text-gray-800">
              Initial Payment (Optional)
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold mb-1">
                  Payment Type:
                </label>
                <select
                  name="paymentTypeId"
                  value={form.paymentTypeId}
                  onChange={handleChange}
                  className="input"
                >
                  <option value="">-- Select Payment Type --</option>
                  {paymentTypes.map((type) => (
                    <option key={type.paymentTypeId} value={type.paymentTypeId}>
                      {type.paymentTypeDesc ||
                        `Payment Type ${type.paymentTypeId}`}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold mb-1">
                  Initial Payment Amount:
                </label>
                <input
                  type="number"
                  name="initialPayment"
                  value={form.initialPayment}
                  onChange={handleChange}
                  max={form.courseFees}
                  min="0"
                  step="0.01"
                  className="input"
                  placeholder="Enter amount"
                />
                {form.initialPayment && (
                  <p className="text-sm text-blue-600 mt-1">
                    Remaining Fees: ₹{form.pendingFees}
                  </p>
                )}
              </div>
            </div>

            <div>
              <label className="block font-semibold mb-1">Payment Date:</label>
              <input
                type="date"
                name="paymentDate"
                value={form.paymentDate}
                onChange={handleChange}
                className="input"
              />
            </div>
          </div>
        )}

        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
          disabled={loading}
        >
          {loading ? "Loading..." : "Submit"}
        </button>

        <button
          type="button"
          onClick={handlePrintForm}
          className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 ml-4"
          disabled={loading}
        >
          Print Form
        </button>

        <button
          type="button"
          onClick={handleDownloadForm}
          className="bg-purple-600 text-white px-6 py-2 rounded hover:bg-purple-700 ml-4"
          disabled={loading}
        >
          Download Form
        </button>
      </form>

      {/* Hidden print content */}
      <div id="print-content" className="hidden">
        <div className="p-8 max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-[#2c2b5e] mb-4">
              Student Enrollment Form
            </h1>
            <p className="text-gray-600">
              Generated on: {new Date().toLocaleDateString()}
            </p>
          </div>

          <div className="grid grid-cols-3 gap-8">
            <div className="col-span-2">
              <h3 className="text-lg font-semibold mb-4 border-b pb-2">
                Personal Information
              </h3>
              <div className="space-y-3">
                <div>
                  <strong>Name:</strong> {form.name || "N/A"}
                </div>
                <div>
                  <strong>Date of Birth:</strong> {form.dob || "N/A"}
                </div>
                <div>
                  <strong>Gender:</strong> {form.gender || "N/A"}
                </div>
                <div>
                  <strong>Residential Address:</strong>{" "}
                  {form.resAddress || "N/A"}
                </div>
                <div>
                  <strong>Office Address:</strong> {form.officeAddress || "N/A"}
                </div>
              </div>
            </div>

            <div className="col-span-1">
              <h3 className="text-lg font-semibold mb-4 border-b pb-2">
                Student Photo
              </h3>
              <div className="flex justify-center">
                {preview ? (
                  <img
                    src={preview}
                    alt="Student Photo"
                    className="w-20 h-20 object-cover border-2 border-gray-300 rounded-lg shadow-sm"
                    style={{ objectPosition: "center top" }}
                  />
                ) : (
                  <div className="w-20 h-20 border-2 border-gray-300 rounded-lg bg-gray-100 flex items-center justify-center shadow-sm">
                    <span className="text-gray-400 text-xs text-center">
                      No Photo
                    </span>
                  </div>
                )}
              </div>
              <p className="text-xs text-gray-500 text-center mt-2">
                Student Photo
              </p>
            </div>
          </div>

          <div className="mt-8">
            <h3 className="text-lg font-semibold mb-4 border-b pb-2">
              Contact Information
            </h3>
            <div className="grid grid-cols-2 gap-8">
              <div>
                <div>
                  <strong>Phone:</strong> {form.phoneR || "N/A"}
                </div>
                <div>
                  <strong>Secondary Phone:</strong> {form.phoneO || "N/A"}
                </div>
              </div>
              <div>
                <div>
                  <strong>Mobile:</strong> {form.mobile || "N/A"}
                </div>
                <div>
                  <strong>Email:</strong> {form.email || "N/A"}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8">
            <h3 className="text-lg font-semibold mb-4 border-b pb-2">
              Academic Information
            </h3>
            <div className="grid grid-cols-2 gap-8">
              <div>
                <div>
                  <strong>Educational Qualification:</strong>{" "}
                  {form.qualification || "N/A"}
                </div>
                <div>
                  <strong>Course:</strong>{" "}
                  {courses.find((c) => c.courseId == form.course)?.courseName ||
                    "N/A"}
                </div>
                <div>
                  <strong>Batch:</strong>{" "}
                  {filteredBatches.find((b) => b.batchId == form.batchId)
                    ?.batchName || "N/A"}
                </div>
              </div>
              <div>
                <div>
                  <strong>Course Fees:</strong> ₹{form.courseFees || "N/A"}
                </div>
                <div>
                  <strong>Initial Payment:</strong> ₹
                  {form.initialPayment || "0"}
                </div>
                <div>
                  <strong>Pending Fees:</strong> ₹{form.pendingFees || "N/A"}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 text-center">
            <div className="inline-block border-2 border-gray-300 p-4 rounded">
              <p className="text-sm text-gray-600">Student Signature</p>
              <div className="w-32 h-16 border-b-2 border-gray-400 mt-2"></div>
            </div>
            <div className="inline-block border-2 border-gray-300 p-4 rounded ml-8">
              <p className="text-sm text-gray-600">Authorized Signature</p>
              <div className="w-32 h-16 border-b-2 border-gray-400 mt-2"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
