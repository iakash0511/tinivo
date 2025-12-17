import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { getCombos } from "@/lib/queries"
import { client } from "@/lib/sanity.client";
import { Product } from "@/interface/ProductInterface";

export default async function ComboSection() {
    
    const combos = await client.fetch(getCombos, {}, { next: { revalidate: 300 } });

  return (
    <section className="bg-babyBlue py-14">
      <div className="max-w-6xl mx-auto px-4">

        {/* Heading */}
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-heading text-neutral-dark">
            Thoughtfully Curated Combos 🎁
          </h2>
          <p className="mt-2 text-sm md:text-base font-body text-neutral-600">
            Pick once. Gift effortlessly. Loved by Tinivo girls 💜
          </p>
        </div>

        {/* Combo cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {combos.slice(0, 3).map((combo: Product) => {
            const savings = combo.compareAtPrice ? combo.compareAtPrice - combo.price : 0;

            return (
              <div
                key={combo._id}
                className="bg-white rounded-3xl shadow-sm hover:shadow-md transition p-4 flex flex-col"
              >
                {/* Image */}
                <div className="relative w-full aspect-square rounded-2xl overflow-hidden">
                  <Image
                    src={combo.image}
                    alt={combo.name}
                    fill
                    className="object-cover"
                  />
                  <span className="absolute top-3 left-3 bg-accent1 text-white text-xs px-3 py-1 rounded-full">
                    Combo Pick 💕
                  </span>
                </div>

                {/* Content */}
                <div className="mt-4 text-center flex flex-col gap-2">
                  <h3 className="font-heading text-lg">
                    {combo.name}
                  </h3>
                  <p className="text-sm text-neutral-600 font-body line-clamp-1 ">
                    {combo.description}
                  </p>

                  {/* Price */}
                  <div className="mt-2 flex justify-center items-center gap-2 font-cta">
                    <span className="text-neutral-500 line-through">
                      ₹{combo.compareAtPrice}
                    </span>
                    <span className="text-primary text-lg">
                      ₹{combo.price}
                    </span>
                  </div>

                  {/* Savings */}
                  <p className="text-xs text-green-600 font-medium">
                    You save ₹{savings} ✨
                  </p>

                  {/* CTA */}
                  <Link href={`/product/${combo.slug}`} className="mt-3">
                    <Button className="w-full bg-primary text-white font-cta hover:opacity-90">
                      View Combo 💜
                    </Button>
                  </Link>
                </div>
              </div>
            )
          })}
        </div>

        {/* Bottom reassurance */}
        <div className="mt-10 text-center text-sm text-neutral-600 font-body">
          🎁 Packed together · 🚚 Delivered safely · 🔒 100% prepaid secure
        </div>

      </div>
    </section>
  )
}
