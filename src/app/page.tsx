import Bestsellers from "@/components/sections/BestSellers";
import Hero from "@/components/sections/Hero";
// import WhatWeOffer from "@/components/sections/WhatWeOffer";
import WhyTinivo from "@/components/sections/WhyTinivo";
import Testimonals from '@/components/sections/Testimonals'
import GiftingMoments from '@/components/sections/GiftingMoments'
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
