'use client'

import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'

const categories = [
  {
    emoji: '🖊️',
    title: 'Cute Stationery',
    description: 'Pens, planners, sticky notes – functional and adorable.',
  },
  {
    emoji: '🏠',
    title: 'Kawaii Home Decor',
    description: 'Miniatures & decor to brighten cozy spaces.',
  },
  {
    emoji: '🎁',
    title: 'Mini Gifts & Surprises',
    description: 'Perfect tiny gifts that make a big impression.',
  },
  {
    emoji: '💍',
    title: 'Korean-Inspired Accessories',
    description: 'Trendy hairclips, rings, and charm bracelets.',
  },
]

export default function WhatWeOffer() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section id="categories" className="py-20 bg-light-bg text-neutral-dark">
      <div className="max-w-6xl mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-4xl font-heading mb-4">
          What We Offer 💫
        </h2>
        <p className="max-w-2xl mx-auto font-body text-base mb-12">
          Discover handpicked mini products designed to spark joy, organize your space, and make every day feel special.
        </p>

        <div
          ref={ref}
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6"
        >
          {categories.map((cat, idx) => (
            <motion.div
              key={cat.title}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: idx * 0.2, duration: 0.5, ease: 'easeOut' }}
            >
              <Card className="hover:shadow-md transition-shadow duration-300 bg-white">
                <CardContent className="py-8 px-4 flex flex-col items-center text-center space-y-3">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={isInView ? { scale: 1 } : {}}
                    transition={{ delay: 0.2 + idx * 0.2, type: 'spring' }}
                    className="text-4xl"
                  >
                    {cat.emoji}
                  </motion.div>
                  <h3 className="font-heading text-lg">{cat.title}</h3>
                  <p className="text-sm font-body text-neutral-dark/70">
                    {cat.description}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
