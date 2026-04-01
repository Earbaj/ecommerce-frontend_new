'use client';
import { useEffect, useState } from 'react';
import api from '../lib/axious/axios';;

export default function HomePage() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      const res = await api.get('/products');
      setProducts(res.data.products); // আমাদের API { products: [], total: ... } রিটার্ন করে
    };
    fetchProducts();
  }, []);

  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold mb-6">Our Latest Products</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product: any) => (
          <div key={product._id} className="border p-4 rounded-lg shadow hover:shadow-lg transition">
            <img 
              src={`http://localhost:3000${product.images[0]}`} 
              alt={product.title} 
              className="w-full h-48 object-cover rounded"
            />
            <h3 className="mt-2 font-semibold text-lg">{product.title}</h3>
            <p className="text-blue-600 font-bold">${product.price}</p>
            <button className="mt-3 w-full bg-black text-white py-2 rounded">Add to Cart</button>
          </div>
        ))}
      </div>
    </div>
  );
}