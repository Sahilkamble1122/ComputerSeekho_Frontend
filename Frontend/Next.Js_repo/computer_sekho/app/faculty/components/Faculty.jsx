'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';

export default function Faculty() {
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStaff = async () => {
      try {
        const res = await fetch('http://localhost:8080/api/staff');
        const data = await res.json();
        setStaff(data);
      } catch (err) {
        console.error('Failed to fetch staff:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStaff();
  }, []);

  return (
    <section className="py-12 pt-[150px]">
      <h2 className="text-3xl md:text-4xl font-bold text-center text-blue-900 mb-8">
        Our Faculty
      </h2>

      {loading ? (
        <div className="text-center py-20 text-gray-600">Loading faculty data...</div>
      ) : staff.length === 0 ? (
        <div className="text-center py-20 text-gray-500 text-lg">Staff not found.</div>
      ) : (
        <div className="container mx-auto px-4 space-y-10">
          {staff.map((faculty, index) => (
            <div
              key={index}
              className="relative w-full max-w-6xl mx-auto rounded-md overflow-hidden"
            >
              <Image
                src={faculty.photo_url || '/default.jpg'}
                alt={faculty.staff_name}
                width={1200}
                height={600}
                className="w-full h-auto object-cover"
                priority={index === 0}
              />

              <div className="absolute top-1/2 right-0 w-full md:w-[40%] bg-red-500/70 text-white rounded-l-xl p-6 md:p-8 shadow-lg">
                <h3 className="text-2xl font-bold mb-2 font-[cursive]">
                  {faculty.staff_name}
                </h3>
                <p className="text-lg font-semibold mb-3">{faculty.staff_role}</p>
                <p className="text-sm leading-relaxed">
                  Email: {faculty.staff_email} <br />
                  Mobile: {faculty.staff_mobile}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
