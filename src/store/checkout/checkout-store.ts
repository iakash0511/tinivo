// store/checkout/checkout-store.ts
import { create } from "zustand";

export type ShippingOption = {
  courier_name?: string;
  estimated_days?: string | number;
  rate?: number;
  service_type?: string;
  raw?: {courier_company_id: string | number};
  standard?: boolean;
  express?: boolean;
};

export type CheckoutInfo = {
  fullName: string;
  phoneNumber: string;
  email: string;
  address: string;
  city: string;
  pincode: string;
};
export type ShippingOptions = {
  standard?: ShippingOption;
  express?: ShippingOption;
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
  setShippingOptions: (opts: { standard?: ShippingOption; express?: ShippingOption }) => void;
  shippingOptions?: ShippingOptions;
  codPrepaidAccepted: boolean;
  setCodPrepaidAccepted: (v: boolean) => void;
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
  setShippingOptions: (options) => set({ shippingOptions: options }),
  codPrepaidAccepted: false,
  setCodPrepaidAccepted: (v) => set({ codPrepaidAccepted: v }),
}));
