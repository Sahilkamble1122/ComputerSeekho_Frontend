//backend se mujhe aaisa data chiye jo mujhe frontend pe dikhana hai
// yeh data mujhe placements ke liye chahiye

export async function GET() {
  return Response.json([
    {
      course: "PG DBDA",
      batch: "Aug 2024",
      slug: "pg-dbda-aug-2024",
      logo: "/logos/dbda-aug-2024.png",
      totalStudents: 40,
      placedStudents: 36,
    },
    {
      course: "PG DBDA",
      batch: "Jan 2024",
      slug: "pg-dbda-jan-2024",
      logo: "/logos/dbda-jan-2024.png",
      totalStudents: 50,
      placedStudents: 45,
    },
    {
      course: "PG DAC",
      batch: "Feb 2023",
      slug: "pg-dac-feb-2023",
      logo: "/logos/dac-feb-2023.png",
      totalStudents: 60,
      placedStudents: 51,
    },
  ]);
}



/* 
===========================================================
✅ FUTURE: Replace above with DB fetch once backend ready
===========================================================

// import { db } from "@/lib/db"; // <-- your DB connection here

export async function GET() {
  const batches = await db.placement.findMany({
    include: {
      students: true // assuming students table is linked to batch
    }
  });

  const formatted = batches.map(batch => {
    const total = batch.students.length;
    const placed = batch.students.filter(s => s.placed === true).length;

    return {
      course: batch.course,            // "PG DBDA"
      batch: batch.batchMonthYear,     // "Aug 2024"
      logo: batch.logoUrl,             // "/logos/dbda-aug-2024.png"
      slug: batch.slug,                // "pg-dbda-aug-2024"
      totalStudents: total,
      placedStudents: placed,
    };
  });

  return Response.json(formatted);
}
*/
