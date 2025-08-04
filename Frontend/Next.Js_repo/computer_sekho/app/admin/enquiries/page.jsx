
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
      const res = await fetch("/api/enquiry");
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
      e.name?.toLowerCase().includes(q) ||
      e.contact?.includes(q) ||
      e.course?.toLowerCase().includes(q)
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
                <th className="p-2 border">Course</th>
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
                  <tr key={enquiry.id} className="border-t">
                    <td className="p-2 border">{enquiry.name}</td>
                    <td className="p-2 border">{enquiry.contact}</td>
                    <td className="p-2 border">{enquiry.email}</td>
                    <td className="p-2 border">{enquiry.course}</td>
                    <td className="p-2 border">{new Date(enquiry.created_at).toLocaleDateString()}</td>
                    <td className="p-2 border">
                      <Link href={`/admin/enquiries/${enquiry.id}`} passHref>
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
