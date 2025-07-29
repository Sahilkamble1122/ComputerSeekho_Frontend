import React from 'react'
import { Bell, UserCircle } from 'lucide-react';

const Headerbar = () => {
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
        <button className="hover:text-blue-600 transition">
          <UserCircle size={24} />
        </button>
      </div>
    </header>
  )
}

export default Headerbar;
