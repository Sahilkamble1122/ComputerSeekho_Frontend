<<<<<<< Updated upstream
'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";

const Coursecard = () => {
  const pathname = usePathname();

  const isHome = pathname === '/home';

  return (
    <section className="p-10 bg-white">
      <div className="max-w-7xl mx-auto px-4">

        {/* Show Back Button only if NOT on home page */}
        {!isHome && (
          <div className="mb-6">
            <Link
              href="/home"
              className="inline-flex items-center text-blue-900 hover:text-blue-700 font-medium"
            >
              <span className="mr-2 text-xl">&#8592;</span> {/* Left arrow */}
              Back to Home
            </Link>
          </div>
        )}

        <h2 className="text-4xl font-bold text-center text-blue-900 mb-12 tracking-wider">
          Courses We Offer
        </h2>

        <div className="grid md:grid-cols-3 gap-8">
          {/* PG-DAC Card */}
          <div className="bg-white shadow-md hover:shadow-lg transition-shadow duration-300">
            <img
              src="https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg"
              alt="CSE"
              className="w-full h-56 object-cover"
            />
            <div className="p-6">
              <h3 className="text-xl font-bold mb-2 text-gray-800">
                PG-DAC Courses
              </h3>
              <p className="text-gray-600 mb-4">
                The PG-DAC (Post Graduate Diploma in Advanced Computing) is a nine-month postgraduate diploma program offered by C-DAC designed to equip engineers and IT professionals with advanced skills in software development
              </p>
              <Link
                href="/course/details"
                className="inline-block bg-red-600 text-white px-5 py-2 font-semibold rounded hover:bg-red-700 transition"
              >
                Read More
              </Link>
            </div>
          </div>

          {/* PG-DBDA Card */}
          <div className="bg-white shadow-md hover:shadow-lg transition-shadow duration-300">
            <img
              src="https://images.pexels.com/photos/1595385/pexels-photo-1595385.jpeg"
              alt="CSE"
              className="w-full h-56 object-cover"
            />
            <div className="p-6">
              <h3 className="text-xl font-bold mb-2 text-gray-800">
                PG DBDA Courses
              </h3>
              <p className="text-gray-600 mb-4">
                The PG-DBDA (Post Graduate Diploma in Big Data Analytics) is a specialized program crafted to equip individuals with the essential skills and domain knowledge required to thrive in the evolving field of data science and analytics.
              </p>
              <Link
                href="/course/details"
                className="inline-block bg-red-600 text-white px-5 py-2 font-semibold rounded hover:bg-red-700 transition"
              >
                Read More
              </Link>
            </div>
          </div>

          {/* MS-CIT Card */}
          <div className="bg-white shadow-md hover:shadow-lg transition-shadow duration-300">
            <img
              src="https://images.pexels.com/photos/256401/pexels-photo-256401.jpeg"
              alt="CSE"
              className="w-full h-56 object-cover"
            />
            <div className="p-6">
              <h3 className="text-xl font-bold mb-2 text-gray-800">
                MSCIT LAB
              </h3>
              <p className="text-gray-600 mb-4">
                The MS-CIT (Master of Science in Information Technology) course at SM Vita is a foundational IT literacy program that equips learners with essential digital skills, covering operating systems, MS Office, and basic programming fundamentals.
              </p>
              <Link
                href="/course/details"
                className="inline-block bg-red-600 text-white px-5 py-2 font-semibold rounded hover:bg-red-700 transition"
              >
                Read More
              </Link>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Coursecard;
=======
// "use client";

// import Link from "next/link";

// export default function CourseCard({ course }) {
//   if (!course || !course.coverPhoto) return null;

//   return (
//     <div className="bg-white rounded-lg shadow hover:shadow-md transition-shadow overflow-hidden h-full flex flex-col">
//       <img
//         src={course.coverPhoto}
//         alt={course.courseName || "Course Cover"}
//         className="w-full h-48 object-cover"
//       />
//       <div className="p-4 space-y-2 flex-1 flex flex-col">
//         <h2 className="text-xl font-semibold text-gray-800">
//           {course.courseName}
//         </h2>
//         <p className="text-gray-600 text-sm line-clamp-3">
//           {course.courseDescription}
//         </p>
//         <div className="mt-auto">
//           <Link
//             href={`/courses/${course.courseId}`}
//             className="inline-block text-red-600 font-medium hover:underline hover:text-red-800 cursor-pointer"
//           >
//             Read More
//           </Link>
//         </div>
//       </div>
//     </div>
//   );
// }

"use client";

import Link from "next/link";

export default function CourseCard({ course }) {
  if (!course || !course.coverPhoto) return null;

  return (
    <div className="bg-white rounded-lg shadow hover:shadow-md transition-shadow overflow-hidden h-full flex flex-col">
      <img
        src={course.coverPhoto}
        alt={course.courseName || "Course Cover"}
        className="w-full h-48 object-cover"
      />
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
>>>>>>> Stashed changes
