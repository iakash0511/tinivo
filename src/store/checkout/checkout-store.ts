import {create} from 'zustand'

type CheckoutInfo = {
    fullName: string
    phoneNumber: string
    email: string
    address: string
    city: string
    pincode: string
}

type CheckoutStore = {
    checkoutInfo: CheckoutInfo | null
    setCheckoutInfo: (info: CheckoutInfo) => void
    clearCheckoutInfo: () => void
}
export const useCheckoutStore = create<CheckoutStore>((set) => ({
    checkoutInfo: null,
    setCheckoutInfo: (info) => set({checkoutInfo: info}),
    clearCheckoutInfo: () => set({checkoutInfo: null})
}))

// Usage example:
// const { checkoutInfo, setCheckoutInfo, clearCheckoutInfo } = useCheckoutStore();
// setCheckoutInfo({ fullName: 'John Doe', phoneNumber: '1234567890', email: '