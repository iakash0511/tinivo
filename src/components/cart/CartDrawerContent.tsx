'use client'

import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { ScrollArea } from '@/components/ui/scroll-area'
import CartItemCard  from './CartItemCard'

export default function CartDrawerContent({
  cartItems,
  cartTotal
}: {
  cartItems: any[]
  cartTotal: number
}) {
    console.log(cartItems, 'cart Items')
  return (
    <div className="font-body text-neutral-dark flex flex-col h-full">
      {/* Urgency Banner */}
      <div className="bg-red-100 text-red-600 text-sm px-4 py-2">
        ⏳ Hurry! These items are in high demand. Checkout before they’re gone!
      </div>

      {/* Free Shipping Threshold */}
      {cartTotal < 999 && (
        <div className="bg-accent2/20 text-accent2 text-sm px-4 py-2">
          🚚 You're ₹{999 - cartTotal} away from <strong>Free Shipping</strong>!
        </div>
      )}

      {/* Scrollable Cart Items */}
      <ScrollArea className="flex-1 px-1 py-2">
        {cartItems.length > 0 ? (
          cartItems.map((item, index) => (
            <CartItemCard item={item} key={index}/>
          ))
        ) : (
          <p className="text-center py-6 text-sm">Your cart is feeling a little lonely 😔</p>
        )}
      </ScrollArea>

      {/* Gifting Info */}
      <div className="px-4 py-2 text-sm">
        🎁 Gifting? We’ll wrap it with love — just tick the gift option at checkout!
      </div>

      {/* Why Tinivo - Expandable */}
      <Collapsible>
        <CollapsibleTrigger className="text-sm font-medium px-4 py-2 w-full text-left">
          💡 Why shop with Tinivo?
        </CollapsibleTrigger>
        <CollapsibleContent className="px-4 pb-2 text-sm text-neutral-dark/90 space-y-1">
          <p>• Curated with care 💕</p>
          <p>• Mini-sized joy, maximum smiles 😍</p>
          <p>• Gift-ready packaging 🎁</p>
          <p>• Fast & tracked shipping 🚚</p>
        </CollapsibleContent>
      </Collapsible>

      {/* Support Message */}
      <p className="text-xs text-center italic text-neutral-dark/70 px-4 py-2">
        💖 Every order supports a small business with big dreams.
      </p>
    </div>
  )
}
