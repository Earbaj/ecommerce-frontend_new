'use client';
import { useAuth } from '@/context/AuthContext';
import DashboardPage from './dashboard/page'; // আপনার ড্যাশবোর্ড পেজটি ইমপোর্ট করুন
import ProductList from '../components/ProductList'; // আপনার প্রোডাক্ট লিস্ট কম্পোনেন্ট (যদি থাকে)

export default function HomePage() {
  const { user, loading } = useAuth();

  if (loading) return <p className="text-center mt-10 text-black">Loading...</p>;

  // ১. ইউজার যদি ADMIN হয়, তবে সরাসরি ড্যাশবোর্ড পেজটি রেন্ডার করবে
  if (user && user.role === 'admin') {
    return <DashboardPage />;
  }

  // ২. ইউজার যদি সাধারণ CUSTOMER বা লগইন করা না থাকে, তবে নিচের শপ পেজ দেখাবে
  return (
    <div className="container mx-auto p-10 text-black">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-extrabold text-gray-900">Discover Our Collection</h1>
        <p className="text-gray-500 mt-2">
          {user ? `Welcome back, ${user.name}!` : "Login to start shopping!"}
        </p>
      </div>

      {/* এখানে আপনার প্রোডাক্ট দেখানোর কোড বা কম্পোনেন্ট */}
      <ProductList /> 
    </div>
  );
}