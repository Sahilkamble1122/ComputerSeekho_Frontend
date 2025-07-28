import { Home, FileText, Image, Users, ClipboardCheck } from 'lucide-react';

const navItems = [
  { name: 'Dashboard', icon: <Home />, path: '#' },
  { name: 'Enquiries', icon: <FileText />, path: '#' },
  { name: 'Follow Ups', icon: <ClipboardCheck />, path: '#' },
  { name: 'Gallery', icon: <Image />, path: '#' },
  { name: 'Placements', icon: <Users />, path: '#' },
];

export default function Sidebar() {
  return (
    <aside className="w-64 min-h-screen bg-gray-900 text-white p-4 shadow-md">
      <h2 className="text-2xl font-bold mb-8 text-center">Admin Panel</h2>
      <nav className="space-y-4">
        {navItems.map((item) => (
          <a
            key={item.name}
            href={item.path}
            className="flex items-center gap-3 px-4 py-2 rounded hover:bg-gray-700 transition"
          >
            {item.icon}
            <span>{item.name}</span>
          </a>
        ))}
      </nav>
    </aside>
  );
}