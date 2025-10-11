import { CheckoutForm } from "@/components/checkout/CheckoutForm"
import CheckoutSummary from "@/components/checkout/CheckoutSummary"

export default function CheckoutPage() {
  return (
    <main className="min-h-screen bg-light-bg px-4 py-12">
      <div className="mx-auto max-w-5xl px-2 sm:px-4 md:px-6">
        {/* Desktop Grid */}
        <div className="hidden md:grid lg:grid lg:grid-cols-3 md:grid-cols-2 gap-8">
          <section className="md:col-span-2">
            <CheckoutForm />
          </section>

          {/* Order Summary Sidebar (Desktop only) */}
          <aside className="bg-white rounded-2xl shadow-md p-6 h-fit sticky top-6">
            <h3 className="text-lg font-heading mb-4">Order Summary</h3>
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
              <CheckoutSummary />
            </div>
          </details>

        </div>
      </div>
    </main>
  )
}
