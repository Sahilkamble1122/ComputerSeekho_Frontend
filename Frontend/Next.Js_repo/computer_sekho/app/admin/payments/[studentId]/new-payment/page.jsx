'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import { getApiUrl, API_CONFIG } from '@/lib/config';

const NewPaymentPage = () => {
  const params = useParams();
  const router = useRouter();
  const studentId = params.studentId;
  
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [form, setForm] = useState({
    amount: '',
    paymentTypeId: '',
    paymentDate: new Date().toISOString().split('T')[0]
  });
  const [paymentTypes, setPaymentTypes] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch student
        const token = localStorage.getItem('token');
        const studentResponse = await fetch(getApiUrl(API_CONFIG.ENDPOINTS.STUDENTS), {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const studentData = await studentResponse.json();
        
        let students = [];
        if (Array.isArray(studentData)) {
          students = studentData;
        } else if (studentData.success && studentData.data) {
          students = studentData.data;
        }
        
        const foundStudent = students.find(s => s.id == studentId);
        if (foundStudent) {
          setStudent(foundStudent);
        } else {
          toast.error('Student not found');
          router.push('/admin/payments');
        }
        
        // Fetch payment types
        const typesResponse = await fetch(getApiUrl(API_CONFIG.ENDPOINTS.PAYMENT_TYPES), {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const typesData = await typesResponse.json();
        
        let types = [];
        if (Array.isArray(typesData)) {
          types = typesData;
        } else if (typesData.success && typesData.data) {
          types = typesData.data;
        }
        setPaymentTypes(types);
        
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error('Error loading data');
      } finally {
        setLoading(false);
      }
    };

    if (studentId) {
      fetchData();
    }
  }, [studentId, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!form.amount || !form.paymentTypeId) {
      toast.error('Please fill all required fields');
      return;
    }

    const amount = parseFloat(form.amount);
    if (amount > student.pendingFees) {
      toast.error('Payment amount cannot exceed pending fees');
      return;
    }

    try {
      setProcessing(true);
      
      // Get token from localStorage
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Authentication required. Please login again.');
        return;
      }

      const response = await fetch('/api/payments/process', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          studentId: student.id,
          paymentTypeId: parseInt(form.paymentTypeId),
          paymentDate: form.paymentDate,
          courseId: student.courseId,
          batchId: student.batchId,
          amount: amount,
          status: 'Successful'
        }),
      });

      const result = await response.json();

      if (result.success) {
        toast.success('Payment processed successfully!');
        // Update the student's pending fees in the UI
        setStudent(prev => ({
          ...prev,
          pendingFees: result.newPendingFees
        }));
        router.push(`/admin/payments/${studentId}`);
      } else {
        toast.error(result.error || 'Failed to process payment');
      }
    } catch (error) {
      console.error('Error processing payment:', error);
      toast.error('Error processing payment. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

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
    return null;
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
        <h2 className="text-2xl font-bold">New Payment - {student.name}</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Student Information */}
        <Card>
          <CardHeader>
            <CardTitle>Student Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <p><strong>Name:</strong> {student.name}</p>
              <p><strong>Email:</strong> {student.email}</p>
              <p><strong>Course:</strong> {student.course}</p>
              <p><strong>Batch:</strong> {student.batch}</p>
            </div>
            <div className="pt-4 border-t">
              <p><strong>Total Fees:</strong> {formatCurrency(student.totalFees)}</p>
              <p><strong>Paid Amount:</strong> {formatCurrency(student.totalFees - student.pendingFees)}</p>
              <p className="text-lg font-semibold">
                <strong>Pending Fees:</strong> 
                <span className={`ml-2 ${student.pendingFees > 0 ? 'text-red-600' : 'text-green-600'}`}>
                  {formatCurrency(student.pendingFees)}
                </span>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Payment Form */}
        <Card>
          <CardHeader>
            <CardTitle>Payment Details</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Payment Amount *
                </label>
                <Input
                  type="number"
                  placeholder="Enter amount"
                  value={form.amount}
                  onChange={(e) => setForm(prev => ({ ...prev, amount: e.target.value }))}
                  max={student.pendingFees}
                  min="0"
                  step="0.01"
                  required
                />
                <p className="text-sm text-gray-500 mt-1">
                  Maximum amount: {formatCurrency(student.pendingFees)}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Payment Type *
                </label>
                <Select
                  value={form.paymentTypeId}
                  onValueChange={(value) => setForm(prev => ({ ...prev, paymentTypeId: value }))}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select payment type" />
                  </SelectTrigger>
                  <SelectContent>
                    {paymentTypes.map((type) => (
                      <SelectItem key={type.paymentTypeId} value={type.paymentTypeId.toString()}>
                        {type.paymentTypeDesc || `Payment Type ${type.paymentTypeId}`}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Payment Date
                </label>
                <Input
                  type="date"
                  value={form.paymentDate}
                  onChange={(e) => setForm(prev => ({ ...prev, paymentDate: e.target.value }))}
                />
              </div>

              <div className="pt-4">
                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={processing || student.pendingFees === 0}
                >
                  {processing ? 'Processing...' : 'Process Payment'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default NewPaymentPage;
