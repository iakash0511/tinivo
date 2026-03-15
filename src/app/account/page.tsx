"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

interface UserProfile {
    _id: string;
    name: string;
    email: string;
    phone: string;
    address?: string;
    phoneVerified: boolean;
}

export default function AccountPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [profile, setProfile] = useState<UserProfile | null>(null);

    // Editable fields
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [address, setAddress] = useState("");

    const [orders, setOrders] = useState<any[]>([]);

    useEffect(() => {
        const fetchProfileData = async () => {
            const token = localStorage.getItem("token");
            if (!token) {
                router.push("/login");
                return;
            }

            try {
                const [userRes, ordersRes] = await Promise.all([
                    fetch("/api/user", { headers: { Authorization: `Bearer ${token}` } }),
                    fetch("/api/user/orders", { headers: { Authorization: `Bearer ${token}` } })
                ]);

                if (userRes.status === 401 || ordersRes.status === 401) {
                    localStorage.removeItem("token");
                    router.push("/login");
                    return;
                }

                const userData = await userRes.json();
                if (userData.user) {
                    setProfile(userData.user);
                    setName(userData.user.name || "");
                    setPhone(userData.user.phone || "");
                    setAddress(userData.user.address || "");
                }

                const ordersData = await ordersRes.json();
                if (ordersData.orders) {
                    setOrders(ordersData.orders);
                }
            } catch (err) {
                console.error("Failed to load profile data", err);
            } finally {
                setLoading(false);
            }
        };

        fetchProfileData();
    }, [router]);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);

        try {
            const token = localStorage.getItem("token");
            const res = await fetch("/api/user", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ name, phone, address }),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Update failed");

            toast.success("Profile updated successfully!");
            setProfile(data.user);
        } catch (error: any) {
            toast.error(error.message);
        } finally {
            setSaving(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        router.push("/login");
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-neutral-50">
                <div className="text-gray-500">Loading your profile...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-neutral-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto space-y-8 animate-fadeInUp">

                <div className="flex justify-between items-center bg-white p-6 rounded-xl shadow-sm">
                    <div>
                        <h1 className="text-3xl font-heading font-bold text-neutral-dark">My Account</h1>
                        <p className="text-sm text-gray-500 mt-1">Manage your details and view exclusive offers.</p>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="px-4 py-2 border border-red-500 text-red-500 rounded-md hover:bg-red-50"
                    >
                        Log out
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Profile Form */}
                    <div className="md:col-span-2 bg-white rounded-xl shadow-sm p-6">
                        <h2 className="text-xl font-bold text-neutral-dark mb-6">Profile Settings</h2>
                        <form onSubmit={handleSave} className="space-y-6">

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Email Address (Read-only)</label>
                                <input
                                    type="email"
                                    disabled
                                    value={profile?.email || ""}
                                    className="mt-1 block w-full px-3 py-2 border border-gray-200 bg-gray-50 rounded-md text-gray-500 sm:text-sm"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Full Name</label>
                                <input
                                    type="text"
                                    required
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary sm:text-sm"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Phone Number {profile?.phoneVerified && <span className="text-green-600 text-xs ml-2">(Verified ✓)</span>}
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary sm:text-sm"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Delivery Address</label>
                                <textarea
                                    rows={3}
                                    value={address}
                                    onChange={(e) => setAddress(e.target.value)}
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary sm:text-sm"
                                    placeholder="Street address, city, zip code..."
                                />
                            </div>

                            <div className="flex justify-end">
                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="px-6 py-2 bg-primary text-white font-medium rounded-md hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors"
                                >
                                    {saving ? "Saving..." : "Save Changes"}
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Promo Codes Widget */}
                    <div className="md:col-span-1 bg-white rounded-xl shadow-sm p-6">
                        <h2 className="text-xl font-bold text-neutral-dark mb-4">My Promo Codes</h2>
                        <div className="space-y-4">
                            <div className="p-4 border border-dashed border-gray-300 rounded-lg text-center text-sm text-gray-500">
                                <p>No active offers assigned directly to you right now.</p>
                                <p className="mt-2 text-xs">Keep an eye out for special seasonal codes!</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* --- Order History --- */}
                <div className="bg-white rounded-xl shadow-sm p-6 mt-8">
                    <h2 className="text-xl font-bold text-neutral-dark mb-6">Order History</h2>
                    
                    {orders.length === 0 ? (
                        <div className="text-center py-8 text-neutral-500 border border-dashed rounded-lg bg-neutral-50">
                            <p>You haven&apos;t placed any orders yet.</p>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {orders.map((order, idx) => (
                                <div key={order._id || idx} className="border border-neutral-200 rounded-lg p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <span className="font-semibold font-heading text-neutral-800">
                                                Order #{order.orderId?.substring(order.orderId.length - 8).toUpperCase() || "N/A"}
                                            </span>
                                            <span className={`px-2 py-0.5 text-xs rounded-full font-medium ${
                                                order.shippingStatus === 'delivered' ? 'bg-green-100 text-green-700' : 
                                                order.shippingStatus === 'shipped' ? 'bg-blue-100 text-blue-700' : 
                                                'bg-yellow-100 text-yellow-700'
                                            }`}>
                                                {order.shippingStatus ? order.shippingStatus.charAt(0).toUpperCase() + order.shippingStatus.slice(1) : "Pending"}
                                            </span>
                                        </div>
                                        
                                        <div className="text-sm text-neutral-500 mb-3 space-y-1">
                                            <p>Placed: {new Date(order._createdAt).toLocaleDateString()}</p>
                                            <p>Payment: <span className="capitalize">{order.paymentStatus === "cod" ? "Cash On Delivery" : order.paymentStatus || "Pending"}</span></p>
                                        </div>

                                        {/* Items */}
                                        <ul className="space-y-1">
                                            {order.items?.map((item: any, i: number) => (
                                                <li key={i} className="text-sm text-neutral-700 flex items-center gap-2">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-neutral-300"></span>
                                                    {item.name} <span className="text-neutral-500">(x{item.quantity})</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>

                                    <div className="md:text-right mt-2 md:mt-0 pt-4 md:pt-0 border-t md:border-t-0 border-neutral-100">
                                        <p className="text-neutral-500 text-sm mb-1">Total Amount</p>
                                        <p className="text-xl font-bold text-neutral-dark">₹{order.total?.toFixed(2)}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
}
