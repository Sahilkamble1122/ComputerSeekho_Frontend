import { API_CONFIG, getApiUrl } from "@/lib/config";

// Helper function to get student counts for batches
async function getStudentCounts(batchIds) {
  try {
    // TODO: Replace this with your actual student count API
    // For now, returning mock data
    const mockStudentData = {};
    
    batchIds.forEach(batchId => {
      // Generate random student counts for demonstration
      const totalStudents = Math.floor(Math.random() * 50) + 20; // 20-70 students
      const placedStudents = Math.floor(Math.random() * totalStudents * 0.8) + Math.floor(totalStudents * 0.6); // 60-80% placement
      
      mockStudentData[batchId] = {
        totalStudents,
        placedStudents
      };
    });
    
    return mockStudentData;
  } catch (error) {
    console.error("Error fetching student counts:", error);
    return {};
  }
}

export async function GET() {
  try {
    // Fetch batches from Spring Boot backend
    const batchesResponse = await fetch(getApiUrl(API_CONFIG.ENDPOINTS.BATCHES));
    
    if (!batchesResponse.ok) {
      throw new Error(`Failed to fetch batches: ${batchesResponse.status}`);
    }
    
    const batches = await batchesResponse.json();
    
    // Course ID to name mapping based on your data
    const courseMapping = {
      101: "PG DBDA", // Data Science related courses
      98: "PG DAC",   // Computer Applications
      103: "PRE - CAT" // Special course
    };
    
    // Get student counts for all batches
    const batchIds = batches.map(batch => batch.batchId);
    const studentCounts = await getStudentCounts(batchIds);
    
    // Format the batches data for the frontend
    const formattedBatches = batches
      .filter(batch => batch.batchIsActive) // Only show active batches
      .map(batch => {
        const courseName = courseMapping[batch.courseId] || `Course ${batch.courseId}`;
        const studentData = studentCounts[batch.batchId] || { totalStudents: 0, placedStudents: 0 };
        
        return {
          course: courseName,
          batch: batch.batchName,
          slug: `${courseName.toLowerCase().replace(/\s+/g, '-')}-${batch.batchName.toLowerCase().replace(/\s+/g, '-')}`,
          logo: batch.batchLogo || "/batches/default-batch-logo.png",
          totalStudents: studentData.totalStudents,
          placedStudents: studentData.placedStudents,
          courseId: batch.courseId,
          batchId: batch.batchId,
          presentationDate: batch.presentationDate,
          courseFees: batch.courseFees
        };
      })
      .sort((a, b) => new Date(b.presentationDate) - new Date(a.presentationDate)); // Sort by presentation date
    
    return Response.json(formattedBatches);
    
  } catch (error) {
    console.error("Error fetching placement data:", error);
    
    // Fallback to mock data if backend is not available
    return Response.json([
      {
        course: "PG DBDA",
        batch: "Aug 2024",
        slug: "pg-dbda-aug-2024",
        logo: "/batches/default-batch-logo.png",
        totalStudents: 40,
        placedStudents: 36,
      },
      {
        course: "PG DBDA",
        batch: "Jan 2024",
        slug: "pg-dbda-jan-2024",
        logo: "/batches/default-batch-logo.png",
        totalStudents: 50,
        placedStudents: 45,
      },
      {
        course: "PG DAC",
        batch: "Feb 2023",
        slug: "pg-dac-feb-2023",
        logo: "/batches/default-batch-logo.png",
        totalStudents: 60,
        placedStudents: 51,
      },
    ]);
  }
}
