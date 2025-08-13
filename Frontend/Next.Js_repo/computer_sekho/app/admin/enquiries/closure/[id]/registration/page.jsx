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
  const [allBatches, setAllBatches] = useState([]); // Store all batches
  const [filteredBatches, setFilteredBatches] = useState([]); // Store filtered batches
  const [loading, setLoading] = useState(false);
  const [courseError, setCourseError] = useState("");
  const [batchError, setBatchError] = useState("");
  const [selectedBatch, setSelectedBatch] = useState(null);
  const [paymentTypes, setPaymentTypes] = useState([]);

  const getToken = () => sessionStorage.getItem("token");

  // Helper function to validate image files
  const validateImageFile = (file) => {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    const maxSize = 5 * 1024 * 1024; // 5MB
    
    if (!allowedTypes.includes(file.type)) {
      return { valid: false, error: '❌ Please select a valid image file (JPEG, PNG, GIF, or WebP)' };
    }
    
    if (file.size > maxSize) {
      return { valid: false, error: '❌ Image size should be less than 5MB' };
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
      const filtered = allBatches.filter(batch => 
        batch.courseId && batch.courseId.toString() === form.course.toString()
      );
      setFilteredBatches(filtered);
      
      // Clear batch selection if current batch doesn't match new course
      if (form.batchId && !filtered.find(b => b.batchId.toString() === form.batchId.toString())) {
        setForm(prev => ({ ...prev, batchId: "", courseFees: "", pendingFees: "" }));
        setSelectedBatch(null);
      }
    } else {
      setFilteredBatches([]);
      setForm(prev => ({ ...prev, batchId: "", courseFees: "", pendingFees: "" }));
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
        // Prefer studentName, fallback to enquirerName
        name: data.studentName || data.enquirerName || "",
        // These may not exist on enquiry; leave blank if missing
        dob: data.dob || "",
        gender: data.gender || "",
        // Address keys may differ; keep empty if not present
        resAddress: data.enquirerAddress || "",
        officeAddress: data.officeAddress || "",
        // Phones from enquiry if present
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
        setFilteredBatches([]); // Initially empty until course is selected
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
      // Clear batch selection when course changes
      setForm(prev => ({ ...prev, batchId: "", courseFees: "", pendingFees: "" }));
      setSelectedBatch(null);
    }
    
    if (name === "batchId") {
      const selected = filteredBatches.find((b) => b.batchId.toString() === value);
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
    // Client-side validation only; disable native validation on form
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

      // Prepare JSON payload
      // Compute fees locally to avoid mutating React state directly
      const computedCourseFees = selectedBatch?.courseFees || parseFloat(form.courseFees) || 0;
      const computedPendingFees = (() => {
        const initPay = parseFloat(form.initialPayment) || 0;
        return Math.max(0, computedCourseFees - initPay);
      })();

      // Try different approaches to send the photo
      let success = false;
      let studentResult = null;
      let studentId = null;

      // Use the correct endpoint that handles photo uploads
      try {
        console.log('Using /api/students/form endpoint for photo upload...');
        
        const formData = new FormData();
        formData.append('studentName', form.name);
        formData.append('studentAddress', form.resAddress);
        formData.append('studentGender', form.gender);
        formData.append('studentDob', form.dob);
        formData.append('studentQualification', form.qualification);
        formData.append('studentMobile', form.mobile);
        formData.append('studentEmail', form.email);
        formData.append('courseId', form.course);
        formData.append('studentPassword', 'pass123');
        formData.append('studentUsername', form.email);
        formData.append('batchId', form.batchId);
        
        // Add fees information - these might be needed by the backend
        if (computedCourseFees > 0) {
          formData.append('courseFee', computedCourseFees.toString());
        }
        if (computedPendingFees > 0) {
          formData.append('pendingFees', computedPendingFees.toString());
        }
        
        // Add photo if available
        if (form.photo instanceof File) {
          formData.append('photo', form.photo);
          console.log('✅ Photo added to FormData:', form.photo.name);
        } else {
          console.log('ℹ️ No photo to upload');
        }
        
        console.log('Sending FormData with fields:', Array.from(formData.keys()));
        console.log('Form data values:', {
          studentName: form.name,
          studentAddress: form.resAddress,
          studentGender: form.gender,
          studentDob: form.dob,
          studentQualification: form.qualification,
          studentMobile: form.mobile,
          studentEmail: form.email,
          courseId: form.course,
          batchId: form.batchId,
          photo: form.photo ? form.photo.name : 'None'
        });
        
        const response = await fetch("http://localhost:8080/api/students/form", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            // Don't set Content-Type for FormData, let browser set it
          },
          body: formData,
        });

        if (response.ok) {
          studentResult = await response.json();
          studentId = studentResult.id || studentResult.studentId;
          console.log('✅ Success with /api/students/form endpoint:', studentResult);
          console.log('✅ Photo URL in response:', studentResult.photoUrl);
          success = true;
        } else {
          const errorText = await response.text();
          console.error('❌ Form endpoint failed:', response.status, errorText);
          
          // Try to parse the error response
          try {
            const errorJson = JSON.parse(errorText);
            console.log('Parsed error response:', errorJson);
          } catch (parseError) {
            console.log('Could not parse error response as JSON:', errorText);
          }
          
          // Fallback: Try the regular JSON endpoint without photo
          console.log('🔄 Trying fallback with /api/students endpoint...');
          try {
            const fallbackData = {
              studentName: form.name,
              studentAddress: form.resAddress,
              studentGender: form.gender,
              studentDob: form.dob,
              studentQualification: form.qualification,
              studentMobile: form.mobile,
              studentEmail: form.email,
              courseId: parseInt(form.course),
              studentPassword: "pass123",
              studentUsername: form.email,
              batchId: parseInt(form.batchId),
              courseFee: computedCourseFees,
              pendingFees: computedPendingFees,
            };
            
            console.log('Sending fallback data:', fallbackData);
            
            const fallbackResponse = await fetch("http://localhost:8080/api/students", {
              method: "POST",
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
              body: JSON.stringify(fallbackData),
            });
            
            if (fallbackResponse.ok) {
              studentResult = await fallbackResponse.json();
              studentId = studentResult.id || studentResult.studentId;
              console.log('✅ Success with fallback endpoint:', studentResult);
              success = true;
              alert("✅ Student registered successfully! (Photo could not be saved - backend configuration issue)");
            } else {
              const fallbackErrorText = await fallbackResponse.text();
              console.error('❌ Fallback endpoint also failed:', fallbackResponse.status, fallbackErrorText);
              throw new Error(`Both endpoints failed. Form: ${response.status}, Fallback: ${fallbackResponse.status}`);
            }
          } catch (fallbackError) {
            console.error('Error in fallback attempt:', fallbackError);
            throw new Error(`Registration failed: ${errorText}`);
          }
        }
      } catch (error) {
        console.error('Error in registration:', error);
        throw error;
      }

      if (!success) {
        throw new Error("Registration failed. Please check backend configuration.");
      }

      console.log('✅ Student registration successful!');
      console.log('✅ Student ID:', studentId);
      console.log('✅ Used endpoint:', studentResult.photoUrl ? '/api/students/form' : '/api/students (fallback)');
      
      // Show success message to user
      if (studentResult.photoUrl) {
        alert(`✅ Student registered successfully!\n📸 Photo saved: ${studentResult.photoUrl}`);
      } else {
        alert("✅ Student registered successfully!\n⚠️ Photo could not be saved - using fallback endpoint");
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

          const paymentResult = await paymentResponse.json();
          if (paymentResult.success) {
            alert("✅ Student registered successfully with initial payment!");
          } else {
            alert(
              "✅ Student registered successfully! (Payment processing failed: " +
                paymentResult.error +
                ")"
            );
          }
        } catch (paymentError) {
          alert(
            "✅ Student registered successfully! (Payment processing failed: " +
              paymentError.message +
              ")"
          );
        }
      } else {
        alert("✅ Student registered successfully!");
      }

      // After successful student registration, mark the enquiry as processed/success
      try {
        const token2 = getToken();
        // 1) Send closure reason (only closure fields allowed by backend)
        await fetch(`http://localhost:8080/api/enquiries/${enquiryId}/closure`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token2}`,
          },
          body: JSON.stringify({
            closureReasonId: null,
            closureReason: "Success",
          }),
        });
        // 2) Update the enquiry status to 'success' using the new status endpoint
        await fetch(`http://localhost:8080/api/enquiries/${enquiryId}/status?status=success`, {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token2}`,
          },
        });
        
        // 3) Update enquiryProcessedFlag to true
        await fetch(`http://localhost:8080/api/enquiries/${enquiryId}/processed?enquiryProcessedFlag=true`, {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token2}`,
          },
        });
      } catch (error) {
        console.error('Error updating enquiry status:', error);
        // ignore failure to not block user
      }

      setForm(initialFormState);
      setPreview(null);
      // Redirect to initial payment page for this student
      if (studentId) {
        router.push(`/admin/payments/${studentId}/new-payment`);
      }
    } catch (error) {
      console.error('Registration error:', error);
      alert("❌ Registration failed: " + error.message);
    } finally {
      setLoading(false);
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
                  : "Select Batch"
              }
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
      </form>
    </div>
  );
}
