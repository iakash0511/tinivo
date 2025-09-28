'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

const moments = [
  { emoji: '💌', title: 'Cheer Up a Friend', description: 'Send a tiny surprise to brighten their day.' },
  { emoji: '🎉', title: 'Celebrate Small Wins', description: 'Mini gifts for big accomplishments.' },
  { emoji: '💖', title: 'Daily Self-Love', description: 'Treat yourself — you’ve earned it.' },
  { emoji: '🎁', title: 'Just Because', description: 'No reason needed to spread joy.' },
];

export default function GiftingMoments() {
  const [userMoment, setUserMoment] = useState('');

  const handleSubmit = () => {
    if (!userMoment.trim()) return;
    console.log('User moment submitted:', userMoment); // Replace with analytics later
    setUserMoment('');
  };

  return (
    <section className="relative bg-light-bg py-20 px-4 text-neutral-dark overflow-hidden">
      {/* Background sparkles */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="animate-pulse-slow absolute top-10 left-10 w-2 h-2 bg-accent1 rounded-full opacity-50" />
        <div className="animate-pulse-slow absolute bottom-20 right-20 w-3 h-3 bg-accent2 rounded-full opacity-40" />
        <div className="animate-pulse-slow absolute top-1/2 left-1/3 w-1.5 h-1.5 bg-primary rounded-full opacity-30" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto text-center space-y-12">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="font-heading text-3xl md:text-4xl"
        >
          Moments Made Sweeter with <span className="bg-clip-text bg-gradient-to-r from-primary to-accent1/50 text-transparent">Tinivo</span>
        </motion.h2>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          viewport={{ once: true }}
          className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
        >
          {moments.map((moment, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.02 }}
              transition={{ type: 'spring', stiffness: 200 }}
              className={cn(
                'rounded-2xl bg-white shadow-md p-6 flex flex-col items-center text-center hover:shadow-lg transition-all'
              )}
            >
              <div className="text-4xl mb-3">{moment.emoji}</div>
              <h3 className="font-heading text-xl">{moment.title}</h3>
              <p className="text-body mt-2 text-sm">{moment.description}</p>
              <Button
                variant="ghost"
                className="mt-4 font-cta text-primary hover:underline"
                onClick={() => console.log(`Clicked: ${moment.title}`)} // Analytics placeholder
              >
                Shop the Mood
              </Button>
            </motion.div>
          ))}
        </motion.div>

        {/* Input for user-submitted moment */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          viewport={{ once: true }}
          className="max-w-xl mx-auto space-y-4"
        >
          <p className="text-sm text-neutral-dark">What’s your special moment?</p>
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <input
              type="text"
              value={userMoment}
              onChange={(e) => setUserMoment(e.target.value)}
              placeholder="e.g. Morning motivation for my bestie"
              className="w-full rounded-xl px-4 py-2 text-sm bg-white shadow-inner border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <Button variant="default" onClick={handleSubmit} className="font-cta text-white">
              Add Your Moment
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
