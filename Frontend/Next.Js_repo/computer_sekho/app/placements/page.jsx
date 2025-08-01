"use client";
import { useEffect, useState } from "react";
import BatchPlacementCard from "./components/BatchPlacementCard";

export default function PlacementPage() {
  const [batches, setBatches] = useState([]);

  useEffect(() => {
    async function fetchBatches() {
      try {
        const res = await fetch("/api/placements");
        const data = await res.json();
        setBatches(data);
      } catch (error) {
        console.error("Error fetching placement data:", error);
      }
    }

    fetchBatches();
  }, []);

  const dbda = batches
    .filter((b) => b.course === "PG DBDA")
    .sort((a, b) => a.year - b.year);
  const dac = batches
    .filter((b) => b.course === "PG DAC")
    .sort((a, b) => a.year - b.year);

  return (
    <div className="p-6 space-y-12">
      {/* DBDA Section */}
      <div>
        <h2 className="text-2xl font-bold text-blue-900 mb-4 text-center">
          PG-DBDA Placement Batches
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {dbda.map((b, idx) => (
            <BatchPlacementCard
              key={idx}
              logo={b.logo}
              batch={`${b.course} ${b.batch}`}
              placement={b.placement}
              slug={b.slug}
              totalStudents={b.totalStudents}
              placedStudents={b.placedStudents}
            />
          ))}
        </div>
      </div>

      {/* DAC Section */}
      <div>
        <h2 className="text-2xl font-bold text-blue-900 mb-4 text-center">
          PG-DAC Placement Batches
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {dac.map((b, idx) => (
            <BatchPlacementCard
              key={idx}
              logo={b.logo}
              batch={`${b.course} ${b.batch}`}
              placement={b.placement}
              slug={b.slug}
              totalStudents={b.totalStudents}
              placedStudents={b.placedStudents}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
