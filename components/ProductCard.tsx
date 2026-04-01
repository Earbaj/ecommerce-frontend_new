'use client';
import api from '../lib/axious/axios';;

export default function ProductCard({ product }: { product: any }) {
  const handleAddToCart = async () => {
    try {
      await api.post('/cart/add', {
        productId: product._id,
        quantity: 1
      });
      alert('Added to Cart!');
    } catch (err) {
      alert('Please Login first!');
    }
  };

  return (
    <div className="border p-4 rounded-xl shadow-sm bg-white">
      <img src={`http://localhost:3000${product.images[0]}`} className="h-40 w-full object-cover rounded" />
      <h3 className="font-bold mt-2 text-black">{product.title}</h3>
      <p className="text-blue-600 font-bold">${product.price}</p>
      <button 
        onClick={handleAddToCart}
        className="mt-3 w-full bg-black text-white py-2 rounded-lg hover:bg-gray-800 transition"
      >
        Add to Cart
      </button>
    </div>
  );
}