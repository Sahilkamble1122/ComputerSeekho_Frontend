"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function AdminDashboard({ adminName }) {
  const [enquiries, setEnquiries] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchEnquiries = async () => {
      try {
        const res = await fetch("http://localhost:8080/api/enquiries");
        if (!res.ok) throw new Error("Failed to fetch enquiries");
        const data = await res.json();

        // 🔍 Filter only enquiries where enquiryProcessedFlag === false
        const unprocessedEnquiries = data.filter(
          (enq) => enq.enquiryProcessedFlag === false
        );

        setEnquiries(unprocessedEnquiries);
      } catch (error) {
        console.error(error);
      }
    };
    fetchEnquiries();
  }, []);

  // Safe & sorted data
  const safeData = Array.isArray(enquiries) ? enquiries : [];
  const sortedData = [...safeData].sort(
    (a, b) => new Date(a.followUpDate) - new Date(b.followUpDate)
  );

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = sortedData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(sortedData.length / itemsPerPage);

  const goToNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const goToPrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  return (
    <div className="p-6 space-y-6 bg-white min-h-screen">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Enquiry List</h2>
        <Link href="/admin/enquiries/new">
          <Button className="bg-black text-white hover:bg-gray-800">
            Add Enquiry
          </Button>
        </Link>
      </div>

      <Card>
        <CardContent className="overflow-auto p-4">
          <table className="w-full border text-sm">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="p-3 border font-bold">Enq.Id</th>
                <th className="p-3 border font-bold">Enquirer Name</th>
                <th className="p-3 border font-bold">Student Name</th>
                <th className="p-3 border font-bold">Phone</th>
                <th className="p-3 border font-bold w-[300px]">Query</th>
                <th className="p-3 border font-bold">Follow-up Date</th>
                <th className="p-3 border font-bold">Staff Name</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.length === 0 ? (
                <tr>
                  <td colSpan="8" className="text-center p-4">
                    No enquiries found.
                  </td>
                </tr>
              ) : (
                currentItems.map((enquiry) => (
                  <tr
                    key={enquiry.enquiryId}
                    className="border-t hover:bg-gray-50"
                  >
                    <td className="p-2 border">{enquiry.enquiryId}</td>
                    <td className="p-2 border">{enquiry.enquirerName}</td>
                    <td className="p-2 border">{enquiry.studentName}</td>
                    <td className="p-2 border">{enquiry.enquirerMobile}</td>
                    <td className="p-2 border">{enquiry.enquirerQuery}</td>
                    <td className="p-2 border">{enquiry.followUpDate}</td>
                    <td className="p-2 border">{enquiry.staffName}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          {/* Pagination Controls */}
          <div className="flex justify-between items-center mt-4">
            <Button
              onClick={goToPrevPage}
              disabled={currentPage === 1}
              className="text-sm"
              variant="outline"
            >
              Previous
            </Button>
            <span className="text-sm">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              onClick={goToNextPage}
              disabled={currentPage === totalPages}
              className="text-sm"
              variant="outline"
            >
              Next
            </Button>
          </div>

          <div className="text-center text-gray-500 mt-2 text-sm">
            Showing {indexOfFirstItem + 1} -{" "}
            {Math.min(indexOfLastItem, sortedData.length)} of{" "}
            {sortedData.length}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
