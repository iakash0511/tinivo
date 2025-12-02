"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Gift } from "lucide-react";
import CTAButton from "../ui/CtaButton";
import { useRouter } from "next/navigation";


export default function Hero() {
  
const router = useRouter();
  return (
    <section className="relative min-h-[85vh] flex items-center justify-start overflow-hidden bg-softLavendar">
      {/* Background Image */}
      <Image
        src="/assets/hero/hero-section.png"
        alt="Tinivo pastel background"
        fill
        className="object-cover object-center md:object-center opacity-95"
        priority
      />

      {/* Overlay tint for readability */}
       <motion.div
        animate={{ opacity: [0.4, 0.6, 0.4] }}
        transition={{ duration: 3, repeat: Infinity }}
        className="absolute right-10 bottom-10 w-80 h-80 bg-accent1/30 blur-[120px] rounded-full"
      />

      <div className="absolute inset-0 bg-gradient-to-r from-light-bg/90 via-light-bg/70 to-transparent pointer-events-none" />
     
      {/* Text Content */}
      <motion.div
        initial={{ opacity: 0, x: -40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 px-6 md:px-20 max-w-xl"
      >
        <h1 className="text-4xl md:text-5xl font-heading text-neutral-dark leading-tight mb-6">
          Small Things. <br />
          <span className="text-primary leading-tight">
            Big Joy.
          </span>
        </h1>

        <p className="text-lg font-body text-neutral-dark/90 mb-8">
          Discover charming, Korean-style mini gifts that bring smiles every day.
          Thoughtfully curated, wrapped with love.
        </p>

        <CTAButton Icon={<Gift className="mr-2 h-5 w-5" />} handleClick={() => router.push('/shop')}>
          Explore the Collection
        </CTAButton>
      </motion.div>
    </section>
  );
}
