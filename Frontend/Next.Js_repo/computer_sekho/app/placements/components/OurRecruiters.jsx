"use client";
import Image from "next/image";
import Link from "next/link";

const recruiters = [
  "/recruiters/atos.png",
  "/recruiters/altair.png",
  "/recruiters/bnp.png",
  "/recruiters/capg.png",
  "/recruiters/financialtech.png",
  "/recruiters/nse.png",
  "/recruiters/tata.png",
  "/recruiters/onmobile.png",
  // Add more logos if needed
];

export default function OurRecruiters() {
  return (
    <div className="text-center my-10 px-8">
      <h2 className="text-2xl font-bold text-blue-900 mb-6">
        Major Recruiters
      </h2>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-y-8 gap-x-8 justify-items-center">
        {recruiters.slice(0, 8).map((logo, i) => (
          <Image
            key={i}
            src={logo}
            alt={`Recruiter ${i + 1}`}
            width={150}
            height={60}
            className="object-contain"
          />
        ))}
      </div>

      <Link
        href="/recruiters"
        className="mt-8 inline-block bg-red-600 text-white font-semibold px-6 py-2 rounded hover:bg-blue-900 transition"
      >
        SEE MORE
      </Link>
    </div>
  );
}
