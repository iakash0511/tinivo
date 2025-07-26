"use client";
import BestsellerCard from "../card/BestSellerCard";


const bestsellers = [
  {
    id: "1",
    name: "Mini Panda Mirror",
    price: 399,
    image: "/products/panda-mirror.jpg",
    tag: "Most Gifted 🎁",
    description: "Cute & handy, perfect for purse or pouch!",
  },
  {
    id: "2",
    name: "Korean Jelly Bag",
    price: 699,
    image: "/products/jelly-bag.jpg",
    tag: "Back in Stock 💖",
    description: "Trendy & transparent for fun everyday looks.",
  },
  {
    id: "3",
    name: "Heart Hair Clip Set",
    price: 199,
    image: "/products/heart-clips.jpg",
    tag: "Top Rated 💕",
    description: "Add charm to any hairstyle in seconds!",
  },
  {
    id: "4",
    name: "Desk Buddy Lamp",
    price: 599,
    image: "/products/desk-lamp.jpg",
    tag: "Customer Fav ⭐",
    description: "Soft glow lamp, perfect for late-night notes.",
  },
];

export default function Bestsellers() {
  return (
    <section id="bestsellers" className="px-4 py-10 bg-light-bg">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-heading text-center text-neutral-dark mb-8">
          Bestsellers Everyone’s Loving
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {bestsellers.map((item) => (
            <BestsellerCard item={item} key={item.id} id={item.id}/>
          ))}
        </div>
      </div>
    </section>
  );
}
