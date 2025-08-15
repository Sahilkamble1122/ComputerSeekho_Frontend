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
  const [staffList, setStaffList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    fetchData();
  }, [id]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const token = sessionStorage.getItem('token');
      
      // Fetch enquiry details
      const res = await fetch(`http://localhost:8080/api/enquiries/${id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!res.ok) throw new Error("Failed to fetch enquiry");
      const data = await res.json();
      setEnquiry(data);

      // Fetch followups for this specific enquiry only
      const fRes = await fetch(`http://localhost:8080/api/followups?enquiry_id=${id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!fRes.ok) throw new Error("Failed to fetch follow-ups");
      const fData = await fRes.json();
      
      // Additional filtering to ensure only followups for this enquiry are shown
      const filteredFollowups = Array.isArray(fData) ? fData.filter(f => f.enquiryId == id) : [];
      setFollowups(filteredFollowups);

      // Fetch staff data to get staff names
      const staffRes = await fetch('http://localhost:8080/api/staff', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!staffRes.ok) throw new Error("Failed to fetch staff");
      const staffData = await staffRes.json();
      setStaffList(staffData);
    } catch (err) {
      toast.error("Failed to load enquiry details");
    } finally {
      setLoading(false);
    }
  };

  // Function to get staff name by staff ID
  const getStaffName = (staffId) => {
    if (!staffId || !staffList.length) return "N/A";
    const staff = staffList.find(s => s.staffId === staffId);
    return staff ? staff.staffName : "N/A";
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
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold">Follow-Up Timeline</h3>
          <div className="text-sm text-gray-600 bg-blue-50 px-3 py-1 rounded-full">
            Showing followups for: <strong>{enquiry.enquirerName}</strong>
          </div>
        </div>
        {followups.length === 0 ? (
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-gray-500 mb-2">No follow-ups yet for this enquiry.</div>
              <div className="text-sm text-gray-400">Click "Add Follow-Up" to start tracking progress.</div>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent className="p-4">
              <div className="space-y-4">
                {followups.map((f, i) => (
                  <div key={f.followupId || i} className="border-l-4 border-blue-500 pl-4 pb-4 relative">
                    <div className="absolute -left-2 top-0 w-4 h-4 bg-blue-500 rounded-full"></div>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <div className="text-sm font-medium text-gray-700">
                          Follow-up #{i + 1}
                        </div>
                        <div className="text-sm text-gray-500">
                          {new Date(f.followupDate).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </div>
                      </div>
                      <div className="mb-2">
                        <strong className="text-gray-700">Remarks:</strong>
                        <div className="mt-1 text-gray-600 bg-white p-2 rounded border">
                          {f.followupMsg}
                        </div>
                      </div>
                      <div className="text-sm text-gray-500">
                        <strong>Staff:</strong> {getStaffName(f.staffId)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
