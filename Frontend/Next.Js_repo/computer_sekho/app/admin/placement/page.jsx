"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function ManagePlacementsPage() {
  const [courses, setCourses] = useState([]);
  const [batches, setBatches] = useState([]);
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [selectedBatch, setSelectedBatch] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const [page, setPage] = useState(1);
  const pageSize = 5;

  useEffect(() => {
    fetch("http://localhost:8080/api/courses")
      .then((res) => res.json())
      .then((data) => setCourses(data));

    fetch("http://localhost:8080/api/batches/active")
      .then((res) => res.json())
      .then((data) => setBatches(data));

    // ✅ Fetch all students once
    fetch("http://localhost:8080/api/students")
      .then((res) => res.json())
      .then((data) => setStudents(data))
      .catch(() => toast({ title: "Error fetching students" }));
  }, []);

  // ✅ Filter on frontend based on course, batch, and search
  useEffect(() => {
    let filtered = students;

    if (selectedCourse) {
      filtered = filtered.filter((s) => s.courseId == selectedCourse);
    }

    if (selectedBatch) {
      filtered = filtered.filter((s) => s.batchId == selectedBatch);
    }

    if (searchQuery) {
      filtered = filtered.filter(
        (s) =>
          s.studentName &&
          s.studentName.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredStudents(filtered);
    setPage(1);
  }, [selectedCourse, selectedBatch, searchQuery, students]);

  const handlePlacementToggle = async (studentId, isPlaced) => {
    try {
      const res = await fetch(`/api/students/${studentId}/placement`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isPlaced: isPlaced }),
      });
      if (!res.ok) throw new Error();
      toast({ title: "Placement status updated" });
    } catch (error) {
      toast({ title: "Failed to update placement status" });
    }
  };

  const totalPages = Math.ceil(filteredStudents.length / pageSize);
  const paginatedStudents = filteredStudents.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold mb-4">Manage Student Placements</h1>

      <div className="flex gap-4">
        <div>
          <Label>Course</Label>
          <Select onValueChange={setSelectedCourse}>
            <SelectTrigger>
              <SelectValue placeholder="Select course" />
            </SelectTrigger>
            <SelectContent>
              {courses.map((course) => (
                <SelectItem
                  key={course.courseId}
                  value={String(course.courseId)}
                >
                  {course.courseName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>Batch</Label>
          <Select onValueChange={setSelectedBatch}>
            <SelectTrigger>
              <SelectValue placeholder="Select batch" />
            </SelectTrigger>
            <SelectContent>
              {batches.map((batch) => (
                <SelectItem key={batch.batchId} value={String(batch.batchId)}>
                  {batch.batchName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex-1">
          <Label>Search Student</Label>
          <Input
            placeholder="Type student name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <Card>
        <CardContent className="overflow-x-auto p-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="font-bold">Name</TableHead>
                <TableHead className="font-bold">Contact</TableHead>
                <TableHead className="font-bold">Course</TableHead>
                <TableHead className="font-bold">Batch</TableHead>
                <TableHead className="font-bold">Placed</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedStudents.map((student) => (
                <TableRow key={student.studentId}>
                  <TableCell>{student.studentName}</TableCell>
                  <TableCell>{student.studentMobile}</TableCell>
                  <TableCell>{student.courseName}</TableCell>
                  <TableCell>{student.batchName}</TableCell>
                  <TableCell>
                    <Switch
                      checked={student.isPlaced === true}
                      onCheckedChange={(val) =>
                        handlePlacementToggle(student.studentId, val)
                      }
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {totalPages > 1 && (
        <div className="flex justify-center space-x-2">
          <Button onClick={() => setPage(1)} disabled={page === 1}>
            First
          </Button>
          <Button onClick={() => setPage(page - 1)} disabled={page === 1}>
            Previous
          </Button>
          <span className="px-4 py-2">
            Page {page} of {totalPages}
          </span>
          <Button
            onClick={() => setPage(page + 1)}
            disabled={page === totalPages}
          >
            Next
          </Button>
          <Button
            onClick={() => setPage(totalPages)}
            disabled={page === totalPages}
          >
            Last
          </Button>
        </div>
      )}
    </div>
  );
}
