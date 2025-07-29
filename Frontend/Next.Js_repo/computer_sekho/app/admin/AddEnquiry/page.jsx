"use client"
import { useState } from 'react';

export default function EnquiryForm() {
  const [formData, setFormData] = useState({
    enquirer_name: '',
    enquirer_address: '',
    enquirer_mobile: '',
    enquirer_alternate_mob: '',
    enquirer_email_id: '',
    enquirer_query: '',
    closure_reason_id: '',
    closure_reason: '',
    course_id: '',
    student_name: '',
    follow_up_date: '',
  });

  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState('');

  const courses = [
    { id: 1, name: 'PG DAC' },
    { id: 2, name: 'PG DBDA' },
    { id: 3, name: 'MS-CIT' },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validate = () => {
    let err = {};
    if (!formData.enquirer_name.trim()) err.enquirer_name = 'Required';
    if (!formData.enquirer_mobile.trim()) err.enquirer_mobile = 'Required';
    if (!/^[0-9]{10}$/.test(formData.enquirer_mobile)) err.enquirer_mobile = 'Invalid';
    if (!formData.enquirer_email_id.includes('@')) err.enquirer_email_id = 'Invalid Email';
    if (!formData.course_id) err.course_id = 'Select a course';
    if (!formData.follow_up_date) err.follow_up_date = 'Required';
    return err;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setErrors({});
   };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow rounded-xl">
      <h2 className="text-2xl font-bold mb-4">Enquiry Form</h2>
      {success && <p className="text-green-600 mb-4">{success}</p>}
      <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4">
        <input name="enquirer_name" placeholder="Enquirer Name" value={formData.enquirer_name} onChange={handleChange} className="border p-2" />
        {errors.enquirer_name && <span className="text-red-500">{errors.enquirer_name}</span>}

        <textarea name="enquirer_address" placeholder="Address" value={formData.enquirer_address} onChange={handleChange} className="border p-2" />

        <input name="enquirer_mobile" placeholder="Mobile No." value={formData.enquirer_mobile} onChange={handleChange} className="border p-2" />
        {errors.enquirer_mobile && <span className="text-red-500">{errors.enquirer_mobile}</span>}

        <input name="enquirer_alternate_mob" placeholder="Alternate Mobile No." value={formData.enquirer_alternate_mob} onChange={handleChange} className="border p-2" />

        <input type="email" name="enquirer_email_id" placeholder="Email" value={formData.enquirer_email_id} onChange={handleChange} className="border p-2" />
        {errors.enquirer_email_id && <span className="text-red-500">{errors.enquirer_email_id}</span>}

        <textarea name="enquirer_query" placeholder="Query / Description" value={formData.enquirer_query} onChange={handleChange} className="border p-2" />

        <input name="student_name" placeholder="Student Name" value={formData.student_name} onChange={handleChange} className="border p-2" />

        <select name="course_id" value={formData.course_id} onChange={handleChange} className="border p-2">
          <option value="">Select Course</option>
          {courses.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        {errors.course_id && <span className="text-red-500">{errors.course_id}</span>}

        <input type="date" name="follow_up_date" value={formData.follow_up_date} onChange={handleChange} className="border p-2" />
        {errors.follow_up_date && <span className="text-red-500">{errors.follow_up_date}</span>}

        <button type="submit" className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700">Submit</button>
      </form>
    </div>
  );
}