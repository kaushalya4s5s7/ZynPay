'use client';

import { useState, useEffect } from 'react';
import { Star, Quote } from 'lucide-react';
import Image from 'next/image';

const testimonials = [
  {
    quote: "ZynPay reduced our payroll processing time from 3 days to 30 minutes. The compliance features are incredible.",
    author: "Sarah Chen",
    role: "Head of People Operations",
    company: "TechFlow Inc.",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&q=80",
    rating: 5,
    metric: "90% time saved"
  },
  {
    quote: "Managing contractors across 15 countries was a nightmare. ZynPay made it seamless and stress-free.",
    author: "Marcus Rodriguez",
    role: "Finance Director",
    company: "Global Dynamics",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&q=80",
    rating: 5,
    metric: "15 countries, 0 compliance issues"
  },
  {
    quote: "The automated tax calculations saved us thousands in accounting fees. Best investment we've made.",
    author: "Emma Thompson",
    role: "CEO",
    company: "RemoteFirst Co.",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&q=80",
    rating: 5,
    metric: "$50K saved annually"
  },
  {
    quote: "Our remote team loves getting paid instantly. ZynPay's transparency builds trust with our employees.",
    author: "David Park",
    role: "Operations Manager",
    company: "Innovation Labs",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80",
    rating: 5,
    metric: "24hr average payout time"
  },
  {
    quote: "Setting up payroll in new countries takes minutes instead of months. Game-changing for our expansion.",
    author: "Lisa Wang",
    role: "VP of International",
    company: "ScaleUp Solutions",
    avatar: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=100&q=80",
    rating: 5,
    metric: "8 new markets launched"
  }
];

export default function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const current = testimonials[currentIndex];

  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-black mb-6">
            Loved by Teams Worldwide
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Don't just take our word for it. See what our customers say about transforming 
            their payroll operations with ZynPay.
          </p>
        </div>

        {/* Main Testimonial */}
        <div className="relative bg-gray-50 rounded-3xl p-8 lg:p-16 mb-12 overflow-hidden">
          <div className="absolute top-8 left-8 text-gray-300">
            <Quote size={64} />
          </div>
          <div className="relative z-10 max-w-4xl mx-auto text-center">
            <div className="flex justify-center mb-6">
              {[...Array(current.rating)].map((_, i) => (
                <Star key={i} className="text-yellow-400 fill-current" size={24} />
              ))}
            </div>
            <blockquote className="text-2xl lg:text-3xl font-medium text-black mb-8 leading-relaxed">
              "{current.quote}"
            </blockquote>
            <div className="flex items-center justify-center space-x-4">
              <Image
                src={current.avatar}
                alt={current.author}
                width={64}
                height={64}
                className="rounded-full object-cover"
              />
              <div className="text-left">
                <div className="font-semibold text-black text-lg">{current.author}</div>
                <div className="text-gray-600">{current.role} at {current.company}</div>
              </div>
            </div>
            <div className="mt-6 inline-flex items-center bg-black text-white px-6 py-2 rounded-full text-sm font-medium">
              {current.metric}
            </div>
          </div>
        </div>

        {/* Avatars Navigation */}
        <div className="flex justify-center items-center space-x-4 mb-12">
          {testimonials.map((t, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`relative group transition-all ${
                index === currentIndex ? 'scale-110' : 'scale-100 opacity-60'
              }`}
            >
              <Image
                src={t.avatar}
                alt={t.author}
                width={48}
                height={48}
                className="rounded-full object-cover border-2 border-transparent group-hover:border-black"
              />
              {index === currentIndex && (
                <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-black rounded-full" />
              )}
            </button>
          ))}
        </div>

        {/* Marquee */}
        <div className="overflow-hidden">
          <div className="flex space-x-8 animate-scroll">
            {[...testimonials, ...testimonials].map((t, index) => (
              <div key={index} className="flex-none w-80 bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                <div className="flex items-center mb-4">
                  <Image
                    src={t.avatar}
                    alt={t.author}
                    width={40}
                    height={40}
                    className="rounded-full object-cover mr-3"
                  />
                  <div>
                    <div className="font-semibold text-black text-sm">{t.author}</div>
                    <div className="text-gray-600 text-xs">{t.company}</div>
                  </div>
                </div>
                <div className="flex mb-3">
                  {[...Array(t.rating)].map((_, i) => (
                    <Star key={i} className="text-yellow-400 fill-current" size={14} />
                  ))}
                </div>
                <p className="text-gray-700 text-sm leading-relaxed">
                  "{t.quote}"
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
