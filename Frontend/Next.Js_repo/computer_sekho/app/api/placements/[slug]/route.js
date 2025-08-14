// export async function GET() {
//   return Response.json({
//     course: "PG DBDA",
//     batch: "Aug 2024",
//     slug: "pg-dbda-aug-2024",
//     students: [
//       {
//         name: "Rohit Sharma",
//         company: "TCS",
//         photo: "/students/rohit.jpg",
//       },
//       {
//         name: "Anjali Verma",
//         company: "Infosys",
//         photo: "/students/anjali.jpg",
//       },
//       {
//         name: "Aditya Patil",
//         company: "Capgemini",
//         photo: "/students/aditya.jpg",
//       },
//       {
//         name: "Neha Singh",
//         company: "Wipro",
//         photo: "/students/neha.jpg",
//       },
//       {
//         name: "Manish Gupta",
//         company: "Cognizant",
//         photo: "/students/manish.jpg",
//       },
//       {
//         name: "Sneha Joshi",
//         company: "Tech Mahindra",
//         photo: "/students/sneha.jpg",
//       },
//       {
//         name: "Karan Mehta",
//         company: "LTI",
//         photo: "/students/karan.jpg",
//       },
//       {
//         name: "Pooja Shah",
//         company: "Persistent",
//         photo: "/students/pooja.jpg",
//       },
//       {
//         name: "Vikas Rao",
//         company: "HCL",
//         photo: "/students/vikas.jpg",
//       },
//       {
//         name: "Riya Jain",
//         company: "Accenture",
//         photo: "/students/riya.jpg",
//       },
//       {
//         name: "Amit Dubey",
//         company: "Mindtree",
//         photo: "/students/amit.jpg",
//       },
//       {
//         name: "Divya Nair",
//         company: "IBM",
//         photo: "/students/divya.jpg",
//       },
//       {
//         name: "Saurabh Mishra",
//         company: "Capgemini",
//         photo: "/students/saurabh.jpg",
//       },
//       {
//         name: "Shraddha Kulkarni",
//         company: "TCS",
//         photo: "/students/shraddha.jpg",
//       },
//       {
//         name: "Rajesh Shetty",
//         company: "Infosys",
//         photo: "/students/rajesh.jpg",
//       },
//       {
//         name: "Meena Raut",
//         company: "LTI",
//         photo: "/students/meena.jpg",
//       },
//     ],
//   });
// }
// app/api/placements/[slug]/route.js

import { API_CONFIG, getApiUrl } from "@/lib/config";

export async function GET(req, { params }) {
  const { slug } = params;

  try {
    // Resolve slug -> batchId using batches API
    const batchesResponse = await fetch(getApiUrl(API_CONFIG.ENDPOINTS.BATCHES));
    if (!batchesResponse.ok) {
      throw new Error(`Failed to fetch batches: ${batchesResponse.status}`);
    }
    const batches = await batchesResponse.json();

    const courseMapping = {
      101: "PG DBDA",
      98: "PG DAC",
      103: "PRE - CAT",
    };

    const slugify = (text) => text?.toLowerCase().replace(/\s+/g, "-") ?? "";

    const matchedBatch = batches.find((batch) => {
      const courseName = courseMapping[batch.courseId] || `Course ${batch.courseId}`;
      const computedSlug = `${slugify(courseName)}-${slugify(batch.batchName)}`;
      return computedSlug === slug;
    });

    if (!matchedBatch) {
      return Response.json({ students: [] }, { status: 200 });
    }

    const batchId = matchedBatch.batchId;

    // Fetch all students and filter by batchId and isPlaced
    const studentsResponse = await fetch(getApiUrl(API_CONFIG.ENDPOINTS.STUDENTS));
    if (!studentsResponse.ok) {
      throw new Error(`Failed to fetch students: ${studentsResponse.status}`);
    }
    const allStudents = await studentsResponse.json();

    const students = (Array.isArray(allStudents) ? allStudents : [])
      .filter((s) => s.batchId === batchId && s.isPlaced === true)
      .map((s) => {
        const raw = String(s.photoUrl || "");
        if (raw.startsWith("http")) {
          return { name: s.studentName, photo: raw };
        }
        // Normalize to Next.js public path
        let normalized = raw.replace(/\\/g, "/"); // Windows -> URL slashes
        normalized = normalized.replace(/^\/+/, ""); // leading slashes
        normalized = normalized.replace(/^public\//i, ""); // drop leading public/
        const photo = `/${normalized}`; // serve from Next public
        return {
          name: s.studentName,
          photo,
        };
      });

    return Response.json({ students });
  } catch (error) {
    console.error("Error in placement details GET:", error);
    return Response.json({ students: [] }, { status: 200 });
  }
}

//future database connect hone ke baad isko replace karna hai slug ka kuch to dekhna padega isme fetching ke time
// import { db } from "@/lib/db"; // your DB connection (e.g., Prisma)
// import { NextResponse } from "next/server";

// export async function GET(_, { params }) {
//   const { slug } = params;

//   const batch = await db.placement.findFirst({
//     where: { slug },
//     include: {
//       students: {
//         where: { placed: true },
//         select: {
//           name: true,
//           company: true,
//           photoUrl: true,
//         },
//       },
//     },
//   });

//   if (!batch) {
//     return NextResponse.json({ students: [] }, { status: 404 });
//   }

//   const students = batch.students.map((s) => ({
//     name: s.name,
//     company: s.company,
//     photo: s.photoUrl,
//   }));

//   return NextResponse.json({ students });
// }
