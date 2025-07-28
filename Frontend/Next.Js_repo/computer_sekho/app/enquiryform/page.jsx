"use client";
import { useState } from "react";
export default function EnquiryForm() {
  const [form, setForm] = useState({
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
    photo: "",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
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
    if (!form.startDate) newErrors.startDate = "Start date is required";
    if (!form.time) newErrors.time = "Class time is required";
    if (!form.paymentMode) newErrors.paymentMode = "Payment mode is required";
    if (!form.amount || form.amount <= 0)
      newErrors.amount = "Amount must be greater than 0";
    if (
      (form.paymentMode === "Cheque" || form.paymentMode === "DD") &&
      !form.chequeNo.trim()
    ) {
      newErrors.chequeNo = "Cheque/DD No. is required";
    }
    if (
      (form.paymentMode === "Cheque" || form.paymentMode === "DD") &&
      !form.bankName.trim()
    ) {
      newErrors.bankName = "Bank name is required";
    }
    if (
      (form.paymentMode === "Cheque" || form.paymentMode === "DD") &&
      !form.paymentDate
    ) {
      newErrors.paymentDate = "Payment date is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) {
      alert("❌ Please correct the errors before submitting.");
      return;
    }

    console.log("✅ Form submitted:", form);
    alert("Form submitted successfully!");
  };

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-white shadow-md rounded-xl">
      <div className="flex items-center justify-between mb-4">
        {/* VITA Logo */}
        <img src="/logo.png" alt="VITA Logo" className="w-35 h-auto" />

        {/* Form Heading */}
        <h2 className="text-4xl font-bold text-[#2c2b5e] text-center flex-1">
          Enrollment Form
        </h2>

        {/* Empty div for spacing */}
        <div className="w-20" />
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Form Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
          {/* Left Side - Inputs */}
          <div className="space-y-4">
            <div>
              <label className="block font-semibold">Name:</label>
              <input
                type="text"
                name="name"
                placeholder="Name"
                onChange={handleChange}
                className="input"
              />
              {errors.name && (
                <p className="text-red-600 text-sm">{errors.name}</p>
              )}
            </div>
            <div className="flex items-center gap-6 text-sm mt-4">
              {/* Date of Birth */}
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

              {/* Gender */}
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
                  required
                />
                Male
              </label>

              <label className="flex items-center gap-1">
                <input
                  type="radio"
                  name="gender"
                  value="Female"
                  checked={form.gender === "Female"}
                  onChange={handleChange}
                  required
                />
                Female
              </label>
            </div>
          </div>

          <div className="flex flex-col items-center justify-start w-full md:w-44 border rounded-lg p-3 bg-gray-50 shadow-sm ml-auto">
            <label className="text-sm font-semibold text-center mb-2">
              Student Photo
            </label>

            {/* Photo Preview Box */}
            <div className="w-24 h-24 border rounded bg-white flex items-center justify-center overflow-hidden">
              {form.photo ? (
                <img
                  src={form.photo}
                  alt="Preview"
                  className="object-cover w-full h-full"
                />
              ) : (
                <span className="text-gray-400 text-xs text-center">
                  No Image
                </span>
              )}
            </div>

            {/* Custom File Input */}
            <label className="mt-2 cursor-pointer text-blue-600 text-sm hover:underline">
              Upload
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onload = () => {
                      setForm((prev) => ({
                        ...prev,
                        photo: reader.result,
                      }));
                    };
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
          placeholder="Residential Address"
          onChange={handleChange}
          className="input h-20"
        />
        {errors.resAddress && (
          <p className="text-red-600 text-sm">{errors.resAddress}</p>
        )}
        <label className="block font-semibold">Office Address:</label>
        <textarea
          name="officeAddress"
          placeholder="Office Address"
          onChange={handleChange}
          className="input h-20"
        />

        <div className="flex items-center flex-wrap gap-4 text-sm mt-4">
          <label className="font-semibold">Phone (R):</label>
          <input
            type="tel"
            name="phoneR"
            value={form.phoneR}
            onChange={handleChange}
            className="border border-gray-300 rounded px-2 py-1 w-[150px]"
            required
            pattern="[0-9]{6,12}"
            title="Enter a valid phone number (6-12 digits)"
          />

          <label className="font-semibold">Phone (O):</label>
          <input
            type="tel"
            name="phoneO"
            value={form.phoneO}
            onChange={handleChange}
            className="border border-gray-300 rounded px-2 py-1 w-[150px]"
            required
            pattern="[0-9]{6,12}"
            title="Enter a valid phone number (6-12 digits)"
          />

          <label className="font-semibold">Mobile:</label>
          <input
            type="tel"
            name="mobile"
            value={form.mobile}
            onChange={handleChange}
            className="border border-gray-300 rounded px-2 py-1 w-[150px]"
            required
            pattern="[0-9]{10}"
            title="Enter a valid 10-digit mobile number"
          />
        </div>

        <div>
          <label className="block font-semibold mb-1">Email ID:</label>
          <input
            type="email"
            name="email"
            placeholder="Email ID"
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
            placeholder="Educational Qualification"
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
          <input
            type="text"
            name="course"
            placeholder="Course Enrolled For"
            onChange={handleChange}
            className="input"
          />
          {errors.course && (
            <p className="text-red-600 text-sm">{errors.course}</p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block font-semibold mb-1">Start Date:</label>
            <input
              type="date"
              name="startDate"
              onChange={handleChange}
              className="input"
            />
            {errors.startDate && (
              <p className="text-red-600 text-sm">{errors.startDate}</p>
            )}
          </div>
          <div>
            <label className="block font-semibold mb-1">Class Time:</label>
            <input
              type="time"
              name="time"
              onChange={handleChange}
              className="input"
            />
            {errors.time && (
              <p className="text-red-600 text-sm">{errors.time}</p>
            )}
          </div>
        </div>

        <div>
          <label className="block font-semibold">Payment Mode:</label>
          <div className="flex gap-4 mt-1">
            <label>
              <input
                type="radio"
                name="paymentMode"
                value="Cash"
                checked={form.paymentMode === "Cash"}
                onChange={handleChange}
              />{" "}
              Cash
            </label>
            <label>
              <input
                type="radio"
                name="paymentMode"
                value="Cheque"
                checked={form.paymentMode === "Cheque"}
                onChange={handleChange}
              />{" "}
              Cheque
            </label>
            <label>
              <input
                type="radio"
                name="paymentMode"
                value="DD"
                checked={form.paymentMode === "DD"}
                onChange={handleChange}
              />{" "}
              DD
            </label>
          </div>
          {errors.paymentMode && (
            <p className="text-red-600 text-sm">{errors.paymentMode}</p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <input
              type="number"
              name="amount"
              placeholder="Amount"
              onChange={handleChange}
              className="input"
            />
            {errors.amount && (
              <p className="text-red-600 text-sm">{errors.amount}</p>
            )}
          </div>
          <div>
            <input
              type="text"
              name="chequeNo"
              placeholder="Cheque/DD No."
              onChange={handleChange}
              className="input"
            />
            {errors.chequeNo && (
              <p className="text-red-600 text-sm">{errors.chequeNo}</p>
            )}
          </div>
          <div>
            <input
              type="text"
              name="bankName"
              placeholder="Bank Name"
              onChange={handleChange}
              className="input"
            />
            {errors.bankName && (
              <p className="text-red-600 text-sm">{errors.bankName}</p>
            )}
          </div>
        </div>

        <div>
          <label className="block font-semibold mb-1">Payment Date:</label>
          <input
            type="date"
            name="paymentDate"
            onChange={handleChange}
            className="input"
          />
          {errors.paymentDate && (
            <p className="text-red-600 text-sm">{errors.paymentDate}</p>
          )}
        </div>
        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
        >
          Submit
        </button>
      </form>
    </div>
  );
}
