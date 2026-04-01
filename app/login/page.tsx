'use client';
import { useState } from 'react';
import api from '../../lib/axious/axios';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await api.post('/auth/login', { email, password });
      localStorage.setItem('token', res.data.access_token); // টোকেন সেভ করা
      alert('Login Successful!');
      router.push('/'); // হোমপেজে পাঠিয়ে দেওয়া
    } catch (err) {
      alert('Login Failed! Check credentials.');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <form onSubmit={handleLogin} className="p-8 bg-white shadow-md rounded-lg border">
        <h2 className="text-2xl font-bold mb-4">Login to Shop</h2>
        <input 
          type="email" placeholder="Email" 
          className="w-full p-2 border mb-3 text-black"
          onChange={(e) => setEmail(e.target.value)} 
        />
        <input 
          type="password" placeholder="Password" 
          className="w-full p-2 border mb-3 text-black"
          onChange={(e) => setPassword(e.target.value)} 
        />
        <button className="w-full bg-blue-600 text-white p-2 rounded">Login</button>
      </form>
    </div>
  );
}