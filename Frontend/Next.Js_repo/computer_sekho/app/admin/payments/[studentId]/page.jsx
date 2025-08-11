'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, History, ArrowLeft } from 'lucide-react';
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
        
        // Fetch student details
        const token = sessionStorage.getItem('token');
        const studentResponse = await fetch(getApiUrl(API_CONFIG.ENDPOINTS.STUDENTS), {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const studentData = await studentResponse.json();
        
        const toUiStudent = (s) => ({
          id: s.id ?? s.studentId ?? s.student_id,
          name: s.name ?? s.studentName,
          email: s.email ?? s.studentEmail,
          phone: s.phone ?? s.studentMobile,
          course: s.course ?? s.courseName ?? (s.courseId ? `Course ${s.courseId}` : ''),
          batch: s.batch ?? s.batchName ?? (s.batchId ? `Batch ${s.batchId}` : ''),
          totalFees: s.totalFees ?? s.courseFee ?? 0,
          pendingFees: s.pendingFees ?? (s.courseFee ?? 0),
          courseId: s.courseId,
          batchId: s.batchId,
        });

        let students = [];
        if (Array.isArray(studentData)) {
          students = studentData.map(toUiStudent);
        } else if (studentData.success && studentData.data) {
          students = studentData.data.map(toUiStudent);
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
        <CardHeader>
          <CardTitle>Payment History</CardTitle>
        </CardHeader>
        <CardContent>
          {paymentHistory.length === 0 ? (
            <p className="text-center text-gray-500 py-4">No payment history found.</p>
          ) : (
            <div className="space-y-2">
              {paymentHistory.map((receipt) => (
                <div key={receipt.receiptId} className="flex justify-between items-center p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">Receipt #{receipt.receiptNumber || receipt.receiptId}</p>
                    <p className="text-sm text-gray-600">
                      {receipt.receiptDate ? new Date(receipt.receiptDate).toLocaleDateString() : 
                       receipt.createdDate ? new Date(receipt.createdDate).toLocaleDateString() : 'N/A'}
                    </p>
                  </div>
                  <p className="font-semibold text-green-600">
                    {receipt.receiptAmount ? formatCurrency(receipt.receiptAmount) : 'N/A'}
                  </p>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default StudentPaymentDashboard;
