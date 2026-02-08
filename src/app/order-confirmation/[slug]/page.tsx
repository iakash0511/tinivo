"use client"

import { useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCheckCircle } from "@fortawesome/free-solid-svg-icons"
import confetti from "canvas-confetti"
import { useParams, useRouter, useSearchParams } from "next/navigation"
import { useCart } from "@/store/cart/cart-store"
import { CheckoutInfo, useCheckoutStore } from "@/store/checkout/checkout-store"

export default function OrderConfirmation() {
  const params = useParams()
  const slug = params.slug as string
  const searchParams = useSearchParams();
  const userName = searchParams.get("name") || "Customer";

  const { clearCart } = useCart();

  const { setCheckoutInfo, checkoutInfo } = useCheckoutStore();
  const setShippingOption = useCheckoutStore((state) => state.setShippingOption);

  const router = useRouter();
  const EMPTY_CHECKOUT: CheckoutInfo = {
    fullName: "",
    phoneNumber: "",
    email: "",
    address: "",
    city: "",
    pincode: "",
  };

  useEffect(() => {
    if (!checkoutInfo || Object.values(checkoutInfo).length === 0) {
      router.push('/');
      return
    };
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
        clearCart();
        setCheckoutInfo(EMPTY_CHECKOUT);
        setShippingOption(null);
    }
    frame()
  }, [clearCart, setCheckoutInfo, setShippingOption, router, checkoutInfo])

  const orderId = slug;

  const handleCopyOrderId = () => {
    navigator.clipboard.writeText(orderId);
    alert("Order ID copied to clipboard!");
  }
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
          <p onClick={handleCopyOrderId}><span className="font-semibold">Order ID:</span> <span className="underline text-primary">#{orderId}</span> (Click to copy)</p>
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
