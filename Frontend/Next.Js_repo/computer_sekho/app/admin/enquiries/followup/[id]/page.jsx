'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import Link from 'next/link';
import { toast } from 'sonner';

export default function FollowUpEditPage() {
  const { id } = useParams();
  const router = useRouter();
  const [formData, setFormData] = useState({ followupDate: '', followupMsg: '' });
  const [enquiry, setEnquiry] = useState(null);
  const [currentStaffId, setCurrentStaffId] = useState(null);

  useEffect(() => {
    if (!id) return;
    fetchEnquiryDetails();
    getCurrentStaffId();
  }, [id]);

  const getCurrentStaffId = async () => {
    try {
      const token = sessionStorage.getItem('token');
      const adminName = sessionStorage.getItem('admin');
      
      if (!token || !adminName) {
        console.warn('Token or admin name not found');
        return;
      }

      const res = await fetch('http://localhost:8080/api/staff', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!res.ok) {
        console.error('Failed to fetch staff list');
        return;
      }
      
      const staffList = await res.json();
      const staff = staffList.find(s => s.staffName === adminName);
      
      if (staff) {
        setCurrentStaffId(staff.staffId);
        console.log('Found staff ID:', staff.staffId, 'for admin:', adminName);
      } else {
        console.warn('Staff not found for admin:', adminName);
      }
    } catch (error) {
      console.error('Error fetching staff ID:', error);
    }
  };

  const fetchEnquiryDetails = async () => {
    try {
      const token = sessionStorage.getItem('token');
      const res = await fetch(`http://localhost:8080/api/enquiries/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!res.ok) throw new Error('Failed to fetch enquiry');
      const data = await res.json();
      setEnquiry(data);

      if (data.enquiryCounter >= 3) {
        toast.info('Follow-up limit reached. Redirecting to closure.');
        router.push(`/admin/enquiries/closure/${id}`);
      }
    } catch (err) {
      console.error(err);
      toast.error('Error loading enquiry');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!currentStaffId) {
      toast.error('Staff ID not found. Please refresh the page and try again.');
      return;
    }

    try {
      const token = sessionStorage.getItem('token');
      const res = await fetch(`http://localhost:8080/api/followups?enquiry_id=${id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({
          ...formData,
          enquiryId: id,
          staffId: currentStaffId, // Use the actual staff ID
        }),
      });

      if (!res.ok) {throw new Error('Failed to submit follow-up');}

      const token2 = sessionStorage.getItem('token');
      const enquiryRes = await fetch(`http://localhost:8080/api/enquiries/${id}`, {
        headers: { 'Authorization': `Bearer ${token2}` }
      });
const enquiry = await enquiryRes.json();
const newValue = enquiry.enquiryCounter + 1;

      const updateRes = await fetch(
  `http://localhost:8080/api/enquiries/${id}/counter?enquiryCounter=${newValue}`,
  {
    method: 'PATCH',
    headers: { 'Authorization': `Bearer ${token}` }
  }
);

      if (!updateRes.ok) throw new Error('Failed to increment counter');

      toast.success('Follow-up added and counter updated');
      router.push(`/admin/enquiries/${id}`);
    } catch (err) {
      toast.error('Failed to add follow-up');
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen p-6 max-w-3xl mx-auto">
      <div className="mb-4">
        <Link href={`/admin/enquiries/${id}`} className="text-blue-600 hover:underline">← Back to Enquiry</Link>
      </div>

      {enquiry && (
        <Card className="mb-6">
          <CardContent className="p-4 space-y-1">
            <div><strong>Name:</strong> {enquiry.enquirerName}</div>
            <div><strong>Mobile:</strong> {enquiry.enquirerMobile}</div>
            <div><strong>Email:</strong> {enquiry.enquirerEmailId}</div>
            <div><strong>Query:</strong> {enquiry.enquirerQuery}</div>
            <div><strong>Follow-up Count:</strong> {enquiry.enquiryCounter}</div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardContent className="p-6 space-y-4">
          <h2 className="text-xl font-bold mb-2">Add Follow-up</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="followupDate">Follow-up Date</Label>
              <Input
                type="date"
                name="followupDate"
                value={formData.followupDate}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="followupMsg">Comment</Label>
              <Textarea
                name="followupMsg"
                placeholder="Write comment here"
                value={formData.followupMsg}
                onChange={handleChange}
                required
              />
            </div>
            <Button type="submit">Submit Follow-up</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
