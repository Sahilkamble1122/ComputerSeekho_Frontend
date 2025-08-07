'use client';

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { FaChevronUp } from "react-icons/fa";

const Footer = () => {
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      setShowButton(window.scrollY > 100);
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <footer className="bg-gray-100 pt-10 relative">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-wrap md:flex-nowrap justify-between gap-10">

            {/* Logo and About */}
            <div className="w-full md:w-[250px]">
              <div className="flex items-center space-x-2 mb-4">
                <Image
                  src="/vita_logo.png"
                  alt="logo"
                  height={50}
                  width={50}
                  className="h-[40px] w-[40px] object-contain -my-2 rounded-full"
                />
                <span className="text-2xl font-bold text-blue-900">SmVita</span>
              </div>
              <p className="text-gray-600 mb-6 text-sm">
                Shriram Mantri Vidyanidhi Info Tech Academy (SM VITA) in Mumbai offers specialized postgraduate diploma courses in Information Technology, including Advanced Computing and Big Data Analytics, with a strong emphasis on practical skills and industry relevance.
              </p>
            </div>

            {/* Information Links */}
            <div className="flex-1 min-w-[180px]">
              <h4 className="text-2xl font-bold mb-3 text-blue-900 ">Information</h4>
              <div className="w-10 h-[2px] bg-gray-400 mb-4"></div>
              <ul className="space-y-2 text-gray-600 text-sm">
                <li><Link href="#">Admission</Link></li>
                <li><Link href="/placements">Placements</Link></li>
                <li><Link href="/faculty">Faculty</Link></li>
                <li><Link href="/gallery">Gallery</Link></li>
              </ul>
            </div>

            {/* Useful Links */}
            <div className="flex-1 min-w-[180px]">
              <h4 className="text-2xl font-bold mb-3 text-blue-900 ">Useful Links</h4>
              <div className="w-10 h-[2px] bg-gray-400 mb-4"></div>
              <ul className="space-y-2 text-gray-600 text-sm">
                <li><Link href="/courses">Our Courses</Link></li>
                <li><Link href="/getintouch">About Us</Link></li>
                <li><Link href="/faculty">Teachers & Faculty</Link></li>
                <li><Link href="#">Teams & Conditions</Link></li>
              </ul>
            </div>

            {/* Get In Touch */}
            <div className="flex-1 min-w-[200px]">
              <h4 className="text-2xl font-bold mb-3 text-blue-900">Get In Touch</h4>
              <div className="w-10 h-[2px] bg-gray-400 mb-4"></div>
              <p className="text-gray-600 text-sm mb-2">
                5th Floor, Vidyanidhi Education Complex, Vidyanidhi Road, Juhu Scheme, Andheri (W), Mumbai 400 049 India
              </p>
              <p className="text-gray-600 text-sm mb-1">090294 35311</p>
              <p className="text-gray-600 text-sm mb-1">9324095272</p>
              <p className="text-gray-600 text-sm mb-1">training@vidyanidhi.com</p>
              <p className="text-gray-600 text-sm">www.vidhyanidhi.com</p>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="bg-indigo-900 text-white mt-20 text-center py-4 text-sm w-full">
          Copyright © <span className="font-semibold">VidhyaNidhi SMVITA</span> 2025. All Right Reserved By <span className="font-semibold">Education</span>.
        </div>
      </footer>

      {/* Scroll to Top Button */}
      {showButton && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-2 right-4 bg-red-600 text-white p-3 rounded-md shadow-md hover:bg-red-700 transition duration-300 z-50"
          aria-label="Scroll to top"
        >
          <FaChevronUp size={18} />
        </button>
      )}
    </>
  );
};

export default Footer;
