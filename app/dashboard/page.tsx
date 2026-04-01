'use client';
import { useAuth } from '@/context/AuthContext';
import { useState } from 'react';
import api from '../../lib/axious/axios';

export default function DashboardPage() {
  const { user } = useAuth();
  const [formData, setFormData] = useState({ title: '', price: '', stock: '', category: '', description: '' });
  const [file, setFile] = useState<File | null>(null);

  if (user?.role !== 'admin') {
    return <div className="p-20 text-center text-red-500 font-bold text-2xl">Access Denied! Only Admins can enter.</div>;
  }

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = new FormData();
    data.append('title', formData.title);
    data.append('price', formData.price);
    data.append('stock', formData.stock);
    data.append('category', formData.category); // ক্যাটাগরি আইডি দিতে হবে
    data.append('description', formData.description);
    if (file) data.append('images', file); // 'images' কি-টা আপনার ব্যাকএন্ডের Multer ফিল্ডের সাথে মিলতে হবে

    try {
      await api.post('/products', data);
      alert('Product Added Successfully!');
      window.location.reload(); // পেজ রিফ্রেশ করে নতুন প্রোডাক্ট দেখাবে
    } catch (err) {
      alert('Failed to add product');
    }
  };

  return (
    <div className="container mx-auto p-10">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard - Add Product</h1>
      
      <form onSubmit={handleAddProduct} className="bg-white p-8 rounded-xl shadow-lg border max-w-2xl mb-10">
        <div className="grid grid-cols-2 gap-4">
          <input type="text" placeholder="Product Title" className="border p-2 rounded text-black" onChange={(e) => setFormData({...formData, title: e.target.value})} required />
          <input type="number" placeholder="Price" className="border p-2 rounded text-black" onChange={(e) => setFormData({...formData, price: e.target.value})} required />
          <input type="number" placeholder="Stock" className="border p-2 rounded text-black" onChange={(e) => setFormData({...formData, stock: e.target.value})} required />
          <input type="text" placeholder="Category ID" className="border p-2 rounded text-black" onChange={(e) => setFormData({...formData, category: e.target.value})} required />
        </div>
        <textarea placeholder="Description" className="w-full border p-2 rounded mt-4 text-black" onChange={(e) => setFormData({...formData, description: e.target.value})}></textarea>
        <input type="file" className="mt-4" onChange={(e) => setFile(e.target.files?.[0] || null)} />
        <button className="w-full bg-blue-600 text-white py-3 rounded-lg mt-6 font-bold hover:bg-blue-700">Upload Product</button>
      </form>
    </div>
  );
}