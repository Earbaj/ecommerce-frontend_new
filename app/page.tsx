'use client';
import { useEffect, useState } from 'react';
import api from '../lib/axious/axios';

export default function HomePage() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    api.get('/products').then(res => setProducts(res.data.products));
  }, []);

  return (
    <div className="container mx-auto p-10">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {products.map((p: any) => (
          <div key={p._id} className="bg-white border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition">
            <img src={`http://localhost:3000${p.images[0]}`} className="h-56 w-full object-cover" />
            <div className="p-4">
              <h3 className="font-bold text-lg truncate">{p.title}</h3>
              <p className="text-gray-500 text-sm mb-2">{p.category?.name}</p>
              <div className="flex justify-between items-center">
                <span className="text-xl font-bold text-blue-600">${p.price}</span>
                <button className="bg-black text-white px-4 py-2 rounded-lg text-sm hover:bg-gray-800">
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}