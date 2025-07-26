'use client'

import { motion } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'

const fadeInStagger = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.2,
      duration: 0.6,
      ease: 'easeOut',
    },
  }),
}

const reasons = [
  {
    emoji: '💗',
    title: 'Curated With Care',
    description: <span>Every item is thoughtfully handpicked for charm, quality, and that unmistakable <span className='group-hover:text-accent1 text-primary underline font-bold'>“aww”</span> factor.</span>,
  },
  {
    emoji: '🎁',
    title: 'Wrapped With Love',
    description: <span>Unboxing <span className='group-hover:text-accent1 text-primary underline font-bold'>Tinivo</span> feels like opening a warm hug — whether it’s a gift for someone you love or a little treat for yourself.</span>,
  },
  {
    emoji: '🌟',
    title: 'Joy in Every Box',
    description: <span>From surprise goodies to handwritten notes, every delivery is our way of sending you <span className='group-hover:text-accent1 text-primary underline font-bold'>joy</span> — one box at a time.</span>,
  },
]

export default function WhyTinivoSection() {
  return (
    <section className="relative bg-light-bg py-16 px-4 sm:px-8 md:px-16 overflow-hidden">

      <div className="max-w-6xl mx-auto text-center relative z-10">
        <h2 className="text-3xl md:text-4xl font-heading text-neutral-dark mb-8">
          💖 Why Our Customers Choose <span className='text-primary font-medium'>Tinivo</span>
        </h2>
        <p className="text-neutral-dark max-w-xl mx-auto font-body mb-12 text-base md:text-lg">
          We're not just another cute store —  <span className='text-primary font-medium'>Tinivo</span> is where tiny surprises bring big smiles and even bigger emotions.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {reasons.map((reason, index) => (
            <motion.div
              key={index}
              className="h-full"
              initial="hidden"  
              whileInView="visible"
              viewport={{ once: true, amount: 0.4 }}
              custom={index}
              variants={fadeInStagger}
            >
              <Card className="bg-white group border-0 shadow-md hover:shadow-xl transition-shadow duration-300 rounded-2xl p-6 h-full">
                <CardContent className="flex flex-col gap-4 items-center text-center text-2xl sm:text-3xl">
                    {reason.emoji}
                  <h3 className="font-heading text-xl group-hover:text-accent1 text-primary">{reason.title}</h3>
                  <p className="text-sm text-neutral-dark font-body">{reason.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* CTA Button with Glow Hover */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          viewport={{ once: true }}
          className="mt-10"
        >
          <a
            href="#shop"
            className="inline-block group font-cta text-white bg-primary px-6 py-3 rounded-full text-sm md:text-base transition duration-300 shadow-md hover:shadow-[0_0_20px_var(--color-accent1) hover:bg-accent1"
          >
            👉 Explore the <span className='font-extrabold'>Tinivo</span> Way →
          </a>
        </motion.div>
      </div>
    </section>
  )
}
