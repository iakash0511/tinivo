'use client'

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'

export default function OurStoryPage() {
  return (
    <main
      className="min-h-screen pb-16"
      style={{ backgroundColor: 'var(--color-light-bg)', color: 'var(--color-neutral-dark)' }}
    >
      {/* Hero */}
      <section className="max-w-6xl mx-auto px-6 md:px-8 lg:px-12 py-12 md:py-20 grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
        <div className="space-y-6 animate-fade-up">
          <p className="inline-block px-3 py-1 rounded-full text-xs font-cta" style={{ backgroundColor: 'rgba(157,126,219,0.12)', color: 'var(--color-primary)' }}>
            Our Story
          </p>

          <h1 className="text-3xl md:text-4xl lg:text-5xl leading-tight font-heading font-semibold">
            Every little thing has a story — <span className="text-primary">ours begins with joy.</span>
          </h1>

          <p className="text-base md:text-lg max-w-xl font-body opacity-90">
            At Tinivo, we believe happiness doesn’t have to be loud. Sometimes it lives in tiny moments — a soft color, a thoughtful gift, a little thing that makes your day brighter.
          </p>

          <div className="flex items-center gap-4">
            <Link href="/shop" className="inline-flex items-center gap-3 px-5 py-3 rounded-2xl font-cta shadow-md transition-transform active:scale-95"
              style={{
                background: 'linear-gradient(90deg, var(--color-primary), var(--color-accent2))',
                color: '#fff'
              }}
            >
              🛍️ Explore the Collection
            </Link>

            <Link href="/shop?filter=gifts" className="text-sm font-medium font-body underline underline-offset-2 opacity-90">
              Gifts that feel like hugs →
            </Link>
          </div>
        </div>

        <div className="relative w-full h-[320px] md:h-[420px] rounded-2xl overflow-hidden shadow-soft animate-fade-in">
          {/* Replace with an actual hero image in /public/images/our-story-hero.jpg */}
          <Image
            src="/images/our-story-hero.jpg"
            alt="Tinivo - tiny joyful products displayed on a soft background"
            fill
            style={{ objectFit: 'cover', objectPosition: 'center' }}
            priority
          />
          {/* subtle overlay glow */}
          <div className="absolute inset-0 pointer-events-none" style={{ background: 'linear-gradient(180deg, rgba(157,126,219,0.06), rgba(255,183,213,0.02))' }} />
        </div>
      </section>

      {/* The Beginning */}
      <section className="max-w-5xl mx-auto px-6 md:px-8 lg:px-12 py-12 space-y-8">
        <div className="grid md:grid-cols-2 gap-8 items-start">
          <div className="animate-fade-up delay-100">
            <h2 className="text-2xl font-heading mb-4">✨ How it all started</h2>
            <p className="text-base font-body leading-relaxed">
              Tinivo began with one simple belief — <strong>small things can make big moments feel beautiful.</strong> We wanted a cozy corner for Korean/Kawaii-style mini treasures that spark joy, nostalgia, and self-love.
            </p>
          </div>

          <div className="animate-fade-up delay-200">
            <h3 className="text-lg font-heading mb-3">What we curate</h3>
            <ul className="list-inside space-y-2 text-sm font-body opacity-90">
              <li>• Mini stationery that makes writing fun</li>
              <li>• Tiny mirrors and décor that warm a desk</li>
              <li>• Gift-ready items wrapped with care</li>
            </ul>
          </div>
        </div>

        <hr className="border-t border-primary" />

        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div className="animate-fade-up delay-150">
            <h2 className="text-2xl font-heading mb-4">💭 What “Tinivo” means</h2>
            <p className="text-base font-body leading-relaxed">
              The name <strong>Tinivo</strong> comes from “tiny” + “vivid” — small, colorful happiness. Our goal is simple: help you feel something good every time you unwrap a Tinivo product.
            </p>
          </div>

          <div className="animate-fade-up delay-250">
            <h2 className="text-2xl font-heading mb-4">🎁 Our promise</h2>
            <p className="text-base font-body leading-relaxed">
              Every piece is chosen for aesthetic, emotion, and utility: mini yet meaningful, gifting-perfect, and inspired by calm Korean/Kawaii aesthetics. We don’t just sell things — we share feelings.
            </p>
          </div>
        </div>
      </section>

      {/* Philosophy & Vision */}
      <section className="border-t border-b border-primary">
        <div className="max-w-6xl mx-auto px-6 md:px-8 lg:px-12 py-12 text-center space-y-6">
          <h3 className="text-xl md:text-2xl font-heading">💌 Small Things. Big Joy.</h3>
          <p className="max-w-2xl mx-auto text-base font-body opacity-90">
            We believe joy lives in details. A small trinket can carry warmth — a soft color can change your mood. Tinivo celebrates these little details so you can find beauty in simplicity.
          </p>

          <div className="mt-4">
            <Link href="/shop" className="inline-block px-6 py-3 rounded-2xl font-cta shadow-md"
              style={{ backgroundColor: 'var(--color-accent1)', color: 'white' }}
            >
              🌸 Discover Joyful Minis
            </Link>
          </div>
        </div>
      </section>

      {/* Footer CTA Strip */}
      <section className="max-w-6xl mx-auto px-6 md:px-8 lg:px-12 py-10 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2">
          <p className="text-sm font-body opacity-90">“Tiny things, vivid emotions — that’s Tinivo.”</p>
          <p className="text-xs font-body opacity-70">Curated with care • Wrapped with love • Shipped from Chennai</p>
        </div>

        <div>
          <Link href="/shop?sort=bestseller&perPage=24&page=1" className="inline-block px-5 py-2 rounded-full font-cta"
            style={{ backgroundColor: 'transparent', border: '1px solid var(--color-primary)', color: 'var(--color-primary)' }}
          >
            See Bestsellers
          </Link>
        </div>
      </section>
    </main>
  )
}
