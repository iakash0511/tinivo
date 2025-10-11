import React from "react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export default function CTAButton({ children, Icon, handleClick }: { children: React.ReactNode,Icon: React.ReactNode, handleClick?: () => void }) {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <Button
        className="text-lg px-8 py-6 rounded-2xl font-cta bg-primary text-white hover:bg-accent1 transition duration-300 shadow-xl relative group"
        size="lg"
        onClick={handleClick}
      >
        {Icon}
        {children}
      </Button>
    </motion.div>
  );
}
