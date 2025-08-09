'use client';

import React, { useState, useEffect } from 'react';
import { Bell, UserCircle, LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';

const Headerbar = () => {
  const [adminName, setAdminName] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const storedAdmin = sessionStorage.getItem('admin');
    if (storedAdmin) {
      setAdminName(storedAdmin);
    }
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showDropdown && !event.target.closest('.dropdown-container')) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showDropdown]);

  const handleLogout = () => {
    // Clear session storage
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('admin');
    sessionStorage.removeItem('img_path');
    
    // Redirect to login page
    router.push('/login');
  };

  return (
    <header className="bg-gray-300 text-gray-800 flex items-center justify-between px-6 py-4 shadow-sm">
      <div className="text-xl font-bold flex items-center gap-2">
        <img src="/vita_logo.png" alt="Logo" className="w-24 h-17 object-contain" />
        {/* <span>VITA College</span> Optional: Add brand name */}
      </div>

      <div className="flex items-center gap-4">
        <button className="hover:text-blue-600 transition">
          <Bell size={20} />
        </button>
        
        <div className="relative dropdown-container">
          <button 
            className="hover:text-blue-600 transition flex items-center gap-2"
            onClick={() => setShowDropdown(!showDropdown)}
          >
            <UserCircle size={24} />
            {adminName && <span className="text-sm">{adminName}</span>}
          </button>
          
          {showDropdown && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-50">
              <div className="py-1">
                <div className="px-4 py-2 text-sm text-gray-700 border-b">
                  Welcome, {adminName}
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 flex items-center gap-2"
                >
                  <LogOut size={16} />
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}

export default Headerbar;
