'use client';

import React, { useEffect, useRef } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { Logo } from '@/components/Logo';
import { ShoppingBag, Menu } from 'lucide-react';
import { Sheet, SheetTrigger, SheetContent, SheetClose } from '@/components/ui/sheet';
import { useIsMobile } from '@/hooks/useIsMobile';
import { useCart } from '@/store/cart/cart-store';
import { usePathname } from 'next/navigation';

const CartDrawer = dynamic(() => import('@/components/cart/CartDrawer'), { ssr: false });

export default function Header() {
  const pathname = usePathname();
  const totalItems = useCart((s) => s.totalItems());
  const isMobile = useIsMobile();
  const cartRef = useRef<SVGSVGElement | null>(null);

  const sections = [
    { name: 'Home', href: '/', show: true },
    { name: 'All Products', href: '/shop', show: true },
    { name: 'Bestsellers', href: '#bestsellers', show: pathname === '/' },
    { name: 'Our Story', href: '/our-story', show: true },
    { name: 'Track Order', href: '/orders', show: true },
    { name: 'Contact', href: '/contact', show: true },
  ];

  useEffect(() => {
    // subtle collectible animation when cart updates
    if (!cartRef.current) return;
    cartRef.current.classList.add('animate-bounce');
    if (totalItems > 0) cartRef.current.classList.add('text-primary');
    const t = setTimeout(() => {
      cartRef.current?.classList.remove('animate-bounce');
      cartRef.current?.classList.remove('text-primary');
    }, 1400);
    return () => clearTimeout(t);
  }, [totalItems]);

  return (
    <header className="w-full sticky top-0 z-50 px-4 py-3 bg-light-bg/40 backdrop-blur border-b border-neutral-light shadow-sm">
      {/* Grid: left control | center logo | right control */}
      <div className="max-w-6xl mx-auto grid grid-cols-3 items-center gap-2">
        {/* LEFT: Hamburger (mobile) OR nav links (desktop) */}
        <div className="flex items-center">
            <Sheet>
              <SheetTrigger asChild>
                <button
                  aria-label="Open navigation"
                  className="p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                >
                  <Menu className="w-6 h-6" />
                </button>
              </SheetTrigger>

              <SheetContent side="left" className="w-[86vw] max-w-xs bg-softPink">
                <nav className="py-6 px-4 space-y-4">
                  <div className="flex items-center justify-between mb-4">
                    <Link href="/" className="flex items-center gap-3">
                      <Logo size={56} />
                    </Link>
                  </div>

                  <ul className="flex flex-col space-y-3">
                    {sections.filter((s) => s.show).map((section) => (
                      <li key={section.name}>
                        <SheetClose asChild>
                          <Link
                            href={section.href}
                            className={`block py-2 px-2 rounded-md hover:bg-neutral-light/60 ${pathname === section.href ? 'text-primary font-semibold' : 'font-medium'}`}
                          >
                            {section.name}
                          </Link>
                        </SheetClose>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-6 border-t pt-4">
                    <SheetClose asChild>
                      <Link href="/shop?sort=bestseller&perPage=10&page=1" className="inline-block w-full text-center py-2 rounded-md font-cta" style={{ backgroundColor: 'var(--color-accent1)', color: '#fff' }}>
                        See Bestsellers
                      </Link>
                    </SheetClose>
                  </div>
                </nav>
              </SheetContent>
            </Sheet>
        </div>

        {/* CENTER: Logo (centered on mobile) */}
        <div className="flex items-center justify-center">
          {/* center link always - small size on mobile */}
          <Link href="/" className="inline-flex items-center">
            <span className="sr-only">Tinivo home</span>
            <Logo size={isMobile ? 64 : 80} className="block" />
          </Link>
        </div>

        {/* RIGHT: Cart (always on right) */}
        <div className="flex items-center justify-end">
          <Sheet>
            <SheetTrigger asChild>
              <button aria-label="Open cart" className="relative p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
                <ShoppingBag ref={cartRef} className="w-6 h-6" />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 bg-primary text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                    {totalItems}
                  </span>
                )}
              </button>
            </SheetTrigger>

            {/* Cart drawer side: bottom for mobile, right for desktop */}
            <SheetContent side={isMobile ? 'bottom' : 'right'} className={isMobile ? 'h-3/4' : 'w-[480px] h-full'}>
              <CartDrawer />
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
