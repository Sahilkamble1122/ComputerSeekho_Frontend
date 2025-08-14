'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Pencil, Trash } from 'lucide-react';
import { toast } from 'sonner';

const ManageStaffPage = () => {
  const [staffList, setStaffList] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch all staff records
  useEffect(() => {
    const fetchStaff = async () => {
      try {
        const token = sessionStorage.getItem('token');
        const res = await fetch('http://localhost:8080/api/staff', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }); // <-- Replace with actual API endpoint
        if (!res.ok) throw new Error('Failed to fetch');
        const data = await res.json();
        setStaffList(data);
      } catch (error) {
        toast.error('Failed to load staff data');
      } finally {
        setLoading(false);
      }
    };

    fetchStaff();
  }, []);

  // Delete staff member
  const handleDelete = async (id) => {
    const confirm = window.confirm('Are you sure you want to delete this staff member?');
    if (!confirm) return;

    try {
      const token = sessionStorage.getItem('token');
      const res = await fetch(`http://localhost:8080/api/staff/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!res.ok) throw new Error('Delete failed');

      setStaffList((prev) => prev.filter((staff) => staff.staffId !== id));
      toast.success('Staff deleted successfully');
    } catch (error) {
      toast.error('Failed to delete staff');
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Manage Staff</h1>
        <Button asChild>
          <Link href="/admin/staffs/addstaff">+ Add Staff</Link>
        </Button>
      </div>

      {loading ? (
        <p>Loading staff...</p>
      ) : staffList.length === 0 ? (
        <p>No staff found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white shadow-md rounded">
            <thead className="bg-gray-100">
              <tr>
                <th className="text-left px-4 py-2">Name</th>
                <th className="text-left px-4 py-2">Role</th>
                <th className="text-left px-4 py-2">Mobile</th>
                <th className="text-left px-4 py-2">Email</th>
                <th className="text-left px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {staffList.map((staff) => (
                <tr key={staff.staffId} className="border-t">
                  <td className="px-4 py-2">{staff.staffName}</td>
                  <td className="px-4 py-2">{staff.staffRole}</td>
                  <td className="px-4 py-2">{staff.staffMobile}</td>
                  <td className="px-4 py-2">{staff.staffEmail}</td>
                  <td className="px-4 py-2 flex gap-2">
                    <Button asChild variant="outline" size="sm">
                      <Link href={`/admin/staffs/${staff.staffId}`}><Pencil size={16} /></Link>
                    </Button>
                    <Button variant="destructive" size="sm" onClick={() => handleDelete(staff.staffId)}>
                      <Trash size={16} />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ManageStaffPage;
