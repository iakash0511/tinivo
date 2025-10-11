"use client"

import Image from "next/image"
import { useState } from "react"

export default function ProductGallery({ images }: { images: string[] }) {
  const [selected, setSelected] = useState(images[0])

  return (
    <div className="flex flex-col gap-4">
      <div className="relative w-full aspect-square rounded-2xl overflow-hidden bg-white shadow-sm">
        <Image
          src={selected}
          alt="Product"
          fill
          className="object-contain transition-all duration-300"
        />
      </div>
      <div className="flex gap-3 justify-center">
        {images.map((img) => (
          <button
            key={img}
            onClick={() => setSelected(img)}
            className={`relative w-16 h-16 rounded-xl overflow-hidden border-2 ${
              selected === img
                ? "border-primary"
                : "border-transparent opacity-70"
            }`}
          >
            <Image src={img} alt="thumb" fill className="object-cover" />
          </button>
        ))}
      </div>
    </div>
  )
}
