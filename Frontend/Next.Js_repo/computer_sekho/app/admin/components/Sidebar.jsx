'use client'; // needed for interactivity in App Router

import { useState, useEffect } from 'react';
import { FileText, Image, Users, ClipboardCheck, ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';

const navItems = [
  { name: 'Follow Ups', icon: ClipboardCheck, path: '/admin' },
  { name: 'Enquiries', icon: FileText, path: '/admin/enquiry' },
  { name: 'Gallery', icon: Image, path: '/admin/gallery' },
  { name: 'Placements', icon: Users, path: '/admin/placements' },
];

export default function Sidebar({ admin }) {
  const [collapsed, setCollapsed] = useState(false);
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setCollapsed(true);
      } else {
        setCollapsed(false);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <aside
      className={`bg-gray-900 text-white shadow-md transition-all duration-300 ${
        collapsed ? 'w-20' : 'w-64'
      } min-h-screen p-4 relative`}
    >
      {/* Collapse Toggle Button */}
      <button
        className="absolute top-4 -right-4 bg-gray-700 text-white p-1 rounded-full"
        onClick={() => setCollapsed(!collapsed)}
      >
        {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
      </button>

      {/* Admin Info */}
      <div className="flex flex-col items-center mb-8 mt-4">
        <img
          src={admin?.photo || '/default-profile.png'}
          alt="Admin"
          className="w-12 h-12 rounded-full border mb-2"
        />
        {!collapsed && (
          <p className="text-sm font-medium text-center">{admin?.name || 'Admin Name'}</p>
        )}
      </div>

      {/* Navigation */}
      <nav className="space-y-4 mt-6">
        {navItems.map((item) => (
          <Link
            key={item.name}
            href={item.path}
            className="flex items-center gap-3 px-4 py-2 rounded hover:bg-gray-700 transition"
          >
            <item.icon size={20} />
            {!collapsed && <span>{item.name}</span>}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
