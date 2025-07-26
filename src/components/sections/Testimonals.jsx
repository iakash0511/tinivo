'use client'

import { Card, CardContent } from "@/components/ui/card"
import { motion, useInView } from "framer-motion"
import { useRef } from "react"
import { Star } from "lucide-react"
import Image from "next/image"

const testimonials = [
  {
    quote: "I was blown away by the packaging and how thoughtfully everything was arranged. Tinivo makes gifting feel magical.",
    name: "Ishita Verma",
    avatar: "/avatars/ishita.jpg",
    rating: 5,
  },
  {
    quote: "The tiny things had such a big emotional impact. My friend loved it and cried! I'm coming back for more.",
    name: "Sneha Kapoor",
    avatar: "/avatars/sneha.jpg",
    rating: 5,
  },
  {
    quote: "From browsing to checkout, everything felt smooth. I didn’t expect such joy from a mini gift. Beautifully done!",
    name: "Rhea Malhotra",
    avatar: "/avatars/rhea.jpg",
    rating: 4,
  },
]

export default function Testimonials() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })

  return (
    <section
      id="testimonials"
      ref={ref}
      className="bg-light-bg py-20 px-4 sm:px-6 lg:px-12"
    >
      <div className="text-center mb-14">
        <h2 className="text-3xl md:text-4xl font-heading text-neutral-dark">
          Loved by Givers, Cherished by Receivers.
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {testimonials.map((t, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: index * 0.2, duration: 0.6, ease: "easeOut" }}
            whileHover={{ scale: 1.02 }}
          >
            <Card className="h-full shadow-sm hover:shadow-md transition-all rounded-2xl bg-white">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Image
                    src={t.avatar}
                    alt={t.name}
                    width={48}
                    height={48}
                    className="rounded-full object-cover"
                  />
                  <div>
                    <p className="text-sm font-medium text-neutral-dark font-cta">{t.name}</p>
                    <div className="flex gap-0.5 mt-1 text-accent1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={16}
                          fill={i < t.rating ? "currentColor" : "none"}
                          strokeWidth={1.2}
                        />
                      ))}
                    </div>
                  </div>
                </div>
                <p className="italic font-body text-neutral-dark">“{t.quote}”</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="text-center mt-16">
        <button
          className="px-6 py-3 rounded-full bg-primary text-white font-cta text-sm hover:bg-accent1 transition-all shadow-md"
        >
          💌 Add Your Story
        </button>
        <p className="mt-2 text-sm text-neutral-dark] font-body">
          Your little joy could inspire someone else ✨
        </p>
      </div>
    </section>
  )
}
