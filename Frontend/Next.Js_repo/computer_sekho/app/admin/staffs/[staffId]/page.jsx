'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent } from "@/components/ui/card";
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from 'sonner';

export default function EditStaff() {
  const { staffId } = useParams();
  const router = useRouter();

  const [formData, setFormData] = useState({
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
        const res = await fetch(`http://localhost:8080/api/staff/${staffId}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (!res.ok) throw new Error('Failed to fetch staff details');
        const data = await res.json();
        
        // Map the API response to form data
        setFormData({
          staff_name: data.staffName || '',
          photo_url: data.photoUrl || '',
          staff_mobile: data.staffMobile || '',
          staff_email: data.staffEmail || '',
          staff_username: data.staffUsername || '',
          staff_password: data.staffPassword || '',
          staff_role: data.staffRole || '',
        });
      } catch (error) {
        toast.error('Failed to fetch staff details');
        console.error('Error fetching staff:', error);
      }
    };

    if (staffId) fetchStaff();
  }, [staffId]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const uploadData = new FormData();
    uploadData.append("file", file);

    try {
      const res = await fetch("/api/staff/upload", {
        method: "POST",
        body: uploadData,
      });

      const data = await res.json();
      if (res.ok) {
        setFormData((prev) => ({ ...prev, photo_url: data.filePath }));
        toast.success('Photo uploaded successfully');
      } else {
        toast.error("Photo upload failed");
      }
    } catch (error) {
      toast.error("Photo upload failed");
    }
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const payload = {
        staffName: formData.staff_name,
        photoUrl: formData.photo_url,
        staffMobile: formData.staff_mobile,
        staffEmail: formData.staff_email,
        staffUsername: formData.staff_username,
        staffPassword: formData.staff_password,
        staffRole: formData.staff_role,
        updatedDate: new Date().toISOString(),
      };

      const token = sessionStorage.getItem('token');
      const res = await fetch(`http://localhost:8080/api/staff/${staffId}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json', 
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error('Update failed');
      
      toast.success('Staff updated successfully');
      router.push('/admin/staffs');
    } catch (error) {
      toast.error('Error updating staff');
      console.error('Error updating staff:', error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted p-6">
      <Card className="w-full max-w-2xl border shadow-md">
        <CardContent className="p-8">
          <h2 className="text-2xl font-bold text-center mb-4">
            Edit Staff Member
          </h2>
          <p className="text-sm text-muted-foreground text-center mb-6">
            Update the staff member information below.
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <Label htmlFor="staff_name">Full Name</Label>
              <Input
                id="staff_name"
                name="staff_name"
                placeholder="Enter full name"
                value={formData.staff_name}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <Label htmlFor="photo_url">Upload Photo</Label>
              <Input
                id="photo_url"
                name="photo_url"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
              />
              {formData.photo_url && (
                <img
                  src={formData.photo_url}
                  alt="Preview"
                  className="mt-2 h-20 rounded"
                />
              )}
            </div>

            <div>
              <Label htmlFor="staff_mobile">Mobile Number</Label>
              <Input
                id="staff_mobile"
                name="staff_mobile"
                placeholder="Enter mobile number"
                type="tel"
                value={formData.staff_mobile}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <Label htmlFor="staff_email">Email Address</Label>
              <Input
                id="staff_email"
                name="staff_email"
                placeholder="Enter email"
                type="email"
                value={formData.staff_email}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <Label htmlFor="staff_username">Username</Label>
              <Input
                id="staff_username"
                name="staff_username"
                placeholder="Enter username"
                value={formData.staff_username}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <Label htmlFor="staff_password">Password</Label>
              <Input
                id="staff_password"
                name="staff_password"
                placeholder="Enter password"
                type="password"
                value={formData.staff_password}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <Label htmlFor="staff_role">Role</Label>
              <Select
                value={formData.staff_role}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, staff_role: value }))
                }
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Teaching">Teaching</SelectItem>
                  <SelectItem value="NonTeaching">Non Teaching</SelectItem>
                  <SelectItem value="HouseKeeping">House Keeping</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex gap-4">
              <Button 
                type="button" 
                variant="outline" 
                className="flex-1"
                onClick={() => router.push('/admin/staffs')}
              >
                Cancel
              </Button>
              <Button type="submit" className="flex-1">
                Update Staff
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
