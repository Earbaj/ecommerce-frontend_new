'use client';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { ShoppingCart, LogOut } from 'lucide-react';

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="flex items-center justify-between px-10 py-4 bg-white shadow-sm">
      <Link href="/" className="text-2xl font-bold text-blue-600">MyStore</Link>
      
      <div className="flex items-center gap-6">
        {user ? (
          <>
            <Link href="/dashboard" className="hover:text-blue-600 font-medium">Dashboard</Link>
            <Link href="/cart" className="hover:text-blue-600"><ShoppingCart size={22} /></Link>
            <button onClick={logout} className="text-red-500 flex items-center gap-1 font-medium">
              <LogOut size={18}/> Logout
            </button>
          </>
        ) : (
          <div className="flex gap-4">
            <Link href="/login" className="px-4 py-2 border rounded-lg">Login</Link>
            <Link href="/register" className="px-4 py-2 bg-blue-600 text-white rounded-lg">Register</Link>
          </div>
        )}
      </div>
    </nav>
  );
}