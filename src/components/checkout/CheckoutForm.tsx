"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faLock,
  faCheckCircle,
  faArrowLeft,
  faMoneyBill,
  faCreditCard,
  faMobileAlt,
} from "@fortawesome/free-solid-svg-icons";
import { useCart } from "@/store/cart/cart-store";
import { useCheckoutStore } from "@/store/checkout/checkout-store";
import type { CheckoutInfo } from '@/store/checkout/checkout-store';
import { useCartTotal } from "@/hooks/useCartTotal";
import { useShipping } from "@/hooks/useShipping";
import { Textarea } from "../ui/textarea";

type Step = "shipping" | "payment";

export function CheckoutForm() {
  const [step, setStep] = useState<Step>("shipping");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const router = useRouter();
  const { items } = useCart();
  const { subtotal, finalPayable } = useCartTotal();
  const { checkoutInfo, setCheckoutInfo, paymentMethod, setPaymentMethod } =
    useCheckoutStore();
  const pincode = checkoutInfo?.pincode;

  const { isLoading } = useShipping(pincode);

  useEffect(() => {
    if (!items || items.length === 0) {
      // If cart empty, redirect to home (defensive)
      router.push("/");
    }

    // load Razorpay script only when on client
    const existing = document.querySelector("script[data-razorpay]");
    if (!existing) {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;
      script.setAttribute("data-razorpay", "1");
      document.body.appendChild(script);
    }
  }, [items, router]);

  const paymentOptions = [
    { label: "UPI / GPay / Paytm", value: "upi", icon: faMobileAlt },
    { label: "Credit / Debit Card", value: "card", icon: faCreditCard },
    { label: "Cash on Delivery", value: "cod", icon: faMoneyBill },
  ] as const;

  // --- Validation rules ---
  type ShippingField = keyof CheckoutInfo;
  const validators: Record<ShippingField, (v: string) => boolean> = {
    fullName: (v: string) => v.trim().length >= 2,
    phoneNumber: (v: string) => /^\d{10}$/.test(v.trim()),
    email: (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()),
    address: (v: string) => v.trim().length >= 6,
    city: (v: string) => v.trim().length >= 2,
    pincode: (v: string) => /^[1-9][0-9]{5}$/.test(v.trim()),
  };

  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const getFieldError = (field: ShippingField) => {
    const value = (checkoutInfo ? (checkoutInfo as CheckoutInfo)[field] : "") || "";
    if (!touched[field]) return "";
    const ok = validators[field](value);
    if (ok) return "";
    const messages: Record<ShippingField, string> = {
      fullName: "Please enter your full name",
      phoneNumber: "Enter a 10-digit phone number",
      email: "Enter a valid email address",
      address: "Enter street address (min 6 chars)",
      city: "Enter your city",
      pincode: "Enter a valid 6-digit pincode",
    };
    return messages[field];
  };

  const isShippingValid = (Object.keys(validators) as ShippingField[]).every((k) => {
    const fn = validators[k];
    const val = checkoutInfo ? (checkoutInfo as CheckoutInfo)[k] : "";
    return fn(val || "");
  });

  const markAllTouched = () => {
    const t: Record<string, boolean> = {};
    Object.keys(validators).forEach((k) => (t[k] = true));
    setTouched(t);
  };

  // --- Place order handler ---
  type RazorpayResponse = {
    razorpay_order_id?: string;
    razorpay_payment_id?: string;
    razorpay_signature?: string;
  };

  const handlePlaceOrder = async () => {
    setErrorMessage(null);
    setSuccessMsg(null);

    // ensure shipping valid before trying to place payment order
    if (!isShippingValid) {
      markAllTouched();
      setStep("shipping");
      setErrorMessage("Please fix the highlighted fields before continuing.");
      return;
    }

    setLoading(true);
    try {
      // Use finalPayable throughout
      if (paymentMethod === "cod") {
        // Save order as COD with discounted final amount
        const res = await fetch("/api/save-order", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            paymentResponse: {
              razorpay_order_id: "COD_" + Date.now(),
              razorpay_payment_id: "COD_PAYMENT",
              razorpay_signature: "COD_SIGNATURE",
            },
            cartItems: items,
            totalAmount: finalPayable,
            subtotal,
            checkoutInfo,
            paymentMethod: "cod",
          }),
        });
        if (!res.ok) throw new Error("Failed to save COD order");
        const data = await res.json();

        // Fire & forget Shiprocket but log errors
        try {
          await fetch(`/api/shiprocket`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ order: data.order }),
          });
        } catch (shipErr) {
          console.error("Shiprocket call failed", shipErr);
        }

        setSuccessMsg(
          "Order placed! We will contact you soon for confirmation."
        );
        router.push(
          `/order-confirmation/${data.order?.id ?? data.order?.orderId ?? "COD_" + Date.now()}`
        );
        return;
      }

      // For Razorpay: create order on server using finalPayable (convert to paise)
      const amountInPaise = Math.round(finalPayable); // Razorpay expects paise
      const createRes = await fetch("/api/razorpay", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: amountInPaise }),
      });
      if (!createRes.ok) throw new Error("Failed to create payment order");
      const createData = await createRes.json();

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: createData.amount || amountInPaise,
        currency: createData.currency || "INR",
        name: "Tinivo",
        description: "Small Things. Big Joy.",
        order_id: createData.id,
        image: "/assets/logo.png",
        handler: async function (response: RazorpayResponse) {
          // Save successful payment on server with finalPayable
          try {
            const saveRes = await fetch("/api/save-order", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                paymentResponse: response,
                cartItems: items,
                totalAmount: finalPayable,
                subtotal,
                checkoutInfo,
                paymentMethod: paymentMethod,
              }),
            });
            if (!saveRes.ok)
              throw new Error("Failed to save order after payment");
            const saveData = await saveRes.json();

            // Shiprocket call
            try {
              await fetch(`/api/shiprocket`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ order: saveData.order }),
              });
            } catch (shipErr) {
              console.error("Shiprocket call failed", shipErr);
            }

            setSuccessMsg("Payment successful — redirecting...");
            router.push(
              `/order-confirmation/${saveData.order?.id ?? saveData.order?.orderId ?? ""}`
            );
          } catch (saveErr: unknown) {
            console.error(saveErr);
            setErrorMessage(
              "Payment succeeded but we failed to save your order. Please contact support."
            );
          }
        },
        prefill: {
          name: checkoutInfo?.fullName || "",
          email: checkoutInfo?.email || "",
          contact: checkoutInfo?.phoneNumber || "",
        },
        notes: {
          address: `${checkoutInfo?.address || ""}, ${checkoutInfo?.city || ""} - ${checkoutInfo?.pincode || ""}`,
        },
        theme: { color: "#9D7EDB" },
      };

      // open Razorpay checkout - avoid using `any` by typing the global
      type RazorpayOptions = typeof options;
      type RazorpayInstance = { open: () => void };
      type RazorpayConstructor = new (opts: RazorpayOptions) => RazorpayInstance;

      const RazorpayCtor = (window as unknown as { Razorpay?: RazorpayConstructor }).Razorpay;
      if (!RazorpayCtor) throw new Error("Razorpay SDK not loaded");
      const rzp = new RazorpayCtor(options);
      rzp.open();
    } catch (err: unknown) {
      console.error("place order error", err);
      const message = err && typeof err === 'object' && 'message' in err && typeof (err as { message?: unknown }).message === 'string'
        ? (err as { message?: string }).message
        : null;
      setErrorMessage(
        message || "Something went wrong, please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // Input change handler using placeholder keys (keeps your existing store pattern)
  const handleChangeInfo = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { placeholder, value } = e.target;
    const updatedInfo: CheckoutInfo = checkoutInfo
      ? { ...checkoutInfo }
      : {
          fullName: "",
          phoneNumber: "",
          email: "",
          address: "",
          city: "",
          pincode: "",
        };
    if (placeholder === "Full Name") updatedInfo.fullName = value;
    if (placeholder === "Phone Number") updatedInfo.phoneNumber = value;
    if (placeholder === "Email Address") updatedInfo.email = value;
    if (placeholder === "Street Address") updatedInfo.address = value;
    if (placeholder === "City") updatedInfo.city = value;
    if (placeholder === "Pincode") updatedInfo.pincode = value;

    setCheckoutInfo(updatedInfo);
  };

  const onBlurField = (field: string) =>
    setTouched((prev) => ({ ...prev, [field]: true }));

  return (
    <div className="space-y-8">
      {/* Progress Bar */}
      <div className="mb-6 text-center">
        <p className="text-sm font-heading text-neutral-700">
          {step === "shipping" ? "You're halfway there 💫" : "Almost done! 🎉"}
        </p>
        <div className="mt-2 w-full h-1 bg-neutral-light rounded-full">
          <div
            className={`h-full bg-primary transition-all duration-500 ${step === "shipping" ? "w-1/2" : "w-full"}`}
            aria-hidden
          />
        </div>
      </div>

      {/* Messages */}
      {errorMessage && (
        <div
          role="alert"
          className="text-sm text-red-600 bg-red-50 p-3 rounded-md"
        >
          {errorMessage}
        </div>
      )}
      {successMsg && (
        <div
          role="status"
          className="text-sm text-green-700 bg-green-50 p-3 rounded-md"
        >
          {successMsg}
        </div>
      )}

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
            <div className="space-y-6 w-full">
              <label className="block">
                <Input
                  placeholder="Full Name"
                  required
                  value={checkoutInfo?.fullName || ""}
                  onChange={handleChangeInfo}
                  onBlur={() => onBlurField("fullName")}
                  aria-invalid={!!getFieldError("fullName")}
                  aria-describedby={
                    getFieldError("fullName") ? "err-fullName" : undefined
                  }
                />
                {getFieldError("fullName") && (
                  <p id="err-fullName" className="text-xs text-red-600 mt-1">
                    {getFieldError("fullName")}
                  </p>
                )}
              </label>

              <label className="block">
                <Input
                  placeholder="Phone Number"
                  required
                  value={checkoutInfo?.phoneNumber || ""}
                  onChange={handleChangeInfo}
                  onBlur={() => onBlurField("phoneNumber")}
                  aria-invalid={!!getFieldError("phoneNumber")}
                  aria-describedby={
                    getFieldError("phoneNumber") ? "err-phone" : undefined
                  }
                  inputMode="numeric"
                />
                {getFieldError("phoneNumber") && (
                  <p id="err-phone" className="text-xs text-red-600 mt-1">
                    {getFieldError("phoneNumber")}
                  </p>
                )}
              </label>

              <label className="block">
                <Input
                  placeholder="Email Address"
                  type="email"
                  required
                  value={checkoutInfo?.email || ""}
                  onChange={handleChangeInfo}
                  onBlur={() => onBlurField("email")}
                  aria-invalid={!!getFieldError("email")}
                  aria-describedby={
                    getFieldError("email") ? "err-email" : undefined
                  }
                />
                {getFieldError("email") && (
                  <p id="err-email" className="text-xs text-red-600 mt-1">
                    {getFieldError("email")}
                  </p>
                )}
              </label>

              <label className="block">
                <Textarea
                  placeholder="Street Address"
                  required
                  value={checkoutInfo?.address || ""}
                  onChange={handleChangeInfo}
                  onBlur={() => onBlurField("address")}
                  aria-invalid={!!getFieldError("address")}
                  aria-describedby={
                    getFieldError("address") ? "err-address" : undefined
                  }
                />
                {getFieldError("address") && (
                  <p id="err-address" className="text-xs text-red-600 mt-1">
                    {getFieldError("address")}
                  </p>
                )}
              </label>

              <div className="grid grid-cols-2 gap-3">
                <label className="block">
                  <Input
                    placeholder="City"
                    required
                    value={checkoutInfo?.city || ""}
                    onChange={handleChangeInfo}
                    onBlur={() => onBlurField("city")}
                    aria-invalid={!!getFieldError("city")}
                    aria-describedby={
                      getFieldError("city") ? "err-city" : undefined
                    }
                  />
                  {getFieldError("city") && (
                    <p id="err-city" className="text-xs text-red-600 mt-1">
                      {getFieldError("city")}
                    </p>
                  )}
                </label>
                <label className="block">
                  <Input
                    placeholder="Pincode"
                    required
                    value={checkoutInfo?.pincode || ""}
                    onChange={handleChangeInfo}
                    onBlur={() => onBlurField("pincode")}
                    aria-invalid={!!getFieldError("pincode")}
                    aria-describedby={
                      getFieldError("pincode") ? "err-pincode" : undefined
                    }
                    inputMode="numeric"
                  />
                  {getFieldError("pincode") && (
                    <p id="err-pincode" className="text-xs text-red-600 mt-1">
                      {getFieldError("pincode")}
                    </p>
                  )}
                </label>
              </div>
            </div>

            <Button
              onClick={() => {
                if (!isShippingValid) {
                  markAllTouched();
                  setErrorMessage("Please complete all required fields.");
                  return;
                }
                setErrorMessage(null);
                setStep("payment");
              }}
              className="mt-6 w-full font-cta bg-primary text-white hover:opacity-90"
              disabled={isLoading}
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
            role="region"
            aria-labelledby="payment-heading"
          >
            <h2 id="payment-heading" className="text-xl font-heading mb-4">
              <button
                onClick={() => setStep("shipping")}
                className="mr-3 inline-flex items-center gap-2 text-neutral-700 hover:text-neutral-900"
                aria-label="Back to shipping"
              >
                <FontAwesomeIcon icon={faArrowLeft} />
                Back
              </button>
              Payment Method
            </h2>

            <div
              className="flex flex-col gap-3"
              role="radiogroup"
              aria-label="Payment methods"
            >
              {paymentOptions.map((method) => {
                const checked = paymentMethod === method.value;
                return (
                  <label
                    key={method.value}
                    className={`border p-3 rounded-xl cursor-pointer hover:border-primary transition flex items-center justify-between ${checked ? "ring-2 ring-primary/30 border-primary" : ""}`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="payment"
                        aria-checked={checked}
                        checked={checked}
                        onChange={() => setPaymentMethod(method.value)}
                        className="accent-primary"
                      />
                      <div className="flex items-center gap-2">
                        <FontAwesomeIcon
                          icon={method.icon}
                          className="w-4 h-4"
                        />
                        <div>
                          <div className="font-medium">{method.label}</div>
                          {method.value !== "cod" && (
                            <div className="text-xs text-neutral-500">
                              Fast & secure
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Save 2% hint for online */}
                    {method.value !== "cod" ? (
                      <div className="text-xs text-green-600">
                        Save 2% · Pay online
                      </div>
                    ) : (
                      <div className="text-xs text-neutral-500">
                        Pay at delivery
                      </div>
                    )}
                  </label>
                );
              })}
            </div>

            <div className="mt-6">
              <Button
                onClick={handlePlaceOrder}
                className="w-full font-cta text-white bg-accent1 hover:opacity-90"
                disabled={loading}
                aria-disabled={loading}
              >
                {loading
                  ? "Processing…"
                  : `Pay ₹${finalPayable.toFixed(2)} • Place Order`}
              </Button>

              <div className="mt-4 text-center">
                <div className="text-black font-bold">
                  <FontAwesomeIcon
                    icon={faLock}
                    className="w-5 h-5 text-yellow-500 mr-2 inline-block"
                  />
                  100% Secure Checkout
                  <FontAwesomeIcon
                    icon={faCheckCircle}
                    className="w-5 h-5 text-green-600 ml-2 inline-block"
                  />
                </div>
                <div className="text-xs text-neutral-500 mt-1">
                  We never store your card details. Payments are processed
                  securely.
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
