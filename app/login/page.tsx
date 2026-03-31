"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Swal from 'sweetalert2';

export default function Login() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const res = await fetch("http://localhost:4000/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json(); // রেসপন্স ডেটা আগে নিন

      if (res.ok) {
        // সফল হলে সুন্দর সাকসেস মেসেজ
        Swal.fire({
          icon: 'success',
          title: 'Login Successful!',
          text: 'Redirecting to dashboard...',
          timer: 2000,
          showConfirmButton: false
        });
        
        localStorage.setItem("user", JSON.stringify(data));
        setTimeout(() => router.push("/dashboard"), 2000);
      } else {
        // সার্ভার থেকে আসা মেসেজ দেখাবে (যেমন: User not found)
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: data.message || "Invalid email or password!",
          confirmButtonColor: '#10b981' // emerald-600
        });
      }
    } catch (error) {
      Swal.fire({
        icon: 'warning',
        title: 'Connection Error',
        text: 'Server is not responding. Please try again later.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className="flex items-center justify-center min-h-screen bg-cover bg-center bg-no-repeat"
      style={{ 
        backgroundImage: "url('https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2069&auto=format&fit=crop')" 
      }}
    >
      {/* Overlay for better readability */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm"></div>

      <div className="relative z-10 w-full max-w-md p-8 bg-white/90 backdrop-blur-md rounded-2xl shadow-2xl border border-white/20">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold text-gray-800">Welcome Back</h2>
          <p className="text-gray-500 mt-2">Please login to your account</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
            <input 
              type="email" 
              required
              placeholder="name@company.com" 
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
              onChange={(e) => setFormData({...formData, email: e.target.value})} 
            />
          </div>

          <div>
            <div className="flex justify-between mb-1">
              <label className="block text-sm font-medium text-gray-700">Password</label>
              <a href="#" className="text-xs text-emerald-600 hover:underline">Forgot password?</a>
            </div>
            <input 
              type="password" 
              required
              placeholder="••••••••" 
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
              onChange={(e) => setFormData({...formData, password: e.target.value})} 
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl shadow-lg transform transition active:scale-95 disabled:bg-emerald-300"
          >
            {loading ? "Signing in..." : "LOGIN"}
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-sm text-gray-600">
            Don't have an account? 
            <Link href="/register" className="ml-1 font-bold text-emerald-600 hover:underline">Sign Up</Link>
          </p>
        </div>
      </div>
    </div>
  );
}