'use client';

import { useState, useEffect } from 'react';
import {
  FileText,
  Image,
  Users,
  ClipboardCheck,
  BookOpen,
  UserCog,
  ChevronLeft,
  ChevronRight,
  CreditCard,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
  { name: 'Follow Ups', icon: ClipboardCheck, path: '/admin' },
  { name: 'Enquiries', icon: FileText, path: '/admin/enquiries' },
  { name: 'Gallery', icon: Image, path: '/admin/gallery/album' },
  { name: 'Placements', icon: Users, path: '/admin/placement' },
  { name: 'Staffs', icon: UserCog, path: '/admin/staffs' },
  { name: 'Courses', icon: BookOpen, path: '/admin/courses' },
  { name: 'Payments', icon: CreditCard, path: '/admin/payments' },
];

export default function Sidebar({ admin }) {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();

   const [adminName, setAdminName] = useState('');
   const [imgPath, setImgPath] = useState('');

  useEffect(() => {
    const storedAdmin = sessionStorage.getItem('admin');
    const img_path = sessionStorage.getItem("img_path");
    if (storedAdmin) {
      try {
          setImgPath(img_path);
        setAdminName(storedAdmin); // assuming { "name": "Kirti Tiwari" }
      } catch (error) {
        console.error('Invalid admin JSON in sessionStorage');
      }
    }
  }, []);




  useEffect(() => {
    const handleResize = () => {
      setCollapsed(window.innerWidth < 768);
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
          src={imgPath || '/default-profile.png'}
          alt="Admin"
          className="w-12 h-12 rounded-full border mb-2"
        />

      
        {!collapsed && (
          
          <p className="text-sm font-medium text-center">{adminName  || 'Admin Name111'}</p>
        )}
      </div>

      {/* Navigation */}
      <nav className="space-y-2 mt-6">
        {navItems.map((item) => {
          const isActive =
            item.path === '/admin'
              ? pathname === '/admin'
              : pathname.startsWith(item.path);

          return (
            <Link
              key={item.name}
              href={item.path}
              className={`flex items-center gap-3 px-4 py-2 rounded transition ${
                isActive ? 'bg-gray-700 font-semibold' : 'hover:bg-gray-700'
              }`}
            >
              <item.icon size={20} />
              {!collapsed && <span>{item.name}</span>}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
