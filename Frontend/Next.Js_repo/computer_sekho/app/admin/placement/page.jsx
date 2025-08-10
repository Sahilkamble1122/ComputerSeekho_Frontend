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
import { updateStudentPlacementStatus } from "@/lib/utils";

export default function ManagePlacementsPage() {
  const [courses, setCourses] = useState([]);
  const [batches, setBatches] = useState([]);
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState("all");
  const [selectedBatch, setSelectedBatch] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const [page, setPage] = useState(1);
  const pageSize = 5;

  useEffect(() => {
    const token = sessionStorage.getItem("token");
    fetch("http://localhost:8080/api/courses", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setCourses(data));

    fetch("http://localhost:8080/api/batches/active", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setBatches(data));

    // ✅ Fetch all students once
    fetch("http://localhost:8080/api/students", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setStudents(data))
      .catch(() => toast({ title: "Error fetching students" }));
  }, []);

  // ✅ Filter on frontend based on course, batch, and search
  useEffect(() => {
    let filtered = students;

    if (selectedCourse && selectedCourse !== "all") {
      filtered = filtered.filter((s) => s.courseId == selectedCourse);
    }

    if (selectedBatch && selectedBatch !== "all") {
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

  // Helper function to get course name by ID
  const getCourseName = (courseId) => {
    const course = courses.find(c => c.courseId === courseId);
    return course ? course.courseName : `Course ${courseId}`;
  };

  // Helper function to get batch name by ID
  const getBatchName = (batchId) => {
    const batch = batches.find(b => b.batchId === batchId);
    return batch ? batch.batchName : `Batch ${batchId}`;
  };

  const handlePlacementToggle = async (studentId, isPlaced) => {
    try {
      const token = sessionStorage.getItem("token");
      await updateStudentPlacementStatus(studentId, isPlaced, token);

      // ✅ Local state update so UI updates instantly
      setStudents((prev) =>
        prev.map((s) => (s.studentId === studentId ? { ...s, isPlaced } : s))
      );

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
          <Select value={selectedCourse} onValueChange={setSelectedCourse}>
            <SelectTrigger>
              <SelectValue placeholder="Select course" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All courses</SelectItem>
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
          <Select value={selectedBatch} onValueChange={setSelectedBatch}>
            <SelectTrigger>
              <SelectValue placeholder="Select batch" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All batches</SelectItem>
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
                  <TableCell>{getCourseName(student.courseId)}</TableCell>
                  <TableCell>{getBatchName(student.batchId)}</TableCell>
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
