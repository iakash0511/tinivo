// store/checkout/checkout-store.ts
import { create } from "zustand";

export type ShippingOption = {
  courier_name?: string;
  estimated_days?: string | number;
  rate?: number;
  service_type?: string;
  raw?: any;
};

export type CheckoutInfo = {
  fullName: string;
  phoneNumber: string;
  email: string;
  address: string;
  city: string;
  pincode: string;
};

export type PaymentMethod = "upi" | "card" | "cod";

type CheckoutStore = {
  checkoutInfo: CheckoutInfo | null;
  paymentMethod: PaymentMethod;
  setCheckoutInfo: (info: CheckoutInfo) => void;
  setPaymentMethod: (m: PaymentMethod) => void;
  clearCheckoutInfo: () => void;
  setShippingOption: (o: ShippingOption | null) => void;
  shippingOption: ShippingOption | null;
  resetCheckout: () => void;
};

export const useCheckoutStore = create<CheckoutStore>((set) => ({
  checkoutInfo: null,
  paymentMethod: "upi",
  setCheckoutInfo: (info) => set({ checkoutInfo: info }),
  setPaymentMethod: (m) => set({ paymentMethod: m }),
  clearCheckoutInfo: () => set({ checkoutInfo: null }),
  resetCheckout: () => set({ checkoutInfo: null, paymentMethod: "upi" }),
  shippingOption: null,
  setShippingOption: (option) => set({ shippingOption: option }),
}));
