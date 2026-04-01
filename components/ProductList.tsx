'use client';
import { useEffect, useState } from 'react';
import api from '../lib/axious/axios';

export default function ProductList() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    api.get('/products').then(res => setProducts(res.data.products));
  }, []);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
      {products.map((p: any) => (
        <div key={p._id} className="border p-4 rounded-lg bg-white shadow-sm">
          <img src={`http://localhost:3000${p.images[0]}`} className="h-40 w-full object-cover rounded" />
          <h3 className="font-bold mt-2 text-black">{p.title}</h3>
          <p className="text-blue-600 font-bold">${p.price}</p>
          <button className="mt-2 w-full bg-black text-white py-2 rounded text-sm">Add to Cart</button>
        </div>
      ))}
    </div>
  );
}