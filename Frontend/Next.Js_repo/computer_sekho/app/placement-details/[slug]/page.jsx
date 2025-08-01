"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import StudentCard from "../../placements/components/StudentCard";

export default function PlacementDetailPage() {
  const { slug } = useParams();
  const [students, setStudents] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  const studentsPerPage = 16;
  const startIndex = (currentPage - 1) * studentsPerPage;
  const endIndex = startIndex + studentsPerPage;
  const paginatedStudents = students.slice(startIndex, endIndex);
  const totalPages = Math.ceil(students.length / studentsPerPage);

  useEffect(() => {
    async function fetchStudents() {
      try {
        const res = await fetch(`/api/placements/${slug}`);
        const data = await res.json();
        setStudents(data.students); // Must be an array
      } catch (err) {
        console.error("Failed to fetch students:", err);
      }
    }

    fetchStudents();
  }, [slug]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6 text-center">
        Placement Details - {slug.replaceAll("-", " ").toUpperCase()}
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {paginatedStudents.map((s, idx) => (
          <StudentCard
            key={idx}
            name={s.name}
            company={s.company}
            photo={s.photo}
          />
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-8">
          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              className={`px-3 py-1 rounded-full border ${
                currentPage === i + 1
                  ? "bg-blue-600 text-white"
                  : "bg-white text-blue-600"
              }`}
              onClick={() => setCurrentPage(i + 1)}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
