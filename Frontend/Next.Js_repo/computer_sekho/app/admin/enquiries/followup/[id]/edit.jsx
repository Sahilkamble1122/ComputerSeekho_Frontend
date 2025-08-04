'use client';
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useParams, useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const schema = z.object({
  date: z.string().min(1, "Date is required"),
  status: z.enum(["open", "closed", "pending", "success"], {
    required_error: "Status is required",
  }),
  remarks: z.string().min(1, "Remarks are required"),
});

export default function EditFollowupPage() {
  const { id } = useParams();
  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      date: new Date().toISOString().slice(0, 16),
      status: "open",
      remarks: "",
    },
  });

  const { register, handleSubmit, setValue, formState: { errors } } = form;

  const onSubmit = async (data) => {
    try {
      const res = await fetch(`/api/followup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          enquiry_id: id,
        }),
      });

      if (!res.ok) throw new Error("Failed to save follow-up");
      toast.success("Follow-up saved");
      router.push(`/admin/enquiries/${id}`);
    } catch (err) {
      toast.error("Could not save follow-up");
    }
  };

  useEffect(() => {
    setValue("date", new Date().toISOString().slice(0, 16));
  }, [setValue]);

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Add/Edit Follow-Up</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Card>
          <CardContent className="p-4 space-y-4">
            <div>
              <label className="block mb-1 font-medium">Follow-up Date</label>
              <Input type="datetime-local" {...register("date")}/>
              {errors.date && <p className="text-red-500 text-sm">{errors.date.message}</p>}
            </div>

            <div>
              <label className="block mb-1 font-medium">Status</label>
              <Select {...register("status")} onValueChange={(val) => setValue("status", val)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="open">Open</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="closed">Closed</SelectItem>
                  <SelectItem value="success">Success</SelectItem>
                </SelectContent>
              </Select>
              {errors.status && <p className="text-red-500 text-sm">{errors.status.message}</p>}
            </div>

            <div>
              <label className="block mb-1 font-medium">Remarks</label>
              <Textarea rows={4} {...register("remarks")} />
              {errors.remarks && <p className="text-red-500 text-sm">{errors.remarks.message}</p>}
            </div>

            <Button type="submit">Save Follow-Up</Button>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
