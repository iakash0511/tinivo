'use client'
import { useEffect } from "react";
import { pushViewItem } from "@/lib/analyticsPush";
import { Product } from "@/interface/ProductInterface";

export default function ViewItemClient({ product }: { product: Product }) {
  useEffect(() => {
    if (!product) return;
    try {
      pushViewItem(product);
    } catch (e) {
      console.warn("view item push failed", e);
    }
  }, [product]);

  return null;
}
