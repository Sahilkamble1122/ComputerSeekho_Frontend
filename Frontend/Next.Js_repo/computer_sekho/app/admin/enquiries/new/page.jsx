"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { useForm } from "react-hook-form";

export default function EnquiryForm() {
  const [currentAdmin, setCurrentAdmin] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm();

  useEffect(() => {
    const adminName = localStorage.getItem("admin") || "";
    setCurrentAdmin(adminName);
  }, []);

  useEffect(() => {
    if (currentAdmin) {
      setValue("assignedStaffId", currentAdmin);
    }
    setValue("enquiryDate", new Date().toISOString().split("T")[0]);
  }, [currentAdmin, setValue]);

  const onSubmit = async (data) => {
    try {
      const token = localStorage.getItem("token");

      // Map form fields to backend expected keys
      const payload = {
        enquirerName: data.name,
        studentName: data.student_name,
        enquirerEmailId: data.email,
        enquirerMobile: data.mobile ? parseInt(data.mobile, 10) : null,
        enquirerAlternateMobile: data.alt_mobile ? parseInt(data.alt_mobile, 10) : null,
        enquirerAddress: data.address || null,
        enquirerQuery: data.query || null,
        enquiryDate: data.date || null,
        // If you have a course select with ID, map it; else send null
        courseId: null,
        // Defaults on creation
        enquiryProcessedFlag: false,
        enquiryCounter: 0,
      };

      const res = await fetch("http://localhost:8080/api/enquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        toast.success("Enquiry saved successfully.");
        reset();
        setValue("assignedStaffId", currentAdmin);
        setValue("enquiryDate", new Date().toISOString().split("T")[0]);
      } else {
        const errText = await res.text();
        toast.error(errText || "Failed to save enquiry.");
      }
    } catch (error) {
      toast.error("Something went wrong.");
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
                    <Label htmlFor="enquirerName">Enquirer Name</Label>
                    <Input
                      id="enquirerName"
                      placeholder="Enter name"
                      {...register("enquirerName", { required: true })}
                      className="mt-1"
                    />
                    {errors.enquirerName && <p className="text-red-500 text-sm">Name is required.</p>}
                  </div>

                  <div>
                    <Label htmlFor="studentName">Student Name</Label>
                    <Input
                      id="studentName"
                      placeholder="Enter student name"
                      {...register("studentName", { required: true })}
                      className="mt-1"
                    />
                    {errors.studentName && <p className="text-red-500 text-sm">Student Name is required.</p>}
                  </div>

                  <div>
                    <Label htmlFor="enquirerEmailId">Email</Label>
                    <Input
                      id="enquirerEmailId"
                      type="email"
                      placeholder="Enter email"
                      {...register("enquirerEmailId", { required: true })}
                      className="mt-1"
                    />
                    {errors.enquirerEmailId && <p className="text-red-500 text-sm">Email is required.</p>}
                  </div>

                  <div>
                    <Label htmlFor="enquirerMobile">Mobile</Label>
                    <Input
                      id="enquirerMobile"
                      type="tel"
                      placeholder="Enter mobile number"
                      {...register("enquirerMobile", {
                        required: true,
                        pattern: /^\d{10}$/,
                      })}
                      className="mt-1"
                    />
                    {errors.enquirerMobile && (
                      <p className="text-red-500 text-sm">Enter a valid 10-digit mobile number.</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="enquirerAlternateMobile">Alternate Mobile</Label>
                    <Input
                      id="enquirerAlternateMobile"
                      type="tel"
                      placeholder="Alternate number"
                      {...register("enquirerAlternateMobile")}
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="enquirerAddress">Address</Label>
                    <Textarea
                      id="enquirerAddress"
                      placeholder="Enter address"
                      {...register("enquirerAddress")}
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
                  <Label htmlFor="enquirerQuery">Enquiry Query</Label>
                  <Textarea
                    id="enquirerQuery"
                    placeholder="Enter query"
                    {...register("enquirerQuery", { required: true })}
                    className="mt-1"
                  />
                  {errors.enquirerQuery && <p className="text-red-500 text-sm">Query is required.</p>}
                </div>

                <div>
                  <Label htmlFor="courseId">Course ID</Label>
                  <Input
                    id="courseId"
                    placeholder="Enter Course ID (e.g., 101)"
                    {...register("courseId", { required: true })}
                    className="mt-1"
                  />
                  {errors.courseId && <p className="text-red-500 text-sm">Course is required.</p>}
                </div>

                <div>
                  <Label htmlFor="enquiryDate">Enquiry Date</Label>
                  <Input
                    id="enquiryDate"
                    type="date"
                    {...register("enquiryDate", { required: true })}
                    className="mt-1"
                  />
                  {errors.enquiryDate && <p className="text-red-500 text-sm">Date is required.</p>}
                </div>

                <div>
                  <Label htmlFor="assignedStaffId">Assigned Staff</Label>
                  <Input
                    id="assignedStaffId"
                    value={currentAdmin}
                    {...register("assignedStaffId", { required: true })}
                    className="mt-1"
                    disabled
                  />
                  {errors.assignedStaffId && <p className="text-red-500 text-sm">Staff is required.</p>}
                </div>
              </div>

              <div className="flex justify-end pt-6">
                <Button type="submit">Save Enquiry</Button>
              </div>
            </div>
          </CardContent>
          </form>
      </Card>
    </div>
  );
}