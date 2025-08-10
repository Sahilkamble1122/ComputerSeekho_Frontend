"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

export default function Faculty() {
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStaff = async () => {
      try {
        const res = await fetch("http://localhost:8080/api/staff");
        const data = await res.json();
        // Filter to show only teaching staff
        const teachingStaff = data.filter(staff => staff.staffRole === "Teaching");
        setStaff(teachingStaff);
      } catch (err) {
        console.error("Failed to fetch staff:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStaff();
  }, []);

  // Helper function to validate and get image URL
  const getImageUrl = (photoUrl) => {
    if (!photoUrl || photoUrl === "null" || photoUrl === "undefined" || photoUrl.trim() === "") {
      return "/default-profile.png";
    }
    
    // If it's already a full URL, return as is
    if (photoUrl.startsWith("http://") || photoUrl.startsWith("https://")) {
      return photoUrl;
    }
    
    // If it's a relative path, ensure it starts with /
    if (photoUrl.startsWith("/")) {
      return photoUrl;
    }
    
    // If it's a relative path without leading slash, add it
    return `/${photoUrl}`;
  };

  return (
    <section className="py-12 pt-[150px]">
      <h2 className="text-3xl md:text-4xl font-bold text-center text-blue-900 mb-8">
        Our Faculty
      </h2>

      {loading ? (
        <div className="text-center py-20 text-gray-600">
          Loading faculty data...
        </div>
      ) : staff.length === 0 ? (
        <div className="text-center py-20 text-gray-500 text-lg">
          No teaching staff found.
        </div>
      ) : (
        <div className="container mx-auto px-4 space-y-10">
          {staff.map((faculty, index) => (
            <div
              key={index}
              className="relative w-full max-w-6xl mx-auto rounded-md overflow-hidden"
            >
              {/* Fixed height container to prevent layout shifts */}
              <div className="relative w-full h-[400px] md:h-[500px]">
                <Image
                  src={getImageUrl(faculty.photoUrl)}
                  alt={faculty.staffName ? faculty.staffName : "Faculty Photo"}
                  fill
                  className="object-cover"
                  priority={index === 0}
                  unoptimized={true}
                />
              </div>
              <div className="absolute top-1/2 right-0 w-full md:w-[40%] bg-red-500/70 text-white rounded-l-xl p-6 md:p-8 shadow-lg">
                <h3 className="text-2xl font-bold mb-2 font-[cursive]">
                  {faculty.staffName}
                </h3>
                <p className="text-lg font-semibold mb-3">
                  {faculty.staffRole}
                </p>
                <p className="text-sm leading-relaxed">
                  Email: {faculty.staffEmail} <br />
                  Mobile: {faculty.staffMobile}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
