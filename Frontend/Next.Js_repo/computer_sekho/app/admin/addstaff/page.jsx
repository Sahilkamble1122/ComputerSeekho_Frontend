'use client';
import { useState } from 'react';

export default function StaffRegister() {
  const [formData, setFormData] = useState({
    staff_name: '',
    photo_url: '',
    staff_mobile: '',
    staff_email: '',
    staff_username: '',
    staff_password: '',
    staff_role: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const payload = {
      staffName: formData.staff_name,
      photoUrl: formData.photo_url,
      staffMobile: formData.staff_mobile,
      staffEmail: formData.staff_email,
      staffUsername: formData.staff_username,
      staffPassword: formData.staff_password,
      staffRole: formData.staff_role,
      createdDate: new Date().toISOString(),
      updatedDate: new Date().toISOString(),
    };

    const res = await fetch("http://localhost:8080/api/staff", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      alert("Staff registered successfully.");
      setFormData({
        staff_name: '',
        photo_url: '',
        staff_mobile: '',
        staff_email: '',
        staff_username: '',
        staff_password: '',
        staff_role: '',
      });
    } else {
      alert("Failed to register staff.");
    }
  } catch (error) {
    alert("Something went wrong.");
  }
};

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200 w-full max-w-lg">
        <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">Staff Registration</h2>
        <p className="text-center text-gray-600 mb-8 text-sm">Fill out the form below to register a new staff member.</p>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Staff Name */}
          <div>
            <label htmlFor="staff_name" className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <input
              type="text"
              id="staff_name"
              name="staff_name"
              placeholder="Enter full name"
              value={formData.staff_name}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
              required
            />
          </div>

          {/* Photo URL */}
          <div>
            <label htmlFor="photo_url" className="block text-sm font-medium text-gray-700 mb-1">Photo URL (Optional)</label>
            <input
              type="url"
              id="photo_url"
              name="photo_url"
              placeholder="e.g., http://example.com/profile.jpg"
              value={formData.photo_url}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          {/* Staff Mobile */}
          <div>
            <label htmlFor="staff_mobile" className="block text-sm font-medium text-gray-700 mb-1">Mobile Number</label>
            <input
              type="tel"
              id="staff_mobile"
              name="staff_mobile"
              placeholder="Enter mobile number"
              value={formData.staff_mobile}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
              required
            />
          </div>

          {/* Staff Email */}
          <div>
            <label htmlFor="staff_email" className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
            <input
              type="email"
              id="staff_email"
              name="staff_email"
              placeholder="Enter email address"
              value={formData.staff_email}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
              required
            />
          </div>

          {/* Staff Username */}
          <div>
            <label htmlFor="staff_username" className="block text-sm font-medium text-gray-700 mb-1">Username</label>
            <input
              type="text"
              id="staff_username"
              name="staff_username"
              placeholder="Choose a username"
              value={formData.staff_username}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
              required
            />
          </div>

          {/* Staff Password */}
          <div>
            <label htmlFor="staff_password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              id="staff_password"
              name="staff_password"
              placeholder="Create a password"
              value={formData.staff_password}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
              required
            />
          </div>

          {/* Staff Role */}
          <div>
            <label htmlFor="staff_role" className="block text-sm font-medium text-gray-700 mb-1">Staff Role</label>
            <select
              id="staff_role"
              name="staff_role"
              value={formData.staff_role}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white"
              required
            >
              <option value="">Select a role</option>
              <option value="Teaching">Teaching Staff</option>
              <option value="NonTeaching">Non Teaching</option>
              <option value="HouseKeeping">Ho use Keeping</option>
            </select>
          </div>

          <div className="text-center pt-2">
            <button
              type="submit"
              // Custom inline style for RGB color
              style={{ backgroundColor: 'rgb(236,28,35)', color: 'white' }}
              className="w-full py-2 px-4 font-semibold rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors duration-200"
              // Adding a custom hover style using Tailwind's arbitrary variant or a separate class
              // For a simple demo, we'll keep the hover simple, or use a custom CSS class if needed
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'rgb(200, 24, 30)'} // Darker red on hover
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'rgb(236,28,35)'} // Original red
            >
              REGISTER STAFF
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}