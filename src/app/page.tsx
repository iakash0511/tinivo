import dynamic from "next/dynamic";
import Hero from "@/components/sections/Hero";
const ComboSections = dynamic(() => import('@/components/sections/ComboSections'));
const TrustStrip = dynamic(() => import('@/components/sections/TrustSection'));
const UnderAmountSection = dynamic(() => import("@/components/sections/UnderAmountSection"));
const Bestsellers = dynamic(() => import('@/components/sections/BestSellers'));
const Testimonals = dynamic(() => import('@/components/sections/Testimonals'));
const WhyTinivo = dynamic(() => import('@/components/sections/WhyTinivo'));
const GiftingMoments = dynamic(() => import('@/components/sections/GiftingMoments'));
// const WhatWeOffer = dynamic(() => import('@/components/sections/WhatWeOffer'));
export default function Home() {
  return (
    <>
      <Hero />
      <TrustStrip />
      <UnderAmountSection amount={499}/>
      <ComboSections />
      <Bestsellers />
      <WhyTinivo />
      <GiftingMoments />
      <Testimonals />
      {/* <WhatWeOffer /> */}
    </>
  );
}
