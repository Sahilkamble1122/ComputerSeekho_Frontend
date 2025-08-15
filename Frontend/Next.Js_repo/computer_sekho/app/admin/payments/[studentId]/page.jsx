'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, History, ArrowLeft, Printer } from 'lucide-react';
import { toast } from 'sonner';
import { getApiUrl, API_CONFIG } from '@/lib/config';

const StudentPaymentDashboard = () => {
  const params = useParams();
  const studentId = params.studentId;
  
  const [student, setStudent] = useState(null);
  const [paymentHistory, setPaymentHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStudentData = async () => {
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
        
        // Process courses data
        let coursesArr = [];
        if (Array.isArray(coursesData)) {
          coursesArr = coursesData;
        } else if (coursesData.success && Array.isArray(coursesData.data)) {
          coursesArr = coursesData.data;
        }

        // Process batches data
        let batchesArr = [];
        if (Array.isArray(batchesData)) {
          batchesArr = batchesData;
        } else if (batchesData.success && Array.isArray(batchesData.data)) {
          batchesArr = batchesData.data;
        }
        
        // Normalize students data and match with courses/batches
        const toUiStudent = (s) => {
          // Find course name by ID - handle both string and number IDs
          const course = coursesArr.find(c => 
            c.id === s.courseId || 
            c.courseId === s.courseId || 
            c.id === parseInt(s.courseId) || 
            c.courseId === parseInt(s.courseId)
          );
          const courseName = course ? (course.name || course.courseName) : (s.course || s.courseName || `Course ${s.courseId}`);

          // Find batch name by ID - handle both string and number IDs
          const batch = batchesArr.find(b => 
            b.id === s.batchId || 
            b.batchId === s.batchId || 
            b.id === parseInt(s.batchId) || 
            b.batchId === parseInt(s.batchId)
          );
          const batchName = batch ? (batch.name || batch.batchName) : (s.batch || s.batchName || `Batch ${s.batchId}`);

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

        let students = [];
        if (Array.isArray(studentsData)) {
          students = studentsData.map(toUiStudent);
        } else if (studentsData.success && studentsData.data) {
          students = studentsData.data.map(toUiStudent);
        }
        
        const foundStudent = students.find(s => String(s.id) === String(studentId));
        if (foundStudent) {
          setStudent(foundStudent);
        } else {
          toast.error('Student not found');
        }
        
        // Fetch receipts using local API route that filters by studentId
        const receiptsResponse = await fetch(`/api/payments/history?studentId=${studentId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (receiptsResponse.ok) {
          const receiptsData = await receiptsResponse.json();
          // Handle the response format from our local API
          const receipts = receiptsData.success && receiptsData.data ? receiptsData.data : [];
          setPaymentHistory(receipts);
        } else {
          console.error('Failed to fetch receipts');
          setPaymentHistory([]);
        }
        
      } catch (error) {
        console.error('Error fetching student data:', error);
        toast.error('Error loading student data');
      } finally {
        setLoading(false);
      }
    };

    if (studentId) {
      fetchStudentData();
    }
  }, [studentId]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  };

  const generateReceipt = () => {
    if (!student || paymentHistory.length === 0) {
      toast.error('No payment data available to generate receipt');
      return;
    }

    // Calculate totals
    const totalPaid = paymentHistory.reduce((sum, receipt) => {
      return sum + (receipt.receiptAmount || 0);
    }, 0);
    const remainingAmount = student.totalFees - totalPaid;

    // Get initial payment amount (first payment during registration)
    const initialPayment = paymentHistory.find(receipt => receipt.isInitialPayment) || paymentHistory[0];
    const initialPaymentAmount = initialPayment ? (initialPayment.receiptAmount || 0) : 0;

    // Create receipt content
    const receiptContent = `
COMPUTER SEEKHO - PAYMENT RECEIPT
=====================================

STUDENT INFORMATION:
Name: ${student.name}
Email: ${student.email}
Phone: ${student.phone}
Course: ${student.course}
Batch: ${student.batch}
Student ID: ${student.id}

FEE SUMMARY:
Total Course Fees: ${formatCurrency(student.totalFees)}
Initial Payment (Registration): ${formatCurrency(initialPaymentAmount)}
Subsequent Payments: ${formatCurrency(totalPaid - initialPaymentAmount)}
Total Amount Paid: ${formatCurrency(totalPaid)}
Remaining Amount: ${formatCurrency(remainingAmount)}

PAYMENT HISTORY:
${paymentHistory.map((receipt, index) => {
  const isInitial = receipt.isInitialPayment || index === 0;
  const paymentType = isInitial ? 'Initial Payment (Registration)' : 'Regular Payment';
  const receiptNumber = receipt.isReceipt ? 
    `Receipt #${receipt.receiptNumber || receipt.receiptId}` : 
    `Payment #${receipt.receiptNumber || receipt.receiptId}`;
  
  return `
${index + 1}. ${paymentType}
    ${receiptNumber}
    Date: ${receipt.receiptDate ? new Date(receipt.receiptDate).toLocaleDateString() : 
           receipt.createdDate ? new Date(receipt.createdDate).toLocaleDateString() : 
           receipt.paymentDate ? new Date(receipt.paymentDate).toLocaleDateString() : 'N/A'}
    Amount: ${formatCurrency(receipt.receiptAmount || 0)}
    Payment Type: ${receipt.paymentDetails?.paymentTypeDesc || 'N/A'}
`;
}).join('')}

Generated on: ${new Date().toLocaleString()}
=====================================
    `.trim();

    // Create and download the file
    const blob = new Blob([receiptContent], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Payment_Receipt_${student.name}_${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
    
    toast.success('Receipt downloaded successfully');
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex justify-center items-center h-64">
          <p className="text-lg">Loading...</p>
        </div>
      </div>
    );
  }

  if (!student) {
    return (
      <div className="p-6">
        <div className="text-center">
          <p className="text-lg text-red-600">Student not found</p>
          <Button asChild className="mt-4">
            <Link href="/admin/payments">
              <ArrowLeft size={16} className="mr-2" />
              Back to Payments
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-4">
        <Button asChild variant="outline">
          <Link href="/admin/payments">
            <ArrowLeft size={16} className="mr-2" />
            Back
          </Link>
        </Button>
        <h2 className="text-2xl font-bold">{student.name} - Payment Dashboard</h2>
      </div>

      {/* Student Information */}
      <Card>
        <CardHeader>
          <CardTitle>Student Information</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p><strong>Name:</strong> {student.name}</p>
            <p><strong>Email:</strong> {student.email}</p>
            <p><strong>Phone:</strong> {student.phone}</p>
          </div>
          <div>
            <p><strong>Course:</strong> {student.course}</p>
            <p><strong>Batch:</strong> {student.batch}</p>
            <p><strong>Total Fees:</strong> {formatCurrency(student.totalFees)}</p>
          </div>
        </CardContent>
      </Card>

      {/* Fee Status */}
      <Card>
        <CardHeader>
          <CardTitle>Fee Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">Total Fees</p>
              <p className="text-2xl font-bold">{formatCurrency(student.totalFees)}</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">Paid Amount</p>
              <p className="text-2xl font-bold text-green-600">
                {formatCurrency(student.totalFees - student.pendingFees)}
              </p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">Pending Fees</p>
              <p className={`text-2xl font-bold ${student.pendingFees > 0 ? 'text-red-600' : 'text-green-600'}`}>
                {formatCurrency(student.pendingFees)}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex gap-4">
        {student.pendingFees > 0 && (
          <Button asChild>
            <Link href={`/admin/payments/${studentId}/new-payment`}>
              <Plus size={16} className="mr-2" />
              Make Payment
            </Link>
          </Button>
        )}

      </div>

      {/* Payment History */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Payment History</CardTitle>
          <Button 
            onClick={generateReceipt}
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
          >
            <Printer size={16} />
            Print Receipt
          </Button>
        </CardHeader>
        <CardContent>
          {paymentHistory.length === 0 ? (
            <p className="text-center text-gray-500 py-4">No payment history found.</p>
          ) : (
            <div className="space-y-2">
              {paymentHistory.map((receipt, index) => {
                const isInitial = receipt.isInitialPayment || index === 0;
                const paymentType = receipt.paymentDetails?.paymentTypeDesc || 'N/A';
                const receiptNumber = receipt.isReceipt ? 
                  `Receipt #${receipt.receiptNumber || receipt.receiptId}` : 
                  `Payment #${receipt.receiptNumber || receipt.receiptId}`;
                
                return (
                  <div key={receipt.receiptId} className="flex justify-between items-center p-3 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="font-medium">{receiptNumber}</p>
                        {isInitial && (
                          <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                            Initial Payment
                          </span>
                        )}
                        {!receipt.isReceipt && (
                          <span className="px-2 py-1 text-xs bg-orange-100 text-orange-800 rounded-full">
                            Direct Payment
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600">
                        {receipt.receiptDate ? new Date(receipt.receiptDate).toLocaleDateString() : 
                         receipt.createdDate ? new Date(receipt.createdDate).toLocaleDateString() : 
                         receipt.paymentDate ? new Date(receipt.paymentDate).toLocaleDateString() : 'N/A'}
                      </p>
                      <p className="text-xs text-gray-500">
                        Payment Type: {paymentType}
                      </p>
                    </div>
                    <p className="font-semibold text-green-600">
                      {receipt.receiptAmount ? formatCurrency(receipt.receiptAmount) : 'N/A'}
                    </p>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default StudentPaymentDashboard;
