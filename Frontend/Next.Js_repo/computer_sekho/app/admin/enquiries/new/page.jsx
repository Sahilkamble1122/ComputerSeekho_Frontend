'use client';

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
    setValue
  } = useForm();

  // ✅ Set current admin name only once after mount
  useEffect(() => {
    const adminName = localStorage.getItem("admin") || "";
    setCurrentAdmin(adminName);
  }, []);

  // ✅ Once currentAdmin is fetched, set it in the form
  useEffect(() => {
    if (currentAdmin) {
      setValue("staff", currentAdmin);
    }
  }, [currentAdmin, setValue]);

  const onSubmit = async (data) => {
    try {
      const res = await fetch("http://localhost:8080/api/enquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        toast.success("Enquiry saved successfully.");
        reset();
        setValue("staff", currentAdmin);
      } else {
        toast.error("Failed to save enquiry.");
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
              <h2 className="text-2xl font-semibold text-gray-800 mb-6">New Enquiry</h2>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Enquirer Name</Label>
                  <Input
                    id="name"
                    placeholder="Enter name"
                    {...register("name", { required: true })}
                    className="mt-1"
                  />
                  {errors.name && <p className="text-red-500 text-sm">Name is required.</p>}
                </div>

                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter email"
                    {...register("email", { required: true })}
                    className="mt-1"
                  />
                  {errors.email && <p className="text-red-500 text-sm">Email is required.</p>}
                </div>

                <div>
                  <Label htmlFor="mobile">Mobile</Label>
                  <Input
                    id="mobile"
                    type="tel"
                    placeholder="Enter mobile number"
                    {...register("mobile", { required: true, pattern: /^\d{10}$/ })}
                    className="mt-1"
                  />
                  {errors.mobile && (
                    <p className="text-red-500 text-sm">Enter a valid 10-digit mobile number.</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="alt_mobile">Alternate Mobile</Label>
                  <Input
                    id="alt_mobile"
                    type="tel"
                    placeholder="Alternate number"
                    {...register("alt_mobile")}
                    className="mt-1"
                  />
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
                <Label htmlFor="query">Enquiry Query</Label>
                <Textarea
                  id="query"
                  placeholder="Enter query"
                  {...register("query", { required: true })}
                  className="mt-1"
                />
                {errors.query && <p className="text-red-500 text-sm">Query is required.</p>}
              </div>

              <div>
                <Label htmlFor="course">Course</Label>
                <Input
                  id="course"
                  placeholder="Course interested in"
                  {...register("course", { required: true })}
                  className="mt-1"
                />
                {errors.course && <p className="text-red-500 text-sm">Course is required.</p>}
              </div>

              <div>
                <Label htmlFor="date">Enquiry Date</Label>
                <Input
                  id="date"
                  type="date"
                  {...register("date", { required: true })}
                  className="mt-1"
                />
                {errors.date && <p className="text-red-500 text-sm">Date is required.</p>}
              </div>

              <div>
                <Label htmlFor="staff">Assigned Staff</Label>
                <Input
                  id="staff"
                  value={currentAdmin}
                  {...register("staff", { required: true })}
                  className="mt-1"
                  disabled
                />
                {errors.staff && <p className="text-red-500 text-sm">Staff is required.</p>}
              </div>
            </div>

            {/* Submit Button */}
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
