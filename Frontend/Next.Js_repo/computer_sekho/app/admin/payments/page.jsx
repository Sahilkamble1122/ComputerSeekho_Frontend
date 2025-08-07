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
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        setLoading(true);
        const response = await fetch(getApiUrl(API_CONFIG.ENDPOINTS.STUDENTS));
        const data = await response.json();
        
        // Handle array response directly
        if (Array.isArray(data)) {
          setStudents(data);
        } else if (data.success && data.data) {
          setStudents(data.data);
        } else {
          setStudents([]);
          toast.error('Failed to fetch students');
        }
      } catch (error) {
        console.error('Error fetching students:', error);
        toast.error('Error loading students');
        setStudents([]);
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

  const filteredStudents = students.filter(student =>
    student.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.course?.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
              ) : filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan="8" className="text-center p-4">
                    No students found.
                  </td>
                </tr>
              ) : (
                filteredStudents.map((student) => (
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
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentsPage;
