// app/(shop)/checkout/page.tsx
import { CheckoutForm } from "@/components/checkout/CheckoutForm"
import CheckoutSummary from "@/components/checkout/CheckoutSummary"

export default function CheckoutPage() {
  return (
    <main className="min-h-screen px-4 py-12">
      <div className="mx-auto max-w-5xl px-2 sm:px-4 md:px-6">
        {/* Desktop Grid */}
        <div className="hidden md:grid lg:grid-cols-3 md:grid-cols-2 gap-8 items-start">
          <section className="md:col-span-2">
            <CheckoutForm />
          </section>

          {/* Order Summary Sidebar (Desktop only) */}
          <aside className="hidden md:block">
            <CheckoutSummary />
          </aside>
        </div>

        {/* Mobile Layout */}
        <div className="block md:hidden space-y-6">
          <CheckoutForm />

          {/* Collapsible Order Summary */}
          <details className="bg-white rounded-2xl shadow-md p-4">
            <summary className="font-heading cursor-pointer">Order Summary</summary>
            <div className="mt-3 space-y-2">
              <CheckoutSummary isMobile />
            </div>
          </details>
        </div>
      </div>
    </main>
  )
}
