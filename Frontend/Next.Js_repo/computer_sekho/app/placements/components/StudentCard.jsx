"use client";
import Image from "next/image";

export default function StudentCard({ name, company, photo }) {
  return (
    <div className="border rounded-xl shadow-md overflow-hidden flex flex-col">
      {/* ✅ Full-width image at top, no circle */}
      <div className="relative w-full h-48">
        <Image src={photo} alt={name} fill className="object-cover" />
      </div>

      <div className="p-4 text-center">
        <h3 className="font-semibold text-lg text-blue-900">{name}</h3>
        <p className="text-sm text-gray-600">{company}</p>
      </div>
    </div>
  );
}
