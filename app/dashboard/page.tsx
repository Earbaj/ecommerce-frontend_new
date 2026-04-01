'use client';
import { useAuth } from '@/context/AuthContext';
import { useState, useEffect } from 'react';
import api from '../../lib/axious/axios';
import { Trash2, ShoppingBag, Users, Package } from 'lucide-react';

export default function DashboardPage() {
  const { user } = useAuth();
  const [formData, setFormData] = useState({ title: '', price: '', stock: '', category: '', description: '' });
  const [file, setFile] = useState<File | null>(null);
  
  // ডাটা রাখার জন্য স্টেটস
  const [products, setProducts] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [totalUsers, setTotalUsers] = useState(0);

  // ডাটা ফেচ করা
  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const [prodRes, orderRes] = await Promise.all([
          api.get('/products'),
          api.get('/cart') // আপনার NestJS এ এই এন্ডপয়েন্ট থাকতে হবে
        ]);
        setProducts(prodRes.data.products);
        // যদি ডাটা অ্যারে না হয়ে শুধু একটি অবজেক্ট হয়, তবে তাকে [] এর ভেতর ঢুকিয়ে দিন
      if (orderRes.data && !Array.isArray(orderRes.data)) {
        setOrders([orderRes.data]); 
      } else {
        setOrders(orderRes.data);
      }
        // ধরুন টোটাল ইউজার আপনার ব্যাকএন্ড থেকে আসছে
        setTotalUsers(prodRes.data.totalUsers || 0); 
      } catch (err) {
        console.error("Fetch error", err);
      }
    };
    if (user?.role === 'admin') fetchAdminData();
  }, [user]);

  if (user?.role !== 'admin') {
    return <div className="p-20 text-center text-red-500 font-bold text-2xl">Access Denied!</div>;
  }

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => data.append(key, value));
    if (file) data.append('images', file);

    try {
      await api.post('/products', data);
      alert('Product Added!');
      window.location.reload();
    } catch (err) {
      alert('Upload failed');
    }
  };

  const deleteProduct = async (id: string) => {
    if(confirm("Are you sure?")) {
      await api.delete(`/products/${id}`);
      setProducts(products.filter((p: any) => p._id !== id));
    }
  };

  return (
    <div className="container mx-auto p-6 bg-gray-50 min-h-screen text-black">
      
      {/* ১. স্ট্যাটাস কার্ডস */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-blue-500 flex items-center gap-4">
          <div className="bg-blue-100 p-3 rounded-full"><Package className="text-blue-600" /></div>
          <div><p className="text-gray-500 text-sm">Total Products</p><h3 className="text-2xl font-bold">{products.length}</h3></div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-green-500 flex items-center gap-4">
          <div className="bg-green-100 p-3 rounded-full"><ShoppingBag className="text-green-600" /></div>
          <div><p className="text-gray-500 text-sm">Total Orders</p><h3 className="text-2xl font-bold">{orders.length}</h3></div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-purple-500 flex items-center gap-4">
          <div className="bg-purple-100 p-3 rounded-full"><Users className="text-purple-600" /></div>
          <div><p className="text-gray-500 text-sm">Total Users</p><h3 className="text-2xl font-bold">{totalUsers}</h3></div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        
        {/* ২. প্রোডাক্ট অ্যাড করার ফর্ম */}
        <div className="lg:col-span-1">
          <h2 className="text-xl font-bold mb-4">Add New Product</h2>
          <form onSubmit={handleAddProduct} className="bg-white p-6 rounded-xl shadow-md border space-y-4">
            <input type="text" placeholder="Title" className="w-full border p-2 rounded" onChange={(e) => setFormData({...formData, title: e.target.value})} required />
            <div className="grid grid-cols-2 gap-2">
              <input type="number" placeholder="Price" className="border p-2 rounded" onChange={(e) => setFormData({...formData, price: e.target.value})} required />
              <input type="number" placeholder="Stock" className="border p-2 rounded" onChange={(e) => setFormData({...formData, stock: e.target.value})} required />
            </div>
            <input type="text" placeholder="Category ID" className="w-full border p-2 rounded" onChange={(e) => setFormData({...formData, category: e.target.value})} required />
            <textarea placeholder="Description" className="w-full border p-2 rounded h-24" onChange={(e) => setFormData({...formData, description: e.target.value})}></textarea>
            <input type="file" className="text-sm" onChange={(e) => setFile(e.target.files?.[0] || null)} />
            <button className="w-full bg-blue-600 text-white py-2 rounded-lg font-bold">Upload Product</button>
          </form>
        </div>

        {/* ৩. প্রোডাক্ট ম্যানেজমেন্ট টেবিল */}
        <div className="lg:col-span-2">
          <h2 className="text-xl font-bold mb-4">Manage Products</h2>
          <div className="bg-white rounded-xl shadow-md overflow-hidden border">
            <table className="w-full text-left">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-4">Product</th>
                  <th className="p-4">Price</th>
                  <th className="p-4">Stock</th>
                  <th className="p-4">Action</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p: any) => (
                  <tr key={p._id} className="border-t hover:bg-gray-50">
                    <td className="p-4 flex items-center gap-3">
                      <img src={`http://localhost:3000${p.images[0]}`} className="w-10 h-10 object-cover rounded" alt="" />
                      <span className="font-medium truncate w-32">{p.title}</span>
                    </td>
                    <td className="p-4 text-blue-600 font-bold">${p.price}</td>
                    <td className="p-4">{p.stock}</td>
                    <td className="p-4">
                      <button onClick={() => deleteProduct(p._id)} className="text-red-500 hover:bg-red-50 p-2 rounded">
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ৪. অর্ডার লিস্ট (নিচে) */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden border text-black">
  <table className="w-full text-left">
    <thead className="bg-gray-800 text-white">
      <tr>
        <th className="p-4">Order ID</th>
        <th className="p-4">User ID</th>
        <th className="p-4">Items</th>
        <th className="p-4">Total Price</th>
        <th className="p-4">Date</th>
      </tr>
    </thead>
    <tbody>
      {orders && orders.length > 0 ? (
        orders.map((order: any) => (
          <tr key={order._id} className="border-t hover:bg-gray-50">
            <td className="p-4 text-xs font-mono text-blue-600">
              #{order._id.slice(-8).toUpperCase()}
            </td>
            <td className="p-4 text-sm text-gray-600">
              {order.userId.slice(-6)}...
            </td>
            <td className="p-4">
              <span className="bg-gray-100 px-2 py-1 rounded text-xs">
                {order.items?.length} items
              </span>
            </td>
            <td className="p-4 font-bold text-green-600">
              ৳{order.totalPrice.toLocaleString()}
            </td>
            <td className="p-4 text-sm text-gray-500">
              {new Date(order.createdAt).toLocaleDateString()}
            </td>
          </tr>
        ))
      ) : (
        <tr>
          <td colSpan={5} className="p-10 text-center text-gray-400">
            No orders found.
          </td>
        </tr>
      )}
    </tbody>
  </table>
</div>

    </div>
  );
}