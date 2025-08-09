
'use client';
import Link from "next/link";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";

export default function EnquiryListPage() {
  const [enquiries, setEnquiries] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const enquiriesPerPage = 5;

  useEffect(() => {
    fetchEnquiries();
  }, []);

  const fetchEnquiries = async () => {
    try {
      const token = sessionStorage.getItem('token');
      const res = await fetch("http://localhost:8080/api/enquiries", {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!res.ok) throw new Error("Failed to fetch enquiries");
      const data = await res.json();
      setEnquiries(data);
    } catch (err) {
      toast.error("Error loading enquiries");
    }
  };

  const filtered = enquiries.filter((e) => {
  const q = searchTerm.toLowerCase();
  return (
    e.enquirerName?.toLowerCase().includes(q) ||
    e.enquirerMobile?.toString().includes(q) ||
    e.enquirerQuery?.toLowerCase().includes(q)
  );
});
  const indexOfLast = currentPage * enquiriesPerPage;
  const indexOfFirst = indexOfLast - enquiriesPerPage;
  const currentEnquiries = filtered.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filtered.length / enquiriesPerPage);

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Enquiry List</h2>
        <Link href="/admin/enquiries/new">
          <Button>Add Enquiry</Button>
        </Link>
      </div>

      <Input
        type="text"
        placeholder="Search by name, contact, or course"
        className="max-w-md"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <Card>
        <CardContent className="overflow-auto p-4">
          <table className="w-full border">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="p-2 border">Name</th>
                <th className="p-2 border">Contact</th>
                <th className="p-2 border">Email</th>
                <th className="p-2 border w-[300px]">Query</th>
                <th className="p-2 border">No Of Followups</th>
                <th className="p-2 border">Created</th>
                <th className="p-2 border">Action</th>
              </tr>
            </thead>
            <tbody>
              {currentEnquiries.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center p-4">
                    No enquiries found.
                  </td>
                </tr>
              ) : (
                currentEnquiries.map((enquiry) => (
                  <tr key={enquiry.enquiryId} className="border-t">
                    <td className="p-2 border">{enquiry.enquirerName}</td>
                    <td className="p-2 border">{enquiry.enquirerMobile}</td>
                    <td className="p-2 border">{enquiry.enquirerEmailId}</td>
                    <td className="p-2 border">{enquiry.enquirerQuery}</td>
                    <td className="p-2 border">{enquiry.enquiryCounter}</td>
                    <td className="p-2 border">{new Date(enquiry.enquiryDate).toLocaleDateString()}</td>
                    <td className="p-2 border">
                      <Link href={`/admin/enquiries/${enquiry.enquiryId}`} passHref>
                        <Button size="sm">View</Button>
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </CardContent>
      </Card>

      {totalPages > 1 && (
        <div className="flex justify-center gap-2 pt-4">
          {Array.from({ length: totalPages }, (_, i) => (
            <Button
              key={i + 1}
              variant={currentPage === i + 1 ? "default" : "outline"}
              onClick={() => setCurrentPage(i + 1)}
            >
              {i + 1}
            </Button>
          ))}
        </div>
      )}
    </div>
  );
}
