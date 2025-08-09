'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import { getApiUrl, API_CONFIG } from '@/lib/config';

const PaymentHistoryPage = () => {
  const params = useParams();
  const studentId = params.studentId;
  
  const [student, setStudent] = useState(null);
  const [paymentHistory, setPaymentHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
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
        
        // Fetch payment history using our new API route
        
        const historyResponse = await fetch(`/api/payments/history?studentId=${studentId}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (historyResponse.ok) {
          const result = await historyResponse.json();
          setPaymentHistory(result.data || []);
        } else {
          console.error('Failed to fetch payment history');
          setPaymentHistory([]);
        }
        
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error('Error loading payment history');
      } finally {
        setLoading(false);
      }
    };

    if (studentId) {
      fetchData();
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
          <Link href={`/admin/payments/${studentId}`}>
            <ArrowLeft size={16} className="mr-2" />
            Back
          </Link>
        </Button>
        <h2 className="text-2xl font-bold">Payment History - {student.name}</h2>
      </div>

      {/* Student Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Student Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">Total Fees</p>
              <p className="text-2xl font-bold">{formatCurrency(student.totalFees)}</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">Total Paid</p>
              <p className="text-2xl font-bold text-green-600">
                {formatCurrency(student.totalFees - student.pendingFees)}
              </p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">Pending Amount</p>
              <p className={`text-2xl font-bold ${student.pendingFees > 0 ? 'text-red-600' : 'text-green-600'}`}>
                {formatCurrency(student.pendingFees)}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payment History Table */}
      <Card>
        <CardHeader>
          <CardTitle>Payment History</CardTitle>
        </CardHeader>
        <CardContent>
          {paymentHistory.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 text-lg">No payment history found for this student.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border">
                                 <thead>
                   <tr className="bg-gray-100 text-left">
                     <th className="p-2 border">Receipt ID</th>
                     <th className="p-2 border">Receipt Number</th>
                     <th className="p-2 border">Receipt Date</th>
                     <th className="p-2 border">Amount</th>
                     <th className="p-2 border">Payment ID</th>
                     <th className="p-2 border">Created Date</th>
                   </tr>
                 </thead>
                 <tbody>
                   {paymentHistory.map((receipt) => (
                     <tr key={receipt.receiptId} className="border-t">
                       <td className="p-2 border font-medium">{receipt.receiptId}</td>
                       <td className="p-2 border">{receipt.receiptNumber || 'N/A'}</td>
                       <td className="p-2 border">
                         {receipt.receiptDate ? new Date(receipt.receiptDate).toLocaleDateString() : 'N/A'}
                       </td>
                       <td className="p-2 border font-semibold text-green-600">
                         {receipt.receiptAmount ? formatCurrency(receipt.receiptAmount) : 'N/A'}
                       </td>
                       <td className="p-2 border">{receipt.paymentId || 'N/A'}</td>
                       <td className="p-2 border">
                         {new Date(receipt.createdDate).toLocaleDateString()}
                       </td>
                     </tr>
                   ))}
                 </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Summary Statistics */}
      {paymentHistory.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Payment Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                             <div>
                 <h4 className="font-semibold mb-2">Receipt Summary</h4>
                 <div className="space-y-1">
                   <p className="text-sm">Total Receipts: {paymentHistory.length}</p>
                   <p className="text-sm">
                     Total Amount: {formatCurrency(
                       paymentHistory.reduce((sum, receipt) => 
                         sum + (receipt.receiptAmount || 0), 0
                       )
                     )}
                   </p>
                 </div>
               </div>
               <div>
                 <h4 className="font-semibold mb-2">Timeline</h4>
                 <p className="text-sm">
                   First Receipt: {new Date(Math.min(...paymentHistory.map(r => new Date(r.createdDate)))).toLocaleDateString()}
                 </p>
                 <p className="text-sm">
                   Last Receipt: {new Date(Math.max(...paymentHistory.map(r => new Date(r.createdDate)))).toLocaleDateString()}
                 </p>
                 <p className="text-sm">
                   Total Receipts: {paymentHistory.length}
                 </p>
               </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default PaymentHistoryPage;
