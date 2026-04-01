'use client';
import { useAuth } from '@/context/AuthContext';
import { useState, useEffect, JSX } from 'react';
import api from '../../lib/axious/axios';
import { Trash2, ShoppingBag, Users, Package } from 'lucide-react';
import React from 'react';

export default function DashboardPage() {
    const { user } = useAuth();
    const [formData, setFormData] = useState({ title: '', price: '', stock: '', category: '', description: '' });
    const [file, setFile] = useState<File | null>(null);

    // ডাটা রাখার জন্য স্টেটস
    const [products, setProducts] = useState<any[]>([]);
    const [orders, setOrders] = useState<any[]>([]);
    const [totalUsers, setTotalUsers] = useState(0);
    const [categories, setCategories] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<any>(null);

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

        try {
            if (!file) {
                alert("Please select an image file!");
                return;
            }

            // --- ধাপ ১: ইমেজ আপলোড ---
            const imageFormData = new FormData();
            imageFormData.append('image', file); // কী (Key) হবে 'image'

            console.log("Uploading image...");
            const uploadRes = await api.post('/products/upload', imageFormData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            // আপনার রেসপন্স যেহেতু {"imageUrl": "..."} তাই সরাসরি এভাবে ধরুন:
            const imageUrl = uploadRes.data.imageUrl;
            console.log("Image upload success! URL:", imageUrl);

            // --- ধাপ ২: প্রোডাক্ট ক্রিয়েট ---
            // আপনার আগের বডি ফরম্যাট অনুযায়ী JSON অবজেক্ট তৈরি
            const productPayload = {
                title: formData.title,
                description: formData.description,
                price: Number(formData.price),
                stock: Number(formData.stock),
                category: formData.category,
                images: [imageUrl] // প্রাপ্ত ইউআরএলটি অ্যারেতে রাখা হলো
            };

            console.log("Creating product with payload:", productPayload);

            // প্রোডাক্ট ক্রিয়েট এপিআই কল
            await api.post('/products', productPayload);

            alert('Product Added Successfully! 🎉');
            window.location.reload(); // লিস্ট আপডেট করার জন্য পেজ রিফ্রেশ

        } catch (err: any) {
            console.error("Operation Failed:", err.response?.data || err.message);
            alert(err.response?.data?.message || "Failed to complete the process");
        }
    };

    const deleteProduct = async (id: string) => {
        if (confirm("Are you sure?")) {
            await api.delete(`/products/${id}`);
            setProducts(products.filter((p: any) => p._id !== id));
        }
    };

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await api.get('/categories'); // আপনার ক্যাটাগরি এপিআই
                setCategories(res.data);
            } catch (err) {
                console.error("Categories fetch error", err);
            }
        };
        fetchCategories();
    }, []);

    const renderCategoryOptions = (categories: any[], prefix = ''): JSX.Element[] => {
        return categories.map((cat: any) => (
            <React.Fragment key={cat._id}>
                <option key={cat._id} value={cat._id}>
                    {prefix}{cat.name}
                </option>
                {cat.children && cat.children.length > 0 && renderCategoryOptions(cat.children, prefix + '-- ')}
            </React.Fragment>
        ));
    };




    // এডিট বাটন ক্লিক করলে যা হবে
    const handleEditClick = (product: any) => {
        setSelectedProduct(product);
        setFormData({
            title: product.title,
            price: product.price,
            stock: product.stock,
            category: product.category,
            description: product.description
        });
        setIsModalOpen(true);
    };

    // আপডেট সাবমিট করার ফাংশন
    const handleUpdateProduct = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const updatePayload = {
                price: Number(formData.price),
                stock: Number(formData.stock)
            };

            // আপনার ডক অনুযায়ী PATCH /products/:id এ অ্যারে পাঠাতে হবে
            await api.patch(`/products/${selectedProduct._id}`, [updatePayload]);

            alert('Product Updated! 🎉');
            setIsModalOpen(false);
            window.location.reload();
        } catch (err) {
            alert('Update failed');
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
                        <input
                            type="text" placeholder="Title"
                            className="w-full border p-2 rounded text-black"
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })} required
                        />

                        <div className="grid grid-cols-2 gap-2">
                            <input
                                type="number" placeholder="Price"
                                className="border p-2 rounded text-black"
                                onChange={(e) => setFormData({ ...formData, price: e.target.value })} required
                            />
                            <input
                                type="number" placeholder="Stock"
                                className="border p-2 rounded text-black"
                                onChange={(e) => setFormData({ ...formData, stock: e.target.value })} required
                            />
                        </div>

                        {/* ক্যাটাগরি ড্রপডাউন */}
                        <select
                            className="w-full border p-2 rounded text-black bg-white"
                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                            required
                            value={formData.category}
                        >
                            <option value="">Select Category</option>
                            {renderCategoryOptions(categories)}
                        </select>

                        <textarea
                            placeholder="Description"
                            className="w-full border p-2 rounded h-24 text-black"
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        ></textarea>

                        <input type="file" className="text-sm" onChange={(e) => setFile(e.target.files?.[0] || null)} />

                        <button className="w-full bg-blue-600 text-white py-2 rounded-lg font-bold hover:bg-blue-700 transition">
                            Upload Product
                        </button>
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
                                            <img src={`http://localhost:4000${p.images[0]}`} className="w-10 h-10 object-cover rounded" alt="" />
                                            <span className="font-medium truncate w-32">{p.title}</span>
                                        </td>
                                        <td className="p-4 text-blue-600 font-bold">${p.price}</td>
                                        <td className="p-4">{p.stock}</td>
                                        <td className="p-4">
                                            {/* এডিট বাটন */}
                                            <button
                                                onClick={() => handleEditClick(p)}
                                                className="text-blue-500 hover:bg-blue-50 p-2 rounded transition"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" /><path d="m15 5 4 4" /></svg>
                                            </button>
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
            <div className="bg-white rounded-xl shadow-md overflow-hidden border text-black mt-6">
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

            {/* --- Edit Product Dialog --- */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[100] p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 relative">
                        <h2 className="text-2xl font-bold mb-4 text-gray-800">Update Product</h2>
                        <p className="text-sm text-gray-500 mb-6">Editing: <span className="font-semibold">{selectedProduct?.title}</span></p>

                        <form onSubmit={handleUpdateProduct} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Price (৳)</label>
                                <input
                                    type="number"
                                    className="w-full border p-2 rounded-lg text-black bg-gray-50 focus:ring-2 focus:ring-blue-500 outline-none"
                                    value={formData.price}
                                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">Stock Quantity</label>
                                <input
                                    type="number"
                                    className="w-full border p-2 rounded-lg text-black bg-gray-50 focus:ring-2 focus:ring-blue-500 outline-none"
                                    value={formData.stock}
                                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                                    required
                                />
                            </div>

                            <div className="flex gap-3 mt-8">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition"
                                >
                                    Save Changes
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

        </div>
    );
}