import { client } from "@/lib/sanity.client"
import { getAllProducts } from "@/lib/queries"
import Image from "next/image"
import Link from "next/link"
import { Product } from "@/interface/ProductInterface"

export default async function ShopPage() {
  const products = await client.fetch(getAllProducts)

  return (
    <main className="min-h-screen bg-light-bg px-4 py-12">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-heading mb-8 text-center">All Products ✨</h1>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
          {products.map((p: Product) => (
            <Link
              key={p._id}
              href={`/product/${p.slug}`}
              className="bg-white rounded-2xl p-3 shadow-sm hover:shadow-md transition"
            >
              <div className="relative w-full aspect-square rounded-xl overflow-hidden">
                <Image
                  src={p.image}
                  alt={p.name}
                  fill
                  sizes="(max-width:768px) 100vw, 25vw"
                  className="object-cover"
                />
              </div>
              <div className="mt-3">
                <h3 className="font-heading text-sm md:text-base line-clamp-1">{p.name}</h3>
                <p className="text-primary font-cta mt-1">₹{p.price}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  )
}