'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CreditCard, Eye, Plus } from 'lucide-react';
import { toast } from 'sonner';
import { getApiUrl, API_CONFIG } from '@/lib/config';

const PaymentsPage = () => {
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [studentsPerPage] = useState(10);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const token = sessionStorage.getItem('token');
        
        // Fetch students, courses, and batches in parallel
        const [studentsResponse, coursesResponse, batchesResponse] = await Promise.all([
          fetch(getApiUrl(API_CONFIG.ENDPOINTS.STUDENTS), {
            headers: { 'Authorization': `Bearer ${token}` }
          }),
          fetch(`${getApiUrl(API_CONFIG.ENDPOINTS.STUDENTS).replace('/api/students', '/api/courses')}`, {
            headers: { 'Authorization': `Bearer ${token}` }
          }),
          fetch(`${getApiUrl(API_CONFIG.ENDPOINTS.STUDENTS).replace('/api/students', '/api/batches')}`, {
            headers: { 'Authorization': `Bearer ${token}` }
          })
        ]);

        const [studentsData, coursesData, batchesData] = await Promise.all([
          studentsResponse.json(),
          coursesResponse.json(),
          batchesResponse.json()
        ]);
        
        console.log('API Responses:', { studentsData, coursesData, batchesData });
        
        // Process courses data
        let coursesArr = [];
        if (Array.isArray(coursesData)) {
          coursesArr = coursesData;
        } else if (coursesData.success && Array.isArray(coursesData.data)) {
          coursesArr = coursesData.data;
        }
        setCourses(coursesArr);

        // Process batches data
        let batchesArr = [];
        if (Array.isArray(batchesData)) {
          batchesArr = batchesData;
        } else if (batchesData.success && Array.isArray(batchesData.data)) {
          batchesArr = batchesData.data;
        }
        setBatches(batchesArr);
        
        // Normalize students data and match with courses/batches
        const toUiStudent = (s) => {
          // Find course name by ID
          const course = coursesArr.find(c => c.id === s.courseId || c.courseId === s.courseId);
          const courseName = course ? course.name || course.courseName : (s.course || s.courseName || `Course ${s.courseId}`);

          // Find batch name by ID
          const batch = batchesArr.find(b => b.id === s.batchId || b.batchId === s.batchId);
          const batchName = batch ? batch.name || batch.batchName : (s.batch || s.batchName || `Batch ${s.batchId}`);

          return {
            id: s.id ?? s.studentId ?? s.student_id,
            name: s.name ?? s.studentName,
            email: s.email ?? s.studentEmail,
            phone: s.phone ?? s.studentMobile,
            course: courseName,
            batch: batchName,
            totalFees: s.totalFees ?? s.courseFee ?? 0,
            pendingFees: s.pendingFees ?? (s.courseFee ?? 0),
            courseId: s.courseId,
            batchId: s.batchId,
          };
        };

        let studentsArr = [];
        console.log('Raw studentsData:', studentsData);
        console.log('studentsData type:', typeof studentsData);
        console.log('studentsData isArray:', Array.isArray(studentsData));
        
        if (Array.isArray(studentsData)) {
          studentsArr = studentsData.map(toUiStudent);
        } else if (studentsData.success && Array.isArray(studentsData.data)) {
          studentsArr = studentsData.data.map(toUiStudent);
        }
        
        console.log('Processed studentsArr:', studentsArr);

        if (studentsArr.length > 0) {
          console.log('Students array before sorting:', studentsArr);
          
          // Sort students by pending fees in descending order (highest pending fees first)
          const sortedStudents = studentsArr.sort((a, b) => {
            // First priority: students with pending fees > 0
            if (a.pendingFees > 0 && b.pendingFees === 0) return -1;
            if (a.pendingFees === 0 && b.pendingFees > 0) return 1;
            
            // Second priority: among students with pending fees, sort by amount (highest first)
            if (a.pendingFees > 0 && b.pendingFees > 0) {
              return b.pendingFees - a.pendingFees;
            }
            
            // Third priority: among students with no pending fees, sort by name
            // Handle null/undefined names safely
            const nameA = a.name || '';
            const nameB = b.name || '';
            return nameA.localeCompare(nameB);
          });
          
          console.log('Students array after sorting:', sortedStudents);
          setStudents(sortedStudents);
        } else {
          setStudents([]);
          toast.error('No students found');
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error('Error loading data');
        setStudents([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredStudents = students.filter(student =>
    student.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.course?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination logic
  const indexOfLastStudent = currentPage * studentsPerPage;
  const indexOfFirstStudent = indexOfLastStudent - studentsPerPage;
  const currentStudents = filteredStudents.slice(indexOfFirstStudent, indexOfLastStudent);
  const totalPages = Math.ceil(filteredStudents.length / studentsPerPage);

  console.log('Current state:', { 
    students: students.length, 
    filteredStudents: filteredStudents.length, 
    currentStudents: currentStudents.length,
    loading,
    searchTerm 
  });

  // Pagination handlers
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Reset pagination when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Student Payments</h2>
      </div>

      <Input
        type="text"
        placeholder="Search by name, email, or course"
        className="max-w-md"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <Card>
        <CardContent className="overflow-auto p-4">
          <table className="w-full border">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="p-2 border">Student Name</th>
                <th className="p-2 border">Email</th>
                <th className="p-2 border">Phone</th>
                <th className="p-2 border">Course</th>
                <th className="p-2 border">Batch</th>
                <th className="p-2 border">Total Fees</th>
                <th className="p-2 border">Pending Fees</th>
                <th className="p-2 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="8" className="text-center p-4">
                    Loading...
                  </td>
                </tr>
              ) : currentStudents.length === 0 ? (
                <tr>
                  <td colSpan="8" className="text-center p-4">
                    No students found.
                  </td>
                </tr>
              ) : (
                currentStudents.map((student) => (
                  <tr key={student.id} className="border-t">
                    <td className="p-2 border font-medium">{student.name}</td>
                    <td className="p-2 border">{student.email}</td>
                    <td className="p-2 border">{student.phone}</td>
                    <td className="p-2 border">{student.course}</td>
                    <td className="p-2 border">{student.batch}</td>
                    <td className="p-2 border">{formatCurrency(student.totalFees)}</td>
                    <td className="p-2 border">
                      <span className={`font-semibold ${student.pendingFees > 0 ? 'text-red-600' : 'text-green-600'}`}>
                        {formatCurrency(student.pendingFees)}
                      </span>
                    </td>
                    <td className="p-2 border">
                      <div className="flex gap-2">
                        <Button asChild size="sm" variant="outline">
                          <Link href={`/admin/payments/${student.id}`}>
                            <Eye size={16} className="mr-1" />
                            View
                          </Link>
                        </Button>
                        {student.pendingFees > 0 && (
                          <Button asChild size="sm">
                            <Link href={`/admin/payments/${student.id}/new-payment`}>
                              <Plus size={16} className="mr-1" />
                              Pay
                            </Link>
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
          
          {/* Pagination Controls */}
          {!loading && filteredStudents.length > 0 && (
            <div className="flex items-center justify-between mt-4">
              <div className="text-sm text-gray-700">
                Showing {indexOfFirstStudent + 1} to {Math.min(indexOfLastStudent, filteredStudents.length)} of {filteredStudents.length} students
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>
                
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNumber) => (
                  <Button
                    key={pageNumber}
                    variant={currentPage === pageNumber ? "default" : "outline"}
                    size="sm"
                    onClick={() => handlePageChange(pageNumber)}
                    className={currentPage === pageNumber ? "bg-black text-white" : ""}
                  >
                    {pageNumber}
                  </Button>
                ))}
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentsPage;
