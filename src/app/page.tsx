'use client';
import dynamic from "next/dynamic";
import Hero from "@/components/sections/Hero";
const Bestsellers = dynamic(() => import('@/components/sections/BestSellers'), { ssr: false });
const Testimonals = dynamic(() => import('@/components/sections/Testimonals'), { ssr: false });
const WhyTinivo = dynamic(() => import('@/components/sections/WhyTinivo'), { ssr: false });
const GiftingMoments = dynamic(() => import('@/components/sections/GiftingMoments'), { ssr: false });
// const WhatWeOffer = dynamic(() => import('@/components/sections/WhatWeOffer'), { ssr: false });
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
