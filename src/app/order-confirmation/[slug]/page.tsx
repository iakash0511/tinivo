"use client"

import { useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCheckCircle } from "@fortawesome/free-solid-svg-icons"
import confetti from "canvas-confetti"
import { useCheckoutStore } from "@/store/checkout/checkout-store"
import { useParams } from "next/navigation"

export default function OrderConfirmation() {
  // Simulate user's name (later we can pull it from checkout data or Zustand store)
  const { checkoutInfo, setCheckoutInfo } = useCheckoutStore()
  const params = useParams()
  const slug = params.slug as string
  const userName = checkoutInfo?.fullName || "Customer"

  useEffect(() => {
    // Confetti celebration burst
    const duration = 2 * 1000
    const end = Date.now() + duration

    const frame = () => {
      confetti({
        particleCount: 4,
        angle: 60,
        spread: 80,
        origin: { x: 0 },
        colors: ["#9D7EDB", "#FFB7D5", "#A2D2FF"]
      })
      confetti({
        particleCount: 4,
        angle: 120,
        spread: 80,
        origin: { x: 1 },
        colors: ["#9D7EDB", "#FFB7D5", "#A2D2FF"], 
      })
      if (Date.now() < end) requestAnimationFrame(frame)
    }
    frame()
  }, [])

  const orderId = slug

  return (
    <main className="min-h-screen flex flex-col justify-center items-center px-6 py-12 text-center">
      <div className="bg-white rounded-3xl shadow-md p-8 max-w-md w-full space-y-6">
        <FontAwesomeIcon
          icon={faCheckCircle}
          className="text-green-500 text-5xl mx-auto"
        />

        <h1 className="text-2xl font-heading text-neutral-dark">
          Order Confirmed 🎉
        </h1>

        <p className="text-neutral-600 font-body">
          Thank you, <span className="font-semibold text-primary">{userName}</span>!  
          Your Tiny Joy is on its way 💜  We’ll notify you when it ships.
        </p>

        <div className="border-t border-neutral-light pt-4 space-y-1 text-sm">
          <p><span className="font-semibold">Order ID:</span> #{orderId}</p>
          <p><span className="font-semibold">Estimated Delivery:</span> 3–5 business days</p>
        </div>

        <div className="pt-4">
          <Link href="/shop">
            <Button className="w-full bg-primary font-cta text-white hover:opacity-90">
              Continue Shopping 🛍️
            </Button>
          </Link>
          <Link href="/orders">
            <Button variant="outline" className="w-full font-cta mt-2">
              Track My Order 🚚
            </Button>
          </Link>
        </div>
      </div>

      <p className="mt-6 text-sm text-neutral-500">
        Need help?{" "}
        <Link href="/support" className="text-primary underline">
          Contact us
        </Link>
      </p>
    </main>
  )
}
