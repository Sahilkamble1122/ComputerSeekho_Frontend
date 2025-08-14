"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import Footer from "../footer/components/Footer";
import Navcomponent from "../home/components/Navcomponent";

export default function CoursesPage() {
  const [courses, setCourses] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const coursesPerPage = 6;

  useEffect(() => {
    fetch("http://localhost:8080/api/courses")
      .then((res) => res.json())
      .then((data) => {
        console.log("Courses loaded:", data.length);
        setCourses(data);
      })
      .catch((err) => console.error("Error loading courses", err));
  }, []);

  const indexOfLastCourse = currentPage * coursesPerPage;
  const indexOfFirstCourse = indexOfLastCourse - coursesPerPage;
  const currentCourses = courses.slice(indexOfFirstCourse, indexOfLastCourse);
  const totalPages = Math.ceil(courses.length / coursesPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handlePrev = () => {
    if (currentPage > 1) {
      handlePageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      handlePageChange(currentPage + 1);
    }
  };

  const getImageSrc = (coverPhoto) => {
    if (!coverPhoto) return "/default-profile.png";
    if (coverPhoto.startsWith("http")) return coverPhoto;
    if (coverPhoto.startsWith("/courses/")) return coverPhoto;
    return `/courses/${coverPhoto}`;
  };

  return (
    <>
      <Navcomponent />
      <div className="max-w-7xl mx-auto px-4 py-10 space-y-12 pt-[150px]">
        <h1 className="text-3xl font-bold text-center text-blue-900 mb-6">
          All Courses
        </h1>

        {courses.length === 0 ? (
          <p className="text-center text-gray-500">No courses available.</p>
        ) : (
          <div className="space-y-16">
            {currentCourses.map((course, index) => (
              <div
                key={course.courseId}
                className="relative w-full h-[300px] rounded-lg overflow-hidden shadow-lg"
              >
                {/* Background Image */}
                <img
                  src={getImageSrc(course.coverPhoto)}
                  alt={course.courseName || "Course Cover"}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    console.log("Image failed:", e.target.src);
                    e.target.src = "/default-profile.png";
                  }}
                  onLoad={() => {
                    console.log("Image loaded:", course.courseName, course.coverPhoto);
                  }}
                />

                {/* Overlay with content */}
                <div className="absolute inset-0 flex flex-col justify-center items-center text-black text-center px-6">
                  <h2 className="text-3xl font-bold mb-2 drop-shadow-lg bg-white bg-opacity-80 px-4 py-2 rounded">
                    {course.courseName}
                  </h2>
                  <p className="text-sm max-w-2xl mb-4 line-clamp-3 drop-shadow bg-white bg-opacity-80 px-4 py-2 rounded">
                    {course.courseDescription}
                  </p>
                  <Link
                    href={`/courses/${course.courseId}`}
                    className="bg-white text-blue-600 font-semibold py-2 px-6 rounded-full hover:bg-red-600 hover:text-white transition drop-shadow-lg"
                  >
                    Read More
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-10 space-x-2 flex-wrap items-center">
            <button
              onClick={handlePrev}
              disabled={currentPage === 1}
              className={`px-4 py-2 rounded ${
                currentPage === 1
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              Previous
            </button>

            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i + 1}
                onClick={() => handlePageChange(i + 1)}
                className={`px-4 py-2 rounded ${
                  currentPage === i + 1
                    ? "bg-red-600 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                {i + 1}
              </button>
            ))}

            <button
              onClick={handleNext}
              disabled={currentPage === totalPages}
              className={`px-4 py-2 rounded ${
                currentPage === totalPages
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              Next
            </button>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
}
