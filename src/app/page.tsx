import dynamic from "next/dynamic";
import Hero from "@/components/sections/Hero";
const Bestsellers = dynamic(() => import('@/components/sections/BestSellers'));
const Testimonals = dynamic(() => import('@/components/sections/Testimonals'));
const WhyTinivo = dynamic(() => import('@/components/sections/WhyTinivo'));
const GiftingMoments = dynamic(() => import('@/components/sections/GiftingMoments'));
// const WhatWeOffer = dynamic(() => import('@/components/sections/WhatWeOffer'));
export default function Home() {
  return (
    <>
      <Hero />
      <WhyTinivo />
      <Bestsellers />
      <Testimonals />
      <GiftingMoments />
      {/* <WhatWeOffer /> */}
    </>
  );
}
