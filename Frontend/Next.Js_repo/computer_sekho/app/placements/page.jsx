"use client";
import { useEffect, useState } from "react";
import Footer from "../footer/components/Footer";
import Navcomponent from "../home/components/Navcomponent";
import BatchPlacementCard from "./components/BatchPlacementCard";
import { fetchPlacementData } from "@/lib/utils";

export default function PlacementPage() {
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchBatches() {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchPlacementData();
        setBatches(data);
      } catch (error) {
        console.error("Error fetching placement data:", error);
        setError("Failed to load placement data. Please try again later.");
      } finally {
        setLoading(false);
      }
    }

    fetchBatches();
  }, []);

  const dbda = batches
    .filter((b) => b.course === "PG DBDA")
    .sort((a, b) => {
      const yearA = new Date(a.presentationDate).getFullYear();
      const yearB = new Date(b.presentationDate).getFullYear();
      return yearB - yearA; // Sort by year descending (newest first)
    });
  const dac = batches
    .filter((b) => b.course === "PG DAC")
    .sort((a, b) => {
      const yearA = new Date(a.presentationDate).getFullYear();
      const yearB = new Date(b.presentationDate).getFullYear();
      return yearB - yearA; // Sort by year descending (newest first)
    });

  if (loading) {
    return (
      <>
        <Navcomponent />
        <div className="pt-[150px] p-6">
          <div className="flex justify-center items-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading placement data...</p>
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (error) {
    return (
      <>
        <Navcomponent />
        <div className="pt-[150px] p-6">
          <div className="flex justify-center items-center min-h-[400px]">
            <div className="text-center">
              <div className="text-red-500 text-6xl mb-4">⚠️</div>
              <p className="text-red-600 text-lg mb-2">Error Loading Data</p>
              <p className="text-gray-600 mb-4">{error}</p>
              <button 
                onClick={() => window.location.reload()} 
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
    <Navcomponent/>
    <div className="pt-[150px] p-6 space-y-12">
      {/* DBDA Section */}
      <div>
        <h2 className="text-2xl font-bold text-blue-900 mb-4 text-center">
          PG-DBDA Placement Batches
        </h2>
        {dbda.length > 0 ? (
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
                courseFees={b.courseFees}
                presentationDate={b.presentationDate}
              />
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-500 py-8">
            No DBDA batches available at the moment.
          </div>
        )}
      </div>

      {/* DAC Section */}
      <div>
        <h2 className="text-2xl font-bold text-blue-900 mb-4 text-center">
          PG-DAC Placement Batches
        </h2>
        {dac.length > 0 ? (
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
                courseFees={b.courseFees}
                presentationDate={b.presentationDate}
              />
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-500 py-8">
            No DAC batches available at the moment.
          </div>
        )}
      </div>
    </div>
    <Footer/>
    </>
  );
}
