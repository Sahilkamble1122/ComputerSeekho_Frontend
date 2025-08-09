'use client'

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

export default function EditStaff() {
  const { staffId } = useParams();
  const router = useRouter();

  const [staff, setStaff] = useState({
    staff_name: '',
    photo_url: '',
    staff_mobile: '',
    staff_email: '',
    staff_username: '',
    staff_password: '',
    staff_role: '',
  });

  // Fetch existing staff data
  useEffect(() => {
    const fetchStaff = async () => {
      try {
        const token = sessionStorage.getItem('token');
        const res = await fetch(`/api/staff/${staffId}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        }); // 🔁 Replace with your API endpoint
        const data = await res.json();
        if (!res.ok) throw new Error(data.message);
        setStaff(data);
      } catch (error) {
        toast.error('Failed to fetch staff details');
      }
    };

    if (staffId) fetchStaff();
  }, [staffId]);

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = sessionStorage.getItem('token');
      const res = await fetch(`/api/staff/${staffId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(staff),
      });

      if (!res.ok) throw new Error('Update failed');
      toast.success('Staff updated successfully');
      router.push('/admin/staff');
    } catch (error) {
      toast.error('Error updating staff');
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10 bg-white shadow-md p-6 rounded-md">
      <h2 className="text-xl font-semibold mb-6">Edit Staff</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label>Name</Label>
          <Input
            value={staff.staff_name}
            onChange={(e) => setStaff({ ...staff, staff_name: e.target.value })}
            required
          />
        </div>

        <div>
          <Label>Mobile</Label>
          <Input
            value={staff.staff_mobile}
            onChange={(e) => setStaff({ ...staff, staff_mobile: e.target.value })}
            required
          />
        </div>

        <div>
          <Label>Email</Label>
          <Input
            value={staff.staff_email}
            onChange={(e) => setStaff({ ...staff, staff_email: e.target.value })}
            required
          />
        </div>

        <div>
          <Label>Username</Label>
          <Input
            value={staff.staff_username}
            onChange={(e) => setStaff({ ...staff, staff_username: e.target.value })}
            required
          />
        </div>

        <div>
          <Label>Password</Label>
          <Input
            type="password"
            value={staff.staff_password}
            onChange={(e) => setStaff({ ...staff, staff_password: e.target.value })}
            required
          />
        </div>

        <div>
          <Label>Photo URL</Label>
          <Input
            value={staff.photo_url}
            onChange={(e) => setStaff({ ...staff, photo_url: e.target.value })}
          />
        </div>

        <div>
          <Label>Role</Label>
          <Input
            value={staff.staff_role}
            onChange={(e) => setStaff({ ...staff, staff_role: e.target.value })}
            placeholder="e.g., Teaching / Non-teaching / Housekeeping"
            required
          />
        </div>

        <Button type="submit" className="w-full">
          Update Staff
        </Button>
      </form>
    </div>
  );
}
