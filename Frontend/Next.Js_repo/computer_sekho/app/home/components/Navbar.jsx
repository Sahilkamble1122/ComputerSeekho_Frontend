"use client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [isCoursesOpen, setIsCoursesOpen] = useState(false);
  const [isPlacementsOpen, setIsPlacementsOpen] = useState(false);

  const coursesRef = useRef(null);
  const placementsRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (coursesRef.current && !coursesRef.current.contains(event.target)) {
        setIsCoursesOpen(false);
      }
      if (
        placementsRef.current &&
        !placementsRef.current.contains(event.target)
      ) {
        setIsPlacementsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header
      className={`w-full z-40 transition-colors duration-300 ${
        scrolled
          ? "bg-white bg-opacity-50 backdrop-blur-md shadow-md fixed"
          : "bg-gray-200"
      }`}
    >
      <div className="container mx-auto flex items-center justify-between py-4 px-4 h-[73px]">
        {/* Logo */}
        <div className="flex items-center space-x-2 h-[50px]">
          <Image
            src="/vita_logo.png"
            alt="logo"
            height={80}
            width={80}
            className="h-[70px] w-[70px] object-contain -my-2"
          />
        </div>

        {/* Nav Links - centered with space */}
        <nav className="flex-1 flex justify-center">
          <div className="flex space-x-8 text-black font-medium items-center">
            <Link href="/home" className="hover:text-blue-600">
              Home
            </Link>

            {/* Placements Dropdown */}
            <div className="relative" ref={placementsRef}>
              <button
                onClick={() => setIsPlacementsOpen(!isPlacementsOpen)}
                className="hover:text-blue-600"
              >
                Placements
              </button>
              {isPlacementsOpen && (
                <div className="absolute top-full left-0 mt-6 w-48 bg-white border border-gray-200 shadow-md z-50">
                  <Link
                    href="/placements"
                    className="block px-4 py-2 hover:text-blue-400"
                  >
                    Batch Wise
                  </Link>
                  <Link
                    href="/home/recruiters"
                    className="block px-4 py-2 hover:text-blue-400"
                  >
                    Recruiters
                  </Link>
                </div>
              )}
            </div>

            {/* Courses Dropdown */}
            <div className="relative" ref={coursesRef}>
              <button
                onClick={() => setIsCoursesOpen(!isCoursesOpen)}
                className="hover:text-blue-600"
              >
                Courses
              </button>
              {isCoursesOpen && (
                <div className="absolute top-full left-0 mt-6 w-40 bg-white border border-gray-200 shadow-md z-50">
                  <Link
                    href="/courses"
                    className="block px-4 py-2 hover:text-blue-400"
                  >
                    Courses
                  </Link>
                  <Link
                    href="/courses/details"
                    className="block px-4 py-2 hover:text-blue-400"
                  >
                    Course Details
                  </Link>
                </div>
              )}
            </div>

            <Link href="/gallery" className="hover:text-blue-600">
              Gallery
            </Link>
            <Link href="/faculty" className="hover:text-blue-600">
              Faculty
            </Link>
            <Link href="/getintouch" className="hover:text-blue-600">
              Get In Touch
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
