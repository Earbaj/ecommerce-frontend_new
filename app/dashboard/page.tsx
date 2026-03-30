"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState<{ email: string } | null>(null);

  // পেজ লোড হওয়ার সময় ইউজার লগইন করা আছে কিনা চেক করা
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      // যদি লগইন করা না থাকে, তবে লগইন পেজে পাঠিয়ে দিন
      router.push("/login");
    }
  }, [router]);

  const handleLogout = () => {
    // ১. লোকাল স্টোরেজ থেকে ডেটা রিমুভ করা
    localStorage.removeItem("user");
    localStorage.removeItem("token"); // যদি টোকেন থাকে

    // ২. হোমপেজে পাঠিয়ে দেওয়া
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-gray-100 p-10">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-xl shadow-md">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Welcome to Dashboard!</h1>
            <p className="text-gray-600 mt-2">
              Hello, <span className="font-semibold text-blue-600">{user?.email || "User"}</span>! 
              You have successfully logged in.
            </p>
          </div>
          
          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg font-medium transition duration-200 shadow-sm"
          >
            Logout
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          <div className="p-6 bg-blue-50 rounded-lg border border-blue-100">
            <h3 className="font-bold text-blue-800">Profile Info</h3>
            <p className="text-sm text-blue-600 mt-1">Manage your account settings here.</p>
          </div>
          <div className="p-6 bg-green-50 rounded-lg border border-green-100">
            <h3 className="font-bold text-green-800">Analytics</h3>
            <p className="text-sm text-green-600 mt-1">Check your recent activities.</p>
          </div>
        </div>
      </div>
    </div>
  );
}