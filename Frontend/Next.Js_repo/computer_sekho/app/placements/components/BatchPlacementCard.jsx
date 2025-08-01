"use client";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function BatchPlacementCard({
  logo,
  batch,
  slug,
  totalStudents,
  placedStudents,
}) {
  const router = useRouter();

  // ✅ Calculate placement % here
  const placement =
    totalStudents > 0 ? Math.round((placedStudents / totalStudents) * 100) : 0;

  return (
    <div className="text-center shadow-md p-4 rounded-xl border hover:scale-105 transition-all">
      <Image
        src={logo}
        alt={batch}
        width={200}
        height={200}
        className="mx-auto mb-2"
      />

      <button
        onClick={() => router.push(`/placement-details/${slug}`)}
        className="bg-white border border-blue-600 text-blue-600 px-3 py-1 rounded-full font-semibold my-2 cursor-pointer"
      >
        {batch}
      </button>

      {/* ✅ Render dynamically calculated percentage */}
      <p className="text-gray-600 font-medium">{placement}% Placement</p>
    </div>
  );
}
