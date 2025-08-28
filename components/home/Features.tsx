'use client';

import React from 'react';
import {
  Shield,
  Zap,
  Globe,
  CreditCard,
  Users,
  BarChart3,
  Lock,
  Clock,
  FileCheck,
  Wallet,
  UserCheck,
  TrendingUp,
  LucideIcon,
} from 'lucide-react';

interface Feature {
  icon: LucideIcon;
  title: string;
  description: string;
}

const features: Feature[] = [
  {
    icon: Lock,
    title: 'Bank-Grade Security',
    description:
      'Multi-layer encryption and blockchain-based security protocols protect every transaction.',
  },
  {
    icon: Clock,
    title: 'Instant Settlements',
    description:
      'Real-time payroll processing with sub-second transaction confirmation worldwide.',
  },
  {
    icon: FileCheck,
    title: 'Global Compliance',
    description:
      'Automated compliance with local labor laws and tax regulations in 150+ countries.',
  },
  {
    icon: Wallet,
    title: 'Multiple Payment Methods',
    description:
      'Support for crypto, traditional banking, digital wallets, and local payment systems.',
  },
  {
    icon: UserCheck,
    title: 'Team Management',
    description:
      'Comprehensive dashboard for managing global teams, contracts, and payment schedules.',
  },
  {
    icon: TrendingUp,
    title: 'Advanced Analytics',
    description:
      'Real-time insights into payroll costs, currency fluctuations, and team productivity.',
  },
];

export default function Features():  React.JSX.Element {
  return (
    <>
      
      <section className="features-section py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <div className="inline-flex items-center justify-center mb-8">
              <span className="section-badge">Core Features</span>
            </div>
            <h2 className="section-title text-4xl md:text-5xl font-bold mb-6">
              Everything you need for{' '}
              <span className="section-subtitle block">global payroll</span>
            </h2>
            <p className="section-description text-xl leading-relaxed">
              Our decentralized protocol handles the complexity of global payroll, so you
              can focus on growing your business.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="feature-card">
                <div className="geometric-pattern"></div>
                
                <div className="feature-emblem">
                  <div className="emblem-outer"></div>
                  <div className="emblem-inner"></div>
                  <div className="emblem-rays"></div>
                  <feature.icon className="emblem-icon" />
                </div>
                
                <h3 className="feature-title">{feature.title}</h3>
                <p className="feature-description">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
