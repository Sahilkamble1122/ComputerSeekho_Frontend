// "use client";

// import Coursecard from "@/app/courses/components/Coursecard";
// import Link from "next/link";
// import { useEffect, useState } from "react";

// export default function CoursesSection() {
//   const [courses, setCourses] = useState([]);

//   useEffect(() => {
//     fetch("http://localhost:8080/api/courses")
//       .then((res) => res.json())
//       .then((data) => setCourses(data))
//       .catch((err) => console.error("Error fetching courses", err));
//   }, []);

//   return (
//     <div className="max-w-7xl mx-auto px-6 py-10">
//       <h2 className="text-3xl font-bold text-center text-blue-900 mb-8">
//         Courses We Offer
//       </h2>

//       {courses.length === 0 ? (
//         <p className="text-center text-gray-500">Loading...</p>
//       ) : (
//         <>
//           <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
//             {courses.slice(0, 3).map((course) => (
//               <Coursecard key={course.courseId} course={course} />
//             ))}
//           </div>

//           <div className="text-center mt-8">
//             <Link
//               href="/courses"
//               className="inline-block bg-red-600 text-white px-6 py-2 rounded hover:bg-red-700 transition"
//             >
//               See All Courses
//             </Link>
//           </div>
//         </>
//       )}
//     </div>
//   );
// }
"use client";

import Coursecard from "@/app/courses/components/Coursecard";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function CoursesSection() {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8080/api/courses")
      .then((res) => res.json())
      .then((data) => setCourses(data))
      .catch((err) => console.error("Error fetching courses", err));
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <h2 className="text-3xl font-bold text-center text-blue-900 mb-8">
        Courses We Offer
      </h2>

      {courses.length === 0 ? (
        <p className="text-center text-gray-500">Loading...</p>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {courses.slice(0, 3).map((course) => (
              <div
                key={course.courseId}
                className="bg-white rounded-lg shadow-lg overflow-hidden flex flex-col hover:shadow-xl transition-shadow duration-300"
              >
                {/* Cover Image */}
                <div className="h-48 w-full overflow-hidden">
                  <img
                    src={
                      course.coverPhoto
                        ? course.coverPhoto.startsWith("/courses/")
                          ? course.coverPhoto
                          : `/courses/${course.coverPhoto}`
                        : "/default-profile.png"
                    }
                    alt={course.courseName}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Course Content */}
                <div className="flex flex-col flex-1 p-5">
                  <h3 className="text-xl font-semibold text-blue-900 mb-2">
                    {course.courseName}
                  </h3>
                  <p className="text-gray-600 text-sm flex-1 line-clamp-3">
                    {course.courseDescription}
                  </p>
                  <div className="mt-4">
                    <Link
                      href={`/courses/${course.courseId}`}
                      className="inline-block bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
                    >
                      Read More
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* See All Button */}
          <div className="text-center mt-10">
            <Link
              href="/courses"
              className="inline-block bg-red-600 text-white px-6 py-2 rounded hover:bg-red-700 transition"
            >
              See All Courses
            </Link>
          </div>
        </>
      )}
    </div>
  );
}
