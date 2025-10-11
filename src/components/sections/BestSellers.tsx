"use client";
import { useEffect, useState } from "react";
import BestsellerCard from "../card/BestSellerCard";
import { getBestSellers } from "@/lib/queries";
import { client } from "@/lib/sanity.client";
import { BestSellerItem } from "@/interface/BestSellerInterface";

export default function Bestsellers() {

  const [bestsellers, setBestSellers] = useState<BestSellerItem[]>([]);

  useEffect(() => {
  const fetchBestsellers = async () => {
  const response = await client.fetch(getBestSellers);
  console.log("Bestsellers:", response);
  setBestSellers(response);
  }
  fetchBestsellers();
},[])

  return (
    <section id="bestsellers" className="px-4 py-10 bg-light-bg">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-heading text-center text-neutral-dark mb-8">
          Bestsellers Everyone’s Loving
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {bestsellers.map((item) => (
            <BestsellerCard item={item} key={item._id} id={item._id}/>
          ))}
        </div>
      </div>
    </section>
  );
}
