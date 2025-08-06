"use client";
import { useState } from "react";

export default function Getintouch() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      name: formData.name,
      email: formData.email,
      number: formData.phone,
      message: formData.message,
    };

    try {
      const res = await fetch("http://localhost:8080/api/contactus/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        alert("Message sent successfully!");
        setFormData({ name: "", email: "", phone: "", message: "" });
      } else {
        alert("Failed to send message.");
      }
    } catch (err) {
      console.error("Error:", err);
      alert("Something went wrong.");
    }
  };

  return (
    <div className="pt-[124px]">
      <header className="bg-white text-[#2c285e] py-3 text-center shadow-lg">
        <h1 className="text-4xl font-bold">Get In Touch With Us</h1>
        <p className="text-lg mt-2">Fill out the form below</p>
      </header>

 
      <section className="p-8 bg-white text-gray-800">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-2xl font-semibold text-[#2c285e] mb-4">Our Origin</h2>
            <p className="mb-4">
              We are a part of Upanagar Shikshan Mandal (USM), a pioneering educational trust in the western suburbs of Mumbai. Commencing in 1956, USM has blossomed into 14 educational institutes that impart quality education from primary school to Post-Graduate courses.
            </p>

            <h3 className="text-xl font-semibold text-[#2c285e] mb-2">Reach Us At:</h3>
            <p>
              <strong>Authorised Training Centre</strong><br />
              5th Floor, Vidyanidhi Education Complex, Vidyanidhi Road, Juhu Scheme Andheri (W), Mumbai 400 049 India
            </p>
            <p className="mt-2">
              <strong>Mobile:</strong> 9029435311 / 9324095272 / 9987062416
              <br />
              <strong>Email:</strong> training@vidyanidhi.com
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Name*</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-[#6F4E37]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Email*</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-[#6F4E37]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Phone Number*</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-[#6F4E37]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Message</label>
                <textarea
                  name="message"
                  rows="4"
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full border border-gray-300 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-[#6F4E37]"
                ></textarea>
              </div>
              <button
                type="submit"
                className="w-full bg-red-600 text-white py-2 rounded hover:bg-red-500 transition"
              >
                Send Message
              </button>
            </form>
          </div>
        </div>
      </section>

      
      <section className="w-full h-[60vh] md:h-[90vh]">
        <iframe
          src="https://www.google.com/maps?q=19.113281,72.830258&z=18&output=embed"
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen=""
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="w-full h-full"
        ></iframe>
      </section>
    </div>
  );
}
