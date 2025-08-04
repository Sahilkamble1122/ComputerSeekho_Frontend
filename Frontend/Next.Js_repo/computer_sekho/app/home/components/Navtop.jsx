'use client';

import Link from "next/link";

const Navtop = () => {
  return (
    <div className="w-full h-[50px] flex items-stretch relative z-10 overflow-hidden text-sm font-medium">
      {/* Red Section with Slanted End */}
      <div className="flex-1 bg-red-600 text-white flex items-center justify-center relative z-40 -mr-[25px]">
        <span>HAVE ANY QUESTION ? +880 5698 598 6587</span>
      </div>

      {/* Slanted Diagonal Divider */}
      <div className="relative w-[50px] z-50">
        {/* Left dark blue edge */}
        <div className="absolute inset-0 bg-[#2c285e] clip-blue-left z-10" />
        {/* Wider white diagonal */}
        <div className="absolute inset-0 bg-white clip-white-center z-20" />
        {/* Red fill to remove gap (no right blue strip now) */}
        <div className="absolute inset-0 bg-red-600  z-30" />
      </div>

      {/* Blue Section */}
      <div className="w-[250px] bg-[#2c285e] text-white flex items-center justify-end pr-10 space-x-6 z-40">
        <Link href="/login" className="hover:underline">LOGIN</Link>
      </div>

      {/* Custom CSS Clip Paths */}
      <style jsx>{`
        .clip-blue-left {
          clip-path: polygon(0 0, 5% 0, 55% 100%, 50% 100%);
        }

        .clip-white-center {
          clip-path: polygon(5% 0, 40% 0, 95% 100%, 55% 100%);
        }

        .clip-red-fix {
          clip-path: polygon(40% 0, 100% 0, 100% 100%, 95% 100%);
        }
      `}</style>
    </div>
  );
};

export default Navtop;
