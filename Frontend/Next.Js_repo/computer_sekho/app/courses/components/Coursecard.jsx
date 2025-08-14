"use client";

import Link from "next/link";

export default function CourseCard({ course }) {
  if (!course) return null;



  return (
    <div className="bg-white rounded-lg shadow hover:shadow-md transition-shadow overflow-hidden h-full flex flex-col">
      <div className="w-full h-48">
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
      <div className="p-4 space-y-2 flex-1 flex flex-col">
        <h2 className="text-xl font-semibold text-gray-800">
          {course.courseName}
        </h2>
        <p className="text-gray-600 text-sm line-clamp-3">
          {course.courseDescription}
        </p>
        <div className="mt-auto">
          <Link
            href={`/courses/${course.courseId}`}
            className="inline-block text-red-600 font-medium hover:underline hover:text-red-800 cursor-pointer"
          >
            Read More
          </Link>
        </div>
      </div>
    </div>
  );
}
