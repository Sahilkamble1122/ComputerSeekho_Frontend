"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { useForm } from "react-hook-form";

export default function CloseEnquiryPage() {
  const { id } = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [closureReasons, setClosureReasons] = useState([]);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    setError,
  } = useForm({
    defaultValues: {
      status: "success",
      closureReason: "",
      otherReason: "",
    },
  });

  const watchStatus = watch("status");
  const watchReason = watch("closureReason");

  useEffect(() => {
    fetchClosureReasons();
  }, []);

  const fetchClosureReasons = async () => {
    try {
      const token = sessionStorage.getItem('token');
      const res = await fetch("http://localhost:8080/api/closure-reasons", {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!res.ok) throw new Error("Failed to fetch closure reasons");
      const data = await res.json();
      setClosureReasons([...data, { closureReasonDesc: "Other" }]);
    } catch (err) {
      toast.error("Error loading closure reasons");
    }
  };

  const onSubmit = async (values) => {
    if (values.status === "closed") {
      if (!values.closureReason) {
        setError("closureReason", { message: "Closure reason is required" });
        return;
      }

      if (values.closureReason === "Other" && !values.otherReason.trim()) {
        setError("otherReason", { message: "Please specify the reason" });
        return;
      }
    }

    try {
      setLoading(true);

      // If success → go to registration without updating enquiry yet
      if (values.status === "success") {
        router.push(`/admin/enquiries/closure/${id}/registration`);
        return;
      }

      // If closed → call closure API with reason
      const isOther = values.closureReason === "Other";
      const payload = {
        closureReasonId:
          values.status === "closed" && !isOther
            ? parseInt(values.closureReason)
            : null,
        closureReason:
          values.status === "closed" && isOther ? values.otherReason : null,
      };

      const token = sessionStorage.getItem('token');
      
      // First, call the closure endpoint with reason details
      try {
        const closureRes = await fetch(
          `http://localhost:8080/api/enquiries/${id}/closure`,
          {
            method: "PATCH",
            headers: { 
              "Content-Type": "application/json", 
              'Authorization': `Bearer ${token}`,
              'Accept': 'application/json'
            },
            body: JSON.stringify(payload),
          }
        );
        
        if (!closureRes.ok) {
          const errorText = await closureRes.text();
          throw new Error(`Failed to set closure reason: ${closureRes.status} - ${errorText}`);
        }
      } catch (error) {
        if (error.name === 'TypeError' && error.message.includes('fetch')) {
          throw new Error("Network error - please check if backend server is running and CORS is configured properly");
        }
        throw error;
      }
      
      // Then, update the enquiry status to 'closed'
      const res = await fetch(
        `http://localhost:8080/api/enquiries/${id}/status?status=true`,
        {
          method: "PATCH",
          headers: { 'Authorization': `Bearer ${token}` },
        }
      );

      if (!res.ok) throw new Error("Failed to close enquiry");
      
      // Finally, update enquiryProcessedFlag to true
      await fetch(`http://localhost:8080/api/enquiries/${id}/processed?enquiryProcessedFlag=true`, {
        method: "PATCH",
        headers: { 'Authorization': `Bearer ${token}` },
      });

      toast.success("Enquiry marked as closed");
      router.push("/admin/enquiries");
    } catch (err) {
      toast.error(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">
        Close / Mark Enquiry as Success
      </h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block mb-1 font-medium">Status</label>
          <select
            {...register("status")}
            className="w-full border px-3 py-2 rounded-md"
          >
            <option value="success">Success</option>
            <option value="closed">Closed</option>
          </select>
          {errors.status && (
            <p className="text-red-500 text-sm mt-1">{errors.status.message}</p>
          )}
        </div>

        {watchStatus === "closed" && (
          <>
            <div>
              <label className="block mb-1 font-medium">Closure Reason</label>
              <select
                {...register("closureReason")}
                className="w-full border px-3 py-2 rounded-md"
              >
                <option value="">Select reason</option>
                {closureReasons.map((r, index) => (
                  <option
                    key={index}
                    value={
                      r.closureReasonDesc === "Other"
                        ? "Other"
                        : r.closureReasonId
                    }
                  >
                    {r.closureReasonDesc}
                  </option>
                ))}
              </select>
              {errors.closureReason && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.closureReason.message}
                </p>
              )}
            </div>

            {watchReason === "Other" && (
              <div>
                <label className="block mb-1 font-medium">
                  Specify Other Reason
                </label>
                <Input
                  {...register("otherReason")}
                  placeholder="Type reason here..."
                  className="w-full"
                />
                {errors.otherReason && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.otherReason.message}
                  </p>
                )}
              </div>
            )}
          </>
        )}

        <Button type="submit" disabled={loading}>
          {watchStatus === "success"
            ? "Add Student"
            : loading
            ? "Submitting..."
            : "Close Enquiry"}
        </Button>
      </form>
    </div>
  );
}
