'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ShoppingCart, User, LogOut } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // চেক করা ইউজার লগইন কি না
    setIsLoggedIn(!!localStorage.getItem('token'));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    router.push('/login');
  };

  return (
    <nav className="flex items-center justify-between px-10 py-4 bg-white shadow-md sticky top-0 z-50">
      <Link href="/" className="text-2xl font-bold text-blue-600">MyStore</Link>
      
      <div className="flex items-center gap-6">
        <Link href="/" className="hover:text-blue-600">Home</Link>
        <Link href="/cart" className="relative hover:text-blue-600">
          <ShoppingCart size={24} />
          {/* কার্ট কাউন্ট পরে যোগ করব */}
        </Link>

        {isLoggedIn ? (
          <button onClick={handleLogout} className="flex items-center gap-1 text-red-500 font-medium">
            <LogOut size={20} /> Logout
          </button>
        ) : (
          <div className="flex gap-4">
            <Link href="/login" className="px-4 py-2 border rounded hover:bg-gray-100">Login</Link>
            <Link href="/register" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Register</Link>
          </div>
        )}
      </div>
    </nav>
  );
}