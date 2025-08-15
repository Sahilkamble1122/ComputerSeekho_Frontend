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
  const [courses, setCourses] = useState([]);
  const [batches, setBatches] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch student
        const token = sessionStorage.getItem('token');
        const studentResponse = await fetch(getApiUrl(API_CONFIG.ENDPOINTS.STUDENTS), {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const studentData = await studentResponse.json();
        
        // Fetch courses
        let coursesList = [];
        try {
          const coursesResponse = await fetch(getApiUrl(API_CONFIG.ENDPOINTS.COURSES), {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          const coursesData = await coursesResponse.json();
          
          if (Array.isArray(coursesData)) {
            coursesList = coursesData;
          } else if (coursesData.success && coursesData.data) {
            coursesList = coursesData.data;
          }
          
          setCourses(coursesList);
        } catch (error) {
          console.warn('Error fetching courses:', error);
          // Fallback course mapping if API fails
          const fallbackCourses = [
            { courseId: 101, courseName: "PG DBDA" },
            { courseId: 98, courseName: "PG DAC" },
            { courseId: 103, courseName: "PRE - CAT" }
          ];
          coursesList = fallbackCourses;
          setCourses(fallbackCourses);
        }
        
        // Fetch batches
        let batchesList = [];
        try {
          const batchesResponse = await fetch(getApiUrl(API_CONFIG.ENDPOINTS.BATCHES), {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          const batchesData = await batchesResponse.json();
          
          if (Array.isArray(batchesData)) {
            batchesList = batchesData;
          } else if (batchesData.success && batchesData.data) {
            batchesList = batchesData.data;
          }
          
          setBatches(batchesList);
        } catch (error) {
          console.warn('Error fetching batches:', error);
          setBatches([]);
        }
        
        const toUiStudent = (s, coursesList, batchesList) => {
          // Find course name by ID
          const courseObj = coursesList.find(c => c.courseId === s.courseId || c.id === s.courseId);
          const courseName = courseObj ? courseObj.courseName : (s.course ?? s.courseName ?? (s.courseId ? `Course ${s.courseId}` : ''));
          
          // Find batch name by ID
          const batchObj = batchesList.find(b => b.batchId === s.batchId || b.id === s.batchId);
          const batchName = batchObj ? batchObj.batchName : (s.batch ?? s.batchName ?? (s.batchId ? `Batch ${s.batchId}` : ''));
          
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
        if (Array.isArray(studentData)) {
          students = studentData.map(s => toUiStudent(s, coursesList, batchesList));
        } else if (studentData.success && studentData.data) {
          students = studentData.data.map(s => toUiStudent(s, coursesList, batchesList));
        }
        
        const foundStudent = students.find(s => String(s.id) === String(studentId));
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
    if (Number.isNaN(amount) || amount <= 0) {
      toast.error('Enter a valid amount');
      return;
    }

    try {
      setProcessing(true);
      
      // Get token from localStorage
      const token = sessionStorage.getItem('token');
      if (!token) {
        toast.error('Authentication required. Please login again.');
        return;
      }

      // 1) Fetch the latest student for fresh pending fees
      let currentPending = 0;
      try {
        const studentRes = await fetch(`/api/students/${studentId}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!studentRes.ok) {
          const errText = await studentRes.text();
          toast.error(errText || 'Failed to load student');
          return;
        }
        const freshStudent = await studentRes.json();
        currentPending = parseFloat(freshStudent.pendingFees ?? 0);
      } catch (err) {
        toast.error('Network error while fetching student');
        return;
      }
      if (amount > currentPending) {
        toast.error('Payment amount cannot exceed pending fees');
        return;
      }

      // 2) Compute new pending and PATCH it back
      const newPending = Math.max(0, currentPending - amount);
      try {
        const patchRes = await fetch(`/api/students/${studentId}/pending-fees?pendingFees=${encodeURIComponent(newPending)}`, {
          method: 'PATCH',
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!patchRes.ok) {
          const errText = await patchRes.text();
          toast.error(errText || 'Failed to update pending fees');
          return;
        }
      } catch (err) {
        toast.error('Network error while updating pending fees');
        return;
      }

      // 3) Create payment (to obtain paymentId)
      let paymentId = null;
      try {
        const paymentPayload = {
          studentId: student.id,
          paymentTypeId: parseInt(form.paymentTypeId),
          paymentDate: form.paymentDate || new Date().toISOString().split('T')[0],
          courseId: student.courseId,
          batchId: student.batchId,
          amount: amount,
          status: 'Successful'
        };
        const paymentUrl = getApiUrl(API_CONFIG.ENDPOINTS.PROCESS_PAYMENT);
        const payRes = await fetch(paymentUrl, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(paymentPayload)
        });
        if (payRes.ok) {
          const payResult = await payRes.json();
          paymentId = payResult.paymentId || payResult.id || null;
        } else {
          const errText = await payRes.text();
          console.warn('Payment creation failed:', errText);
        }
      } catch (err) {
        console.warn('Network error while creating payment');
      }

      // 4) Create receipt record referencing paymentId and studentId
      try {
        const receiptPayload = {
          receiptAmount: amount,
          receiptDate: form.paymentDate || new Date().toISOString().split('T')[0],
          receiptNumber: `RCP-${Date.now()}-${studentId}`,
          paymentId: paymentId,
          studentId: parseInt(studentId)
        };
        const receiptUrl = getApiUrl(API_CONFIG.ENDPOINTS.PAYMENT_HISTORY);
        const receiptRes = await fetch(receiptUrl, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(receiptPayload)
        });
        if (!receiptRes.ok) {
          console.warn('Receipt creation failed');
        }
      } catch (err) {
        console.warn('Network error while creating receipt');
      }

      toast.success('Payment processed successfully!');
      setStudent(prev => ({ ...prev, pendingFees: newPending }));
      router.push(`/admin/payments/${studentId}`);
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
                    {paymentTypes.map((type) => {
                      // Handle different possible field names from API
                      const id = type.paymentTypeId || type.id || type.paymentType_id;
                      const description = type.paymentTypeDesc || type.description || type.paymentType_desc || `Payment Type ${id}`;
                      
                      return (
                        <SelectItem key={id} value={id.toString()}>
                          {description}
                        </SelectItem>
                      );
                    })}
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
