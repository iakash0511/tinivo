import { useCart } from '@/store/cart/cart-store'

interface CartTotal {
    subtotal: number
    giftWrapTotal: number
    total: number
}

export function useCartTotal(): CartTotal {
    const items = useCart((state) => state.items)
    const giftWrapFee = 49

    const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
    const giftWrapTotal = items.reduce(
        (sum, item) => sum + (item.giftWrap ? giftWrapFee : 0),
        0
    )
    const total = subtotal + giftWrapTotal

    return {
        subtotal,
        giftWrapTotal,
        total,
    }
}
