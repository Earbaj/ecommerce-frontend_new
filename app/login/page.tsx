"use client";
import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";

export default function Login() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const router = useRouter();

  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const res = await fetch("http://localhost:3000/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    if (res.ok) {
      const data = await res.json();
      // Token বা User data localStorage-এ সেভ করে রাখা ভালো
      localStorage.setItem("user", JSON.stringify(data)); 
      router.push("/dashboard");
    } else {
      alert("Invalid Credentials!");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <form onSubmit={handleLogin} className="p-8 border rounded shadow-md">
        <h2 className="text-2xl mb-4">Login</h2>
        <input 
          type="email" placeholder="Email" className="border p-2 mb-2 w-full"
          onChange={(e) => setFormData({...formData, email: e.target.value})} 
        />
        <input 
          type="password" placeholder="Password" className="border p-2 mb-4 w-full"
          onChange={(e) => setFormData({...formData, password: e.target.value})} 
        />
        <button type="submit" className="bg-green-500 text-white p-2 w-full">Login</button>
      </form>
    </div>
  );
}