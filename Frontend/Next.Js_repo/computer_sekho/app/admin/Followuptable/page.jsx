'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

export default function AdminDashboard({ adminName }) {
  const [enquiries, setEnquiries] = useState([]);

  useEffect(() => {
    const fetchEnquiries = async () => {
      try {
        const res = await fetch('http://localhost:8080/api/enquiries');
        if (!res.ok) throw new Error('Failed to fetch enquiries');
        const data = await res.json();
        console.log("Fetched Enquiries:", data);

        // Filter only unprocessed enquiries
        const filtered = data.filter(e => e.enquiryProcessedFlag === false);

        setEnquiries(filtered);
      } catch (error) {
        console.error("Error fetching enquiries:", error);
      }
    };
    fetchEnquiries();
  }, []);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-bold">Welcome <span className="italic">{adminName}</span></h1>
        <div className="space-x-2">
          <Link href="/admin/enquiries/new">
            <Button>Add Enquiry</Button>
          </Link>
          <Link href="/admin/registration">
            <Button variant="outline">Add Student</Button>
          </Link>
        </div>
      </div>

      <Card>
        <CardContent className="p-4 overflow-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Enq.Id</TableHead>
                <TableHead>Enquirer Name</TableHead>
                <TableHead>Student Name</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Course</TableHead>
                <TableHead>Follow-up Date</TableHead>
                <TableHead>Staff Name</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {enquiries.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center">No enquiries to display</TableCell>
                </TableRow>
              ) : (
                enquiries.map((enquiry) => (
                  <TableRow key={enquiry.enquiryId}>
                    <TableCell>{enquiry.enquiryId}</TableCell>
                    <TableCell>{enquiry.enquirerName || '-'}</TableCell>
                    <TableCell>{enquiry.studentName || '-'}</TableCell>
                    <TableCell>{enquiry.enquirerMobile || '-'}</TableCell>
                    <TableCell>{enquiry.course || '-'}</TableCell>
                    <TableCell>{enquiry.followUpDate || '-'}</TableCell>
                    <TableCell>{enquiry.staffName || '-'}</TableCell>
                    <TableCell>
                      <Button size="sm" variant="secondary">CALL</Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <div className="mt-4 flex justify-center space-x-4">
        <span className="underline cursor-pointer">Begin</span>
        <span className="underline cursor-pointer">Next</span>
        <span className="underline cursor-pointer">Previous</span>
        <span className="underline cursor-pointer">End</span>
      </div>
    </div>
  );
}
