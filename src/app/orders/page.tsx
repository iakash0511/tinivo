"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { client } from "@/lib/sanity.client"
import { motion } from "framer-motion"

export default function OrderTrackingPage() {
  const [orderId, setOrderId] = useState("")
  const [order, setOrder] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleTrack = async () => {
    if (!orderId.trim()) return
    setLoading(true)
    setError("")
    setOrder(null)
    try {
      const data = await client.fetch(
        `*[_type == "order" && orderId == $orderId][0]`,
        { orderId }
      )
      if (!data) setError("Order not found. Please check your ID.")
      setOrder(data)
    } catch {
      setError("Something went wrong. Please try again later.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen flex justify-center px-4 py-12">
      <div className="bg-white rounded-3xl shadow-md p-8 w-full max-w-lg">
        <h1 className="text-2xl font-heading text-center text-neutral-dark mb-4">
          Track Your Order 🚚
        </h1>
        <p className="text-sm text-neutral-600 text-center mb-6">
          Enter your <span className="font-semibold">Order ID</span> to check the current status of your order.
        </p>

        <div className="flex gap-2 mb-6">
          <Input
            placeholder="Enter Order ID (e.g. TNV12345)"
            value={orderId}
            onChange={(e) => setOrderId(e.target.value)}
            className="flex-1"
          />
          <Button
            onClick={handleTrack}
            className="bg-primary text-white font-cta hover:opacity-90"
          >
            {loading ? "Checking..." : "Track"}
          </Button>
        </div>

        {error && (
          <p className="text-red-500 text-center font-body">{error}</p>
        )}

        {order && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 bg-neutral-light rounded-xl p-5"
          >
            <h2 className="text-lg font-heading text-primary mb-3">
              Order Details
            </h2>
            <p className="font-body text-sm text-neutral-700 mb-1">
              <span className="font-semibold">Name:</span> {order.customerName}
            </p>
            <p className="font-body text-sm text-neutral-700 mb-1">
              <span className="font-semibold">Status:</span>{" "}
              <span
                className={`${
                  order.shippingStatus === "delivered"
                    ? "text-green-600"
                    : order.shippingStatus === "shipped"
                    ? "text-blue-600"
                    : order.shippingStatus === "packed"
                    ? "text-yellow-600"
                    : "text-gray-500"
                }`}
              >
                {order.shippingStatus || "Pending"}
              </span>
            </p>
            <p className="font-body text-sm text-neutral-700 mb-1">
              <span className="font-semibold">Total:</span> ₹{order.total}
            </p>
            <p className="font-body text-sm text-neutral-700 mb-1">
              <span className="font-semibold">Email:</span> {order.email}
            </p>
            <p className="font-body text-sm text-neutral-700 mb-3">
              <span className="font-semibold">Phone:</span> {order.phone}
            </p>

            {order.trackingUrl && (
              <a
                href={order.trackingUrl}
                target="_blank"
                className="inline-block mt-2 font-cta text-sm text-primary hover:underline"
              >
                View Detailed Tracking →
              </a>
            )}
          </motion.div>
        )}
      </div>
    </main>
  )
}
