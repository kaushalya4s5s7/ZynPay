'use client';

import { useState } from 'react';
import { Users, User, Building2, ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';

export default function UseCases() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const useCases = [
    {
      icon: <Users size={48} />,
      title: 'Remote Teams',
      subtitle: 'Distributed workforce management',
      description:
        'Pay your remote team members across different countries with ease. Handle time zones, currencies, and compliance automatically.',
      benefits: ['Multi-currency payouts', 'Time zone management', 'Remote compliance'],
      image: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=600&q=80',
      stats: '85% of our customers manage remote teams',
    },
    {
      icon: <User size={48} />,
      title: 'Freelancer Payments',
      subtitle: 'Independent contractor management',
      description:
        'Streamline payments to freelancers and contractors worldwide. Generate compliant invoices and handle tax documentation.',
      benefits: ['Invoice generation', 'Tax documentation', 'Global contractor support'],
      image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&q=80',
      stats: '50+ freelancer platforms integrate with us',
    },
    {
      icon: <Building2 size={48} />,
      title: 'Enterprise Payroll',
      subtitle: 'Large-scale operations',
      description:
        'Scale your payroll operations across multiple subsidiaries and countries. Enterprise-grade security and reporting.',
      benefits: ['Multi-entity support', 'Advanced reporting', 'Dedicated support'],
      image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&q=80',
      stats: 'Fortune 500 companies trust our platform',
    },
  ];

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % useCases.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + useCases.length) % useCases.length);

  return (
    <section className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-black mb-6">Built for Every Business Model</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Whether you're managing remote teams, paying freelancers, or running enterprise operations,
            ZynPay adapts to your unique needs.
          </p>
        </div>

        {/* Desktop */}
        <div className="hidden lg:grid lg:grid-cols-3 gap-8 mb-16">
          {useCases.map((useCase, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-200 hover:shadow-lg transition-all duration-300 group"
            >
              <div className="aspect-video overflow-hidden">
                <Image
                  src={useCase.image}
                  alt={useCase.title}
                  width={600}
                  height={340}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>

              <div className="p-8">
                <div className="text-black mb-4 group-hover:scale-110 transition-transform">{useCase.icon}</div>
                <h3 className="text-2xl font-bold text-black mb-2">{useCase.title}</h3>
                <p className="text-sm font-medium text-gray-500 mb-4">{useCase.subtitle}</p>
                <p className="text-gray-600 mb-6">{useCase.description}</p>

                <div className="space-y-2 mb-6">
                  {useCase.benefits.map((benefit, i) => (
                    <div key={i} className="flex items-center">
                      <div className="w-2 h-2 bg-black rounded-full mr-3" />
                      <span className="text-sm text-gray-600">{benefit}</span>
                    </div>
                  ))}
                </div>

                <div className="text-sm font-medium text-black bg-gray-50 px-4 py-2 rounded-lg">{useCase.stats}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Mobile */}
        <div className="lg:hidden">
          <div className="relative">
            <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-200">
              <div className="aspect-video overflow-hidden">
                <Image
                  src={useCases[currentSlide].image}
                  alt={useCases[currentSlide].title}
                  width={600}
                  height={340}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="p-8">
                <div className="text-black mb-4">{useCases[currentSlide].icon}</div>
                <h3 className="text-2xl font-bold text-black mb-2">{useCases[currentSlide].title}</h3>
                <p className="text-sm font-medium text-gray-500 mb-4">{useCases[currentSlide].subtitle}</p>
                <p className="text-gray-600 mb-6">{useCases[currentSlide].description}</p>

                <div className="space-y-2 mb-6">
                  {useCases[currentSlide].benefits.map((benefit, i) => (
                    <div key={i} className="flex items-center">
                      <div className="w-2 h-2 bg-black rounded-full mr-3" />
                      <span className="text-sm text-gray-600">{benefit}</span>
                    </div>
                  ))}
                </div>

                <div className="text-sm font-medium text-black bg-gray-50 px-4 py-2 rounded-lg">
                  {useCases[currentSlide].stats}
                </div>
              </div>
            </div>

            {/* Controls */}
            <div className="flex justify-between items-center mt-6">
              <button
                onClick={prevSlide}
                className="p-3 bg-white border border-gray-200 rounded-full hover:bg-gray-50 transition-colors"
              >
                <ChevronLeft size={20} />
              </button>
              <div className="flex space-x-2">
                {useCases.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentSlide(index)}
                    className={`w-3 h-3 rounded-full transition-colors ${
                      index === currentSlide ? 'bg-black' : 'bg-gray-300'
                    }`}
                  />
                ))}
              </div>
              <button
                onClick={nextSlide}
                className="p-3 bg-white border border-gray-200 rounded-full hover:bg-gray-50 transition-colors"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-16">
          <h3 className="text-3xl font-bold text-black mb-4">Find Your Perfect Payroll Solution</h3>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Not sure which solution fits your business? Let's chat and find the perfect setup for your team.
          </p>
          <button className="bg-black text-white px-8 py-4 rounded-lg font-semibold hover:bg-gray-800 transition-colors">
            Get Personalized Recommendation
          </button>
        </div>
      </div>
    </section>
  );
}
