import { getFeaturedProducts } from "@/lib/queries";
import HeroSection from "../hero/HeroSection";
import { Product } from "@/interface/ProductInterface";
import { client } from "@/lib/sanity.client";

export default async function Hero() {
  const featuredProducts: Product[] = await client.fetch(getFeaturedProducts, {}, { next: { revalidate: 4000 } });
  return (
    <HeroSection featuredProducts={featuredProducts} />
  )
}