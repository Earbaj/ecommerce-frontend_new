'use client';
import { useState } from 'react';
import api from '../../lib/axious/axios';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/auth/register', formData);
      alert('Registration Successful! Please login.');
      router.push('/login');
    } catch (err) {
      alert('Registration Failed!');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh]">
      <form onSubmit={handleRegister} className="p-8 bg-white shadow-xl rounded-2xl w-96 border">
        <h2 className="text-3xl font-bold mb-6 text-center">Join Us</h2>
        <input 
          type="text" placeholder="Full Name" 
          className="w-full p-3 border rounded-lg mb-4 text-black focus:outline-blue-500"
          onChange={(e) => setFormData({...formData, name: e.target.value})} 
        />
        <input 
          type="email" placeholder="Email" 
          className="w-full p-3 border rounded-lg mb-4 text-black focus:outline-blue-500"
          onChange={(e) => setFormData({...formData, email: e.target.value})} 
        />
        <input 
          type="password" placeholder="Password" 
          className="w-full p-3 border rounded-lg mb-6 text-black focus:outline-blue-500"
          onChange={(e) => setFormData({...formData, password: e.target.value})} 
        />
        <button className="w-full bg-blue-600 text-white p-3 rounded-lg font-bold hover:bg-blue-700 transition">
          Sign Up
        </button>
      </form>
    </div>
  );
}