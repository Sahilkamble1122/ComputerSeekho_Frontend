"use client";
import Image from "next/image";
import { useState } from "react";

export default function StudentCard({ name, photo }) {
  const [imgSrc, setImgSrc] = useState(photo || "/default-profile.png");

  return (
    <div className="border rounded-xl shadow-md overflow-hidden flex flex-col">
      {/* ✅ Full-width image at top, no circle */}
      <div className="relative w-full h-48">
        <Image
          src={imgSrc}
          alt={name}
          fill
          className="object-cover"
          onError={() => setImgSrc("/default-profile.png")}
        />
      </div>

      <div className="p-4 text-center">
        <h3 className="font-semibold text-lg text-blue-900">{name}</h3>
      </div>
    </div>
  );
}
