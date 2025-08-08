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
    <div className="text-center my-10 px-8 overflow-hidden">
      <h2 className="text-4xl font-bold text-blue-900 mb-6">
        Major Recruiters
      </h2>

      {/* Scrolling logos container */}
      <div className="relative w-full overflow-hidden">
        <div className="animate-scroll flex whitespace-nowrap gap-16">
          {recruiters.concat(recruiters).map((logo, i) => (
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
      </div>

      <Link
        href="/home/recruiters"
        className="mt-8 inline-block bg-red-600 text-white font-semibold px-6 py-2 rounded hover:bg-blue-900 transition"
      >
        SEE MORE
      </Link>
    </div>
  );
}
