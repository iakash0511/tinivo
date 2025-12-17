import Link from "next/link"
import BestsellerCard from "../card/BestSellerCard"
import { getProductsUnderAmount } from "@/lib/queries";
import { client } from "@/lib/sanity.client";
import { BestSellerItem } from "@/interface/BestSellerInterface";

export default async function UnderAmountSection({amount}: {amount?: number}) {
    const products = await client.fetch(getProductsUnderAmount, { amount }, { next: { revalidate: 300 } });
  return (
    <section className="bg-softPink py-12">
      <div className="max-w-6xl mx-auto px-4">

        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-heading text-neutral-dark">
            Little Joys Under ₹{amount} 💕
          </h2>
          <p className="mt-2 text-sm md:text-base text-neutral-600 font-body">
            Thoughtful mini gifts that feel special — without overthinking the price.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5">
          {products.slice(0, 8).map((p: BestSellerItem) => (
            <BestsellerCard key={p._id} id={p._id} item={p}/>
          ))}
        </div>

        <div className="mt-8 text-center">
          <Link
            href={`/shop?max=${amount}`}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-primary text-white font-cta shadow-md hover:opacity-90"
          >
            Explore all under ₹{amount} ✨
          </Link>
        </div>

      </div>
    </section>
  )
}
