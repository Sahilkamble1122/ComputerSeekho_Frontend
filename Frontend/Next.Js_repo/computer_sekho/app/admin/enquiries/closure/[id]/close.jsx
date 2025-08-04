'use client';

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

const closeSchema = z.object({
  status: z.enum(["success", "closed"], {
    required_error: "Status is required"
  }),
  closing_remarks: z.string().min(5, "Please enter at least 5 characters")
});

export default function CloseEnquiryPage() {
  const { id } = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(closeSchema),
    defaultValues: {
      status: "success",
      closing_remarks: ""
    }
  });

  const onSubmit = async (values) => {
    try {
      setLoading(true);
      const res = await fetch(`/api/enquiry/${id}/close`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values)
      });

      if (!res.ok) throw new Error("Failed to close enquiry");

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
      <h2 className="text-2xl font-bold mb-4">Close / Mark Enquiry as Success</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block mb-1 font-medium">Status</label>
          <select {...register("status")}
                  className="w-full border px-3 py-2 rounded-md">
            <option value="success">Success</option>
            <option value="closed">Closed</option>
          </select>
          {errors.status && <p className="text-red-500 text-sm mt-1">{errors.status.message}</p>}
        </div>

        <div>
          <label className="block mb-1 font-medium">Closing Remarks</label>
          <Textarea {...register("closing_remarks")}
                    placeholder="Write reason or closing remarks..."
                    className="w-full min-h-[100px]" />
          {errors.closing_remarks && <p className="text-red-500 text-sm mt-1">{errors.closing_remarks.message}</p>}
        </div>

        <Button type="submit" disabled={loading}>
          {loading ? "Submitting..." : "Close Enquiry"}
        </Button>
      </form>
    </div>
  );
}
