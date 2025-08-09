// app/staff-register/page.jsx
"use client";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";

export default function StaffRegister() {
  const [formData, setFormData] = useState({
    staff_name: "",
    photo_url: "",
    staff_mobile: "",
    staff_email: "",
    staff_username: "",
    staff_password: "",
    staff_role: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const uploadData = new FormData();
    uploadData.append("file", file);

    const res = await fetch("/api/staff/upload", {
      method: "POST",
      body: uploadData,
    });

    const data = await res.json();
    if (res.ok) {
      setFormData((prev) => ({ ...prev, photo_url: data.filePath }));
    } else {
      alert("Photo upload failed");
    }
  };

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
        createdDate: new Date().toISOString(),
        updatedDate: new Date().toISOString(),
      };

      const token = sessionStorage.getItem("token");
      const res = await fetch("http://localhost:8080/api/staff", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        alert("Staff registered successfully.");
        setFormData({
          staff_name: "",
          photo_url: "",
          staff_mobile: "",
          staff_email: "",
          staff_username: "",
          staff_password: "",
          staff_role: "",
        });
      } else {
        alert("Failed to register staff.");
      }
    } catch (error) {
      alert("Something went wrong.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted p-6">
      <Card className="w-full max-w-2xl border shadow-md">
        <CardContent className="p-8">
          <h2 className="text-2xl font-bold text-center mb-4">
            Staff Registration
          </h2>
          <p className="text-sm text-muted-foreground text-center mb-6">
            Fill out the form below to register a new staff member.
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

            <Button type="submit" className="w-full mt-4">
              Register Staff
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

