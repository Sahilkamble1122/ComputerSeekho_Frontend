'use client';

import Link from "next/link";

const Navtop = () => {
  return (
    <div className="w-full h-[50px] relative overflow-hidden">
      {/* Red Section - Full width background */}
      <div className="absolute inset-0 bg-red-500"></div>
      
      {/* White diagonal separator */}
      <div className="absolute right-0 top-0 h-full w-[420px] bg-white" 
           style={{
             clipPath: 'polygon(60px 0, 100% 0, 100% 100%, 40px 100%)'
           }}>
      </div>
      
      {/* Blue Section with diagonal cut */}
      <div className="absolute right-0 top-0 h-full w-[400px] bg-[#1e3a8a]" 
           style={{
             clipPath: 'polygon(80px 0, 100% 0, 100% 100%, 60px 100%)'
           }}>
      </div>
      
      {/* Content Layer */}
      <div className="relative z-10 h-full flex items-center">
        {/* Red Section Content */}
        <div className="flex-1 flex items-center pl-6 text-white">
          <span className="text-sm font-medium">HAVE ANY QUESTION ? +880 5698 598 6587</span>
        </div>
        
        {/* Blue Section Content */}
        <div className="w-[400px] flex items-center justify-end pr-8 space-x-8 text-white">
          <Link href="/login" className="text-sm font-medium hover:text-gray-300 transition-colors uppercase tracking-wide">
            LOGIN
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Navtop;
