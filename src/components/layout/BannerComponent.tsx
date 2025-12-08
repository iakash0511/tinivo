'use client';
import React from "react";
import Autoplay from "embla-carousel-autoplay"
import { Carousel, CarouselContent, CarouselItem } from "../ui/carousel";
import { usePathname } from "next/navigation";

export default function BannerComponent() {
    const curentPath = usePathname();
    if (curentPath !== "/") return null;

    const banners = [{heading: "Free Shipping🚛", subheading: "On Orders Over ₹999💸"},
    {heading: "New Arrivals📢", subheading: "Check Out Our Latest Collection👇"}];
    return (
        <Carousel 
        opts={{ align: 'start', loop: true, duration: 20, direction: 'ltr'}} 
        className="bg-primary opacity-95 text-black px-2 py-1 text-center w-full"
        plugins={[Autoplay({ delay: 3000, stopOnInteraction: true })]}
        >
            <CarouselContent>
                {banners?.map((banner, idx) => (
                    <CarouselItem className="flex flex-col items-center gap-1" key={idx+banner.heading}>
                    <p className='text-sm italic font-semibold'>{banner.heading}</p>
                    <p className="text-xs font-bold text-white">{banner.subheading}</p>
                </CarouselItem>))}
            </CarouselContent>
        </Carousel>
    );
}