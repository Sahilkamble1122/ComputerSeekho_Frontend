"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function EnquiryForm() {
  const [currentAdmin, setCurrentAdmin] = useState("");
  const [courses, setCourses] = useState([]);
  const [staffList, setStaffList] = useState([]);
  const [assignedStaffId, setAssignedStaffId] = useState(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
    trigger,
    setError,
    clearErrors,
  } = useForm({
    defaultValues: {
      name: "",
      student_name: "",
      email: "",
      mobile: "",
      alt_mobile: "",
      address: "",
      query: "",
      courseId: "",
      date: new Date().toISOString().split('T')[0],
      followUpDate: (() => {
        const followUpDate = new Date();
        followUpDate.setDate(followUpDate.getDate() + 3);
        return followUpDate.toISOString().split('T')[0];
      })(),
      staff: "",
    }
  });

  // Watch the courseId field for validation
  const selectedCourseId = watch("courseId");

  // Fetch courses and staff data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = sessionStorage.getItem("token");
        
        // Fetch courses
        const coursesResponse = await fetch("http://localhost:8080/api/courses", {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (coursesResponse.ok) {
          const coursesData = await coursesResponse.json();
          setCourses(coursesData);
        } else {
          console.error("Failed to fetch courses:", coursesResponse.status);
          toast.error("Failed to load courses");
        }

        // Fetch staff
        const staffResponse = await fetch("http://localhost:8080/api/staff", {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (staffResponse.ok) {
          const staffData = await staffResponse.json();
          setStaffList(staffData);
        } else {
          console.error("Failed to fetch staff:", staffResponse.status);
          toast.error("Failed to load staff");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Failed to load courses and staff data");
      }
    };

    fetchData();
  }, []);

  // Get current admin from localStorage and find staff ID
  useEffect(() => {
    const adminName = sessionStorage.getItem("admin") || "";
    const token = sessionStorage.getItem("token");
    setCurrentAdmin(adminName);
    
    // Find staff ID by name
    if (adminName && staffList.length > 0) {
      const staff = staffList.find(s => s.staffName === adminName);
      if (staff) {
        setAssignedStaffId(staff.staffId);
        console.log("Found staff ID:", staff.staffId, "for admin:", adminName);
      } else {
        console.warn("Staff not found for admin:", adminName);
      }
    }
  }, [staffList]);

  // Set default values when data is loaded
  useEffect(() => {
    if (currentAdmin) {
      setValue("staff", currentAdmin);
    }
  }, [currentAdmin, setValue]);

  const onSubmit = async (data) => {
    // Validate course selection
    if (!data.courseId) {
      setError("courseId", {
        type: "manual",
        message: "Course selection is required"
      });
      return;
    }

    // Validate staff assignment
    if (!assignedStaffId) {
      toast.error("Staff assignment failed. Please refresh the page.");
      return;
    }

    try {
      setLoading(true);
      const token = sessionStorage.getItem("token");

      if (!token) {
        toast.error("Authentication token not found. Please login again.");
        return;
      }

      // Validate required fields
      if (!data.name || !data.student_name || !data.email || !data.mobile || !data.query) {
        toast.error("Please fill in all required fields.");
        return;
      }

      // Map form fields to backend expected keys - simplified payload with essential fields only
      const payload = {
        enquirerName: data.name.trim(),
        studentName: data.student_name.trim(),
        enquirerEmailId: data.email.trim(),
        enquirerMobile: parseInt(data.mobile, 10),
        enquirerQuery: data.query.trim(),
        enquiryDate: data.date || new Date().toISOString().split('T')[0],
        courseId: parseInt(data.courseId, 10),
        assignedStaffId: assignedStaffId,
        followUpDate: data.followUpDate || null,
        enquiryProcessedFlag: false,
        enquiryCounter: 0,
      };



      const res = await fetch("http://localhost:8080/api/enquiries", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json", 
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        let responseData;
        try {
          responseData = await res.json();
        } catch (jsonError) {
          // Response was successful but not JSON
        }
        toast.success("Enquiry saved successfully.");
        reset();
        setValue("staff", currentAdmin);
        setValue("date", new Date().toISOString().split('T')[0]);
        
        // Set follow-up date to 3 days from now
        const followUpDate = new Date();
        followUpDate.setDate(followUpDate.getDate() + 3);
        const followUpDateString = followUpDate.toISOString().split('T')[0];
        setValue("followUpDate", followUpDateString);
        
        // Redirect to admin main page after successful submission
        setTimeout(() => {
          router.push("/admin");
        }, 1500);
      } else {
        // Handle error response
        let errorData;
        try {
          errorData = await res.json();
          console.error("Error response:", errorData);
          toast.error(errorData.message || `Failed to save enquiry. Status: ${res.status}`);
        } catch (jsonError) {
          const errorText = await res.text();
          console.error("Error response (not JSON):", errorText);
          toast.error(`Failed to save enquiry. Status: ${res.status}`);
        }
      }
    } catch (error) {
      console.error("Network error:", error);
      toast.error("Network error. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-6">
      <Card className="w-full max-w-5xl shadow-2xl rounded-2xl">
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent className="p-8 grid grid-cols-1 md:grid-cols-2 gap-10">
            {/* Left Column */}
            <div className="flex flex-col justify-between space-y-6">
              <div>
                <h2 className="text-2xl font-semibold text-gray-800 mb-6">
                  New Enquiry
                </h2>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name">Enquirer Name *</Label>
                    <Input
                      id="name"
                      placeholder="Enter name"
                      {...register("name", { 
                        required: "Enquirer name is required" 
                      })}
                      className="mt-1"
                    />
                    {errors.name && (
                      <p className="text-red-500 text-sm">{errors.name.message}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="student_name">Student Name *</Label>
                    <Input
                      id="student_name"
                      placeholder="Enter student name"
                      {...register("student_name", { 
                        required: "Student name is required" 
                      })}
                      className="mt-1"
                    />
                    {errors.student_name && (
                      <p className="text-red-500 text-sm">{errors.student_name.message}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter email"
                      {...register("email", { 
                        required: "Email is required",
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          message: "Invalid email address"
                        }
                      })}
                      className="mt-1"
                    />
                    {errors.email && (
                      <p className="text-red-500 text-sm">{errors.email.message}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="mobile">Mobile *</Label>
                    <Input
                      id="mobile"
                      type="tel"
                      placeholder="Enter mobile number"
                      {...register("mobile", {
                        required: "Mobile number is required",
                        pattern: {
                          value: /^\d{10}$/,
                          message: "Enter a valid 10-digit mobile number"
                        }
                      })}
                      className="mt-1"
                    />
                    {errors.mobile && (
                      <p className="text-red-500 text-sm">{errors.mobile.message}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="alt_mobile">Alternate Mobile</Label>
                    <Input
                      id="alt_mobile"
                      type="tel"
                      placeholder="Alternate number"
                      {...register("alt_mobile", {
                        pattern: {
                          value: /^\d{10}$/,
                          message: "Enter a valid 10-digit mobile number"
                        }
                      })}
                      className="mt-1"
                    />
                    {errors.alt_mobile && (
                      <p className="text-red-500 text-sm">{errors.alt_mobile.message}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="address">Address</Label>
                    <Textarea
                      id="address"
                      placeholder="Enter address"
                      {...register("address")}
                      className="mt-1"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="flex flex-col justify-between space-y-6">
              <div className="space-y-4 pt-10 md:pt-0">
                <div>
                  <Label htmlFor="query">Enquiry Query *</Label>
                  <Textarea
                    id="query"
                    placeholder="Enter query"
                    {...register("query", { 
                      required: "Enquiry query is required" 
                    })}
                    className="mt-1"
                  />
                  {errors.query && (
                    <p className="text-red-500 text-sm">{errors.query.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="courseId">Course *</Label>
                  <Select 
                    value={selectedCourseId} 
                    onValueChange={(value) => {
                      setValue("courseId", value);
                      clearErrors("courseId");
                    }}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select a course" />
                    </SelectTrigger>
                    <SelectContent>
                      {courses.map((course) => (
                        <SelectItem key={course.courseId} value={course.courseId.toString()}>
                          {course.courseName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.courseId && (
                    <p className="text-red-500 text-sm">{errors.courseId.message}</p>
                  )}
                  {!selectedCourseId && !errors.courseId && (
                    <p className="text-red-500 text-sm">Course selection is required.</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="date">Enquiry Date *</Label>
                  <Input
                    id="date"
                    type="date"
                    {...register("date", { 
                      required: "Enquiry date is required" 
                    })}
                    className="mt-1"
                  />
                  {errors.date && (
                    <p className="text-red-500 text-sm">{errors.date.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="followUpDate">Follow-up Date</Label>
                  <Input
                    id="followUpDate"
                    type="date"
                    {...register("followUpDate")}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="staff">Assigned Staff</Label>
                  <Input
                    id="staff"
                    value={currentAdmin}
                    {...register("staff")}
                    className="mt-1"
                    disabled
                  />
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex justify-end pt-6">
                <Button 
                  type="submit" 
                  disabled={loading}
                >
                  {loading ? "Saving..." : "Save Enquiry"}
                </Button>
              </div>
            </div>
          </CardContent>
        </form>
      </Card>
    </div>
  );
}
