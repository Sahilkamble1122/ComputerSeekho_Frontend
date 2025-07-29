import Sidebar from './components/Sidebar';
import Headerbar from './components/Headerbar';

export default function AdminLayout({ children }) {
  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1">
        <Headerbar />
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
