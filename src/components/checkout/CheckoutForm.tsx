"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faLock, faCheckCircle, faArrowLeft, faMoneyBill, faCreditCard, faMobileAlt } from "@fortawesome/free-solid-svg-icons"



export function CheckoutForm() {
  const [step, setStep] = useState<"shipping" | "payment">("shipping")
  const [paymentMethod, setPaymentMethod] = useState('upi')
  const router = useRouter()

  const paymentOptions = [
    {label: "UPI / GPay / Paytm", value: 'upi', icon: faMobileAlt},
    {label:  "Credit / Debit Card",value: 'card', icon: faCreditCard},
     {label: "Cash on Delivery", value: 'cod', icon: faMoneyBill}
  ]
  const handlePlaceOrder = () => {
    router.push("/order-confirmation")
  }

  return (
    <div className="space-y-8">
      {/* Progress Bar */}
      <div className="mb-6 text-center">
        <p className="text-sm font-heading text-neutral-700">
          {step === "shipping" ? "You're halfway there 💫" : "Almost done! 🎉"}
        </p>
        <div className="mt-2 w-full h-1 bg-neutral-light rounded-full">
          <div
            className={`h-full bg-primary transition-all duration-500 ${
              step === "shipping" ? "w-1/2" : "w-full"
            }`}
          />
        </div>
      </div>

      {/* Step 1: Shipping */}
      <AnimatePresence mode="wait">
        {step === "shipping" && (
          <motion.div
            key="shipping"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-white rounded-2xl shadow-sm p-6"
          >
            <h2 className="text-xl font-heading mb-4">Shipping Details</h2>
            <div className="space-y-3 w-full">
              <Input placeholder="Full Name" required />
              <Input placeholder="Phone Number" required />
              <Input placeholder="Email Address" type="email" required />
              <Input placeholder="Street Address" required />
              <Input placeholder="City" required />
              <Input placeholder="Pincode" required />
            </div>
            <Button
              onClick={() => setStep("payment")}
              className="mt-6 w-full font-cta bg-primary text-white hover:text-black hover:opacity-90"
            >
              Almost Yours! 💜 →
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Step 2: Payment */}
      <AnimatePresence mode="wait">
        {step === "payment" && (
          <motion.div
            key="payment"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-white rounded-2xl shadow-sm p-6"
          >
            <h2 className="text-xl font-heading mb-4">
              <FontAwesomeIcon icon={faArrowLeft} className="w-6 h-6 inline-block mr-2 hover:cursor-pointer" onClick={()  => setStep('shipping')}/>
              Payment Method
              </h2>
            <div className="flex flex-col gap-3">
              {paymentOptions?.map((method) => (
                <label
                  key={method.value}
                  className="border p-3 rounded-xl cursor-pointer hover:border-primary transition"
                  onClick={() => setPaymentMethod(method.value)}
                >
                  <input type="radio" name="payment" className="mr-2" checked={paymentMethod === method.value}/>
                  <FontAwesomeIcon icon={method.icon} className="w-4 h-4" />
                  {method.label}
                </label>
              ))}
            </div>
            <Button
              onClick={handlePlaceOrder}
              className="mt-6 w-full font-cta text-white bg-accent1 hover:opacity-90"
            >
              Place Order ❤️
            </Button>
            
            <h2 className="text-black font-bold mt-4 text-center">
                <FontAwesomeIcon icon={faLock} className="w-5 h-5 text-yellow-500" /> 100% Secure Checkout <FontAwesomeIcon icon={faCheckCircle} className="w-5 h-5 text-green-600" /></h2>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
