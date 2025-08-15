"use client";
import Footer from "@/app/footer/components/Footer";
import Navcomponent from "@/app/home/components/Navcomponent";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function CourseDetailPage() {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const API = `http://localhost:8080/api/courses/${id}`;

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const res = await fetch(API);
        const data = await res.json();
        setCourse(data);
      } catch (err) {
        console.error("Error fetching course detail:", err);
      }
    };
    fetchCourse();
  }, [id]);

  if (!course) {
    return (
      <div className="text-center py-20 text-gray-600 text-lg">
        Loading course details...
      </div>
    );
  }

  return (
    <>
      <Navcomponent />
      <div className="max-w-6xl mx-auto p-6 space-y-8 pt-[150px]">
        <div className="w-full h-[400px] rounded shadow-lg overflow-hidden">
          <img
            src={
              course.coverPhoto
                ? course.coverPhoto.startsWith("/courses/")
                  ? course.coverPhoto
                  : `/courses/${course.coverPhoto}`
                : "/default-profile.png"
            }
            alt={course.courseName || "Course Cover"}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.src = "/default-profile.png";
            }}
          />
        </div>

        <h1 className="text-4xl font-bold text-blue-900 text-center">
          {course.courseName}
        </h1>

        <div className="bg-white p-6 rounded shadow space-y-4 text-gray-700">
          <p>
            <span className="font-semibold">Description:</span>{" "}
            {course.courseDescription}
          </p>
          <p>
            <span className="font-semibold">Syllabus:</span>{" "}
            {course.courseSyllabus}
          </p>
          <p>
            <span className="font-semibold">Duration:</span>{" "}
            {course.courseDuration} days
          </p>
          <p>
            <span className="font-semibold">Age Group:</span>{" "}
            {course.ageGrpType}
          </p>
          {/* <p>
            <span className="font-semibold">Video File Path:</span>{" "}
            {course.videoId}
          </p> */}
          <p>
            <span className="font-semibold">Active Status:</span>{" "}
            {course.courseIsActive ? "Active" : "Inactive"}
          </p>
        </div>
      </div>
      <Footer />
    </>
  );
}
