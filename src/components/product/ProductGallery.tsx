"use client"

import Image from "next/image"
import { useState, useEffect } from "react"

export default function ProductGallery({ images }: { images: string[] }) {
  // 1. Initialize state. We use 'null' initially to be explicit.
  const [selected, setSelected] = useState<string | null>(null)
  const [mounted, setMounted] = useState(false)

  // 2. Sync state when the component mounts and when 'images' changes
  useEffect(() => {
    setMounted(true)
    if (images && images.length > 0) {
      setSelected(images[0])
    }
  }, [images])

  // 3. To prevent hydration errors, we can return a placeholder 
  // until the component has mounted on the client.
  if (!mounted || !selected) {
    return <div className="max-w-sm aspect-square bg-white rounded-2xl animate-pulse" />
  }

  return (
    <div className="flex flex-col gap-4 max-w-sm">
      {/* Main Image */}
      <div className="relative w-full aspect-square rounded-2xl overflow-hidden bg-white shadow-sm">
        <Image
          src={selected}
          alt="Product Display"
          fill
          priority
          className="object-contain transition-all duration-300"
        />
      </div>

      {/* Thumbnails */}
      <div className="flex gap-3 overflow-x-auto snap-x snap-mandatory pb-2 scrollbar-hide">
        {images.map((img, index) => (
          <button
            key={`${img}-${index}`}
            onClick={() => setSelected(img)}
            className={`relative snap-start w-10 h-12 sm:w-14 sm:h-14 shrink-0 rounded-xl overflow-hidden border-2 transition-all ${              selected === img
                ? "border-primary scale-105"
                : "border-transparent opacity-60 hover:opacity-100"
            }`}
          >
            <Image 
              src={img} 
              alt={`Thumbnail ${index + 1}`} 
              fill 
              className="object-cover" 
            />
          </button>
        ))}
      </div>
    </div>
  )
}