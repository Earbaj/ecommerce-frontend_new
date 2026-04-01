'use client';
import { useAuth } from '@/context/AuthContext';
import ProductList from '../components/Navbar'; // আপনার আগের প্রোডাক্ট গ্রিড কোডটি এখানে আলাদা ফাইল করে নিতে পারেন

export default function HomePage() {
  const { user, loading } = useAuth();

  if (loading) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="container mx-auto p-10">
      {user ? (
        <div className="mb-10 p-6 bg-blue-50 border border-blue-200 rounded-2xl">
          <h1 className="text-3xl font-bold text-blue-800">Welcome Back, User! 👋</h1>
          <p className="text-blue-600 mt-2">You are now in your Dashboard. Start shopping or manage your orders.</p>
        </div>
      ) : (
        <div className="text-center mb-10">
          <h1 className="text-4xl font-extrabold text-gray-900">Discover Our Collection</h1>
          <p className="text-gray-500 mt-2">Login to enjoy member-only discounts and faster checkout!</p>
        </div>
      )}

      {/* প্রোডাক্ট লিস্ট সব সময় দেখাবে অথবা আপনার ইচ্ছে মতো কন্ডিশন দিতে পারেন */}
      <ProductList /> 
    </div>
  );
}