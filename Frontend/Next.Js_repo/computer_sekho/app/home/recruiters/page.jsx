"use client";
import Image from "next/image";

const recruiters = [
  "/recruiters/atos.png",
  "/recruiters/altair.png",
  "/recruiters/bnp.png",
  "/recruiters/capg.png",
  "/recruiters/financialtech.png",
  "/recruiters/nse.png",
  "/recruiters/tata.png",
  "/recruiters/onmobile.png",
  "/recruiters/3i.png",
  "/recruiters/mindstix.png",
  "/recruiters/carewale.png",
  "/recruiters/hoc.png",
  "/recruiters/63moons.png",
  "/recruiters/hopscotch.png",
  "/recruiters/concerto.png",
  "/recruiters/ccavenue.png",
  "/recruiters/prorigo.png",
  "/recruiters/infrasoft.png",
  "/recruiters/neosoft.png",
  "/recruiters/rolta.png",
  "/recruiters/cybage.png",
  "/recruiters/intellect.png",
  "/recruiters/learningmate.png",
  "/recruiters/logixal.png",
  "/recruiters/vara.png",
  "/recruiters/simeio.png",
  "/recruiters/quantifi.png",
  "/recruiters/greenpoint.png",
  "/recruiters/kinai.png",
  "/recruiters/infintus.png",
  "/recruiters/automation.png",
  "/recruiters/iks.png",
  "/recruiters/amdocs.png",
  "/recruiters/atos.png",
  "/recruiters/aurionpro.png",
  "/recruiters/c2lbiz.png",
  "/recruiters/cdac.png",
  "/recruiters/depronto.png",
  "/recruiters/diebold.png",
  "/recruiters/jio.png",
  "/recruiters/lnt.png",
  "/recruiters/mobilem.png",
  "/recruiters/mobitrail.png",
  "/recruiters/morningstar.png",
  "/recruiters/npci.png",
  "/recruiters/objectedge.png",
  "/recruiters/rajalabs.png",
  "/recruiters/saintgobain.png",
  "/recruiters/sapiens.png",
  "/recruiters/smartstream.png",
  "/recruiters/tavisca.png",
  // Add more logos if needed
];

export default function AllRecruitersPage() {
  return (
    <div className="pt-[150px] py-10 px-4 sm:px-10 lg:px-20">
      <h1 className="text-3xl font-bold text-center text-blue-900 mb-10">
        All Major Recruiters
      </h1>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-x-0 gap-y-6 justify-items-center">
        {recruiters.map((logo, i) => (
          <Image
            key={i}
            src={logo}
            alt={`Recruiter ${i}`}
            width={160}
            height={80}
            className="object-contain"
          />
        ))}
      </div>
    </div>
  );
}

