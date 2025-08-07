'use client';

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import Link from "next/link";

export default function EnquiryDetailPage() {
  const { id } = useParams();
  const [enquiry, setEnquiry] = useState(null);
  const [followups, setFollowups] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    fetchData();
  }, [id]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await fetch(`http://localhost:8080/api/enquiries/${id}`);
      if (!res.ok) throw new Error("Failed to fetch enquiry");
      const data = await res.json();
      setEnquiry(data);

      const fRes = await fetch(`http://localhost:8080/api/followups?enquiry_id=${id}`);
      if (!fRes.ok) throw new Error("Failed to fetch follow-ups");
      const fData = await fRes.json();
      setFollowups(fData);
    } catch (err) {
      toast.error("Failed to load enquiry details");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="p-6 text-center">Loading...</div>;
  }

  if (!enquiry) {
    return <div className="p-6 text-center text-red-500">Enquiry not found.</div>;
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Enquiry Detail</h2>
        <Link href="/admin/enquiries">
          <Button variant="outline">Back to List</Button>
        </Link>
      </div>

      <Card>
  <CardContent className="p-4 space-y-2">
    <div><strong>Name:</strong> {enquiry.enquirerName}</div>
    <div><strong>Contact:</strong> {enquiry.enquirerMobile}</div>
    <div><strong>Email:</strong> {enquiry.enquirerEmailId}</div>
    <div><strong>Query:</strong> {enquiry.enquirerQuery}</div>
    <div><strong>Status:</strong> {enquiry.closureReason || "Pending"}</div>
    <div><strong>Date:</strong> {new Date(enquiry.enquiryDate).toLocaleString()}</div>
  </CardContent>
</Card>


      <div className="flex gap-4">
        <Link href={`/admin/enquiries/followup/${id}`}>
          <Button>Add Follow-Up</Button>
        </Link>
        <Link href={`/admin/enquiries/closure/${id}`}>
          <Button variant="secondary">Close / Success</Button>
        </Link>
      </div>

      <div>
        <h3 className="text-xl font-semibold mt-6 mb-2">Follow-Up Timeline</h3>
        {followups.length === 0 ? (
          <div className="text-gray-500">No follow-ups yet.</div>
        ) : (
          <Card>
            <CardContent className="p-4 space-y-3">
              {followups.map((f, i) => (
                <div key={i} className="border-b pb-2">
                  <div><strong>Date:</strong> {new Date(f.followupDate).toLocaleString()}</div>
                  <div><strong>Remarks:</strong> {f.followupMsg}</div>
                  <div><strong>Staff:</strong> {f.staff_name}</div>
                </div>
              ))}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
