"use client";
import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";

export default function Register() {
  const [formData, setFormData] = useState({ email: "", password: "", role: "user" });
  const router = useRouter();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const res = await fetch("http://localhost:3000/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    if (res.ok) {
      alert("Registration Successful!");
      router.push("/login");
    } else {
      alert("Registration Failed!");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <form onSubmit={handleSubmit} className="p-8 border rounded shadow-md">
        <h2 className="text-2xl mb-4">Register</h2>
        <input 
          type="email" placeholder="Email" className="border p-2 mb-2 w-full"
          onChange={(e) => setFormData({...formData, email: e.target.value})} 
        />
        <input 
          type="password" placeholder="Password" className="border p-2 mb-2 w-full"
          onChange={(e) => setFormData({...formData, password: e.target.value})} 
        />
        <select 
          className="border p-2 mb-4 w-full"
          onChange={(e) => setFormData({...formData, role: e.target.value})}
        >
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>
        <button type="submit" className="bg-blue-500 text-white p-2 w-full">Sign Up</button>
      </form>
    </div>
  );
}