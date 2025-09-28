"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import { Logo } from "@/components/Logo";
import { ShoppingBag } from "lucide-react";
import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet";
import { useIsMobile } from "@/hooks/useIsMobile";
import { useCart } from "@/store/cart/cart-store";
import { useEffect, useRef } from "react";
const CartDrawer = dynamic(() => import('@/components/cart/CartDrawer'), { ssr: false });
export default function Header() {
  const totalItems = useCart((state) => state.totalItems());
  const isMobile = useIsMobile();
  const ref = useRef<SVGSVGElement>(null);
  useEffect(() => {
    ref.current?.classList.add('animate-bounce')
    if (totalItems > 0) ref.current?.classList.add('text-primary')
    let timerId = setTimeout(() => {
      ref.current?.classList.remove('animate-bounce')
      ref.current?.classList.remove('text-primary')
    }, 2000);
    return () => {
      clearTimeout(timerId)
      }
  },[totalItems])
  return (
    <header className="w-full sticky top-0 z-50 px-4 py-3 flex justify-between items-center border-b border-neutral-light shadow-sm bg-light-bg/40 backdrop-blur">
      <Link href="/" className="text-xl font-logo text-primary">
        <Logo size={80} className="object-cover" />
      </Link>

      <nav className="flex items-center space-x-6 font-heading text-sm">
        <Link href="#gifts" className="hover:text-primary">
          Gifts
        </Link>
        <Link href="#bestsellers" className="hover:text-primary">
          Bestsellers
        </Link>
        <Link href="#about" className="hover:text-primary">
          About
        </Link>

        <Sheet>
          <SheetTrigger asChild>
            <button className="relative">
              <ShoppingBag className="hover:text-primary" ref={ref}/>
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-primary text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </button>
          </SheetTrigger>
          <SheetContent side={isMobile ? "bottom" : "right"} className='h-full'>
            <CartDrawer />
          </SheetContent>
        </Sheet>
      </nav>
    </header>
  );
}
