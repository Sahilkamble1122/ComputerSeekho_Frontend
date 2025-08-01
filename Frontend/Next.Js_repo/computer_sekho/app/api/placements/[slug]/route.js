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

export async function GET(req, { params }) {
  const { slug } = params;

  const data = {
    "pg-dbda-aug-2024": [
      { name: "Rohit Sharma", company: "TCS", photo: "/students/rohit.jpg" },
      {
        name: "Anjali Verma",
        company: "Infosys",
        photo: "/students/anjali.jpg",
      },
      {
        name: "Aditya Patil",
        company: "Capgemini",
        photo: "/students/aditya.jpg",
      },
      { name: "Neha Singh", company: "Wipro", photo: "/students/neha.jpg" },
    ],
    "pg-dbda-jan-2024": [
      { name: "Nikhil Patil", company: "TCS", photo: "/students/nikhil.jpg" },
      { name: "Sneha Mishra", company: "Wipro", photo: "/students/sneha.jpg" },
      { name: "Ramesh Rao", company: "Infosys", photo: "/students/ramesh.jpg" },
    ],
    // 👉 aur bhi batches add kar sakta hai future mai
  };

  const students = data[slug] || []; // agar nahi mila to khali array

  return Response.json({ students });
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
