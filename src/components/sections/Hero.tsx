"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Gift } from "lucide-react";
import CTAButton from "../ui/CtaButton";

export default function Hero() {
  return (
    <section className="relative min-h-[80vh] flex flex-col md:flex-row items-center justify-between px-4 md:px-12 bg-light-bg overflow-hidden">
      {/* Text Content */}
      <motion.div
        initial={{ opacity: 0, x: -40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-xl z-10"
      >
        <h1 className="text-4xl md:text-5xl font-heading text-neutral-dark leading-tight mb-6">
          Small Things. <br />
          <span className="text-primary hover:text-accent1">Big Joy.</span>
        </h1>
        <p className="text-lg font-body text-neutral-dark mb-8">
          Discover charming, Korean-style mini gifts that bring smiles every
          day. Thoughtfully curated, wrapped with love.
        </p>
        <CTAButton Icon={<Gift className="mr-2 h-5 w-5" />}>
          Explore Gifts
        </CTAButton>
      </motion.div>

      {/* Hero Glow Background */}
      <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-[400px] h-[400px] bg-accent1/30 blur-[100px] rounded-full z-0" />

      {/* Hero Image */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.9, delay: 0.2 }}
        className="z-10"
      >
        <Image
          src="/assets/hero/hero.jpg"
          alt="Tinivo Korean-style gift in hand"
          width={500}
          height={500}
          className="rounded-3xl shadow-xl"
          priority
        />
      </motion.div>
    </section>
  );
}
