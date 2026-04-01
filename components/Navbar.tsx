'use client';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext'; // useContext হুকটি ইমপোর্ট করুন
import { ShoppingCart, LogOut, LayoutDashboard } from 'lucide-react';

export default function Navbar() {
  const { user, logout } = useAuth(); // AuthContext থেকে ইউজার এবং লগআউট ফাংশন নিন

  return (
    <nav className="flex items-center justify-between px-10 py-4 bg-white shadow-md sticky top-0 z-50 text-black">
      {/* লোগো */}
      <Link href="/" className="text-2xl font-bold text-blue-600">MyStore</Link>
      
      <div className="flex items-center gap-6">
        <Link href="/" className="hover:text-blue-600 font-medium">Home</Link>

        {/* যদি ইউজার লগইন থাকে */}
        {user ? (
          <>
            {/* যদি ইউজার এডমিন হয় তবে ড্যাশবোর্ড লিঙ্ক দেখাবে */}
            {user.role === 'admin' && (
              <Link href="/dashboard" className="flex items-center gap-1 hover:text-blue-600 font-medium">
                <LayoutDashboard size={20} /> Dashboard
              </Link>
            )}

            <Link href="/cart" className="hover:text-blue-600">
              <ShoppingCart size={22} />
            </Link>

            {/* লগআউট বাটন */}
            <button 
              onClick={logout} 
              className="flex items-center gap-1 text-red-500 font-bold hover:text-red-700 transition"
            >
              <LogOut size={20} /> Logout
            </button>
          </>
        ) : (
          /* যদি ইউজার লগইন না থাকে তবে এই বাটনগুলো দেখাবে */
          <div className="flex gap-4">
            <Link href="/login" className="px-4 py-2 border rounded-lg hover:bg-gray-100 transition">
              Login
            </Link>
            <Link href="/register" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
              Register
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}