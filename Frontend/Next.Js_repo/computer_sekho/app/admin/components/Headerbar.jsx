import React from 'react'
import { Bell, UserCircle } from 'lucide-react';

const Headerbar = () => {
  return (
         <header className="bg-gray-800 text-white flex items-center justify-between px-6 py-5 shadow-md">
      <div className="text-xl font-bold">SM VITA Admin</div>

      <div className="flex items-center gap-4">
    
        <button className="hover:text-yellow-400 transition">
          <Bell size={20} />
        </button>

        <button className="hover:text-yellow-400 transition">
          <UserCircle size={24} />
        </button>
      </div>
    </header>
  )
}

export default Headerbar