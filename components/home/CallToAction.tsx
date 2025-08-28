'use client';

import { ArrowUpRight, Rocket, Users, Globe } from 'lucide-react';
import React from 'react';

const badges: string[] = ['SOC 2 Certified', 'ISO 27001', 'GDPR Compliant', 'Bank-Grade Security'];

export default function CallToAction(): React.JSX.Element {
  return (
    <section className="py-24 bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-teal-500/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-blue-500/10 to-teal-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-4xl mx-auto mb-16">
          <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-8">
            <Rocket className="w-4 h-4 text-white" />
            <span className="text-sm text-white font-medium">Ready to Get Started?</span>
          </div>

          <h2 className="text-5xl md:text-7xl font-bold text-white mb-8 leading-tight">
            Transform your
            <span className="block bg-gradient-to-r from-blue-400 to-teal-400 bg-clip-text text-transparent">
              global payroll today
            </span>
          </h2>

          <p className="text-2xl text-gray-300 mb-12 leading-relaxed">
            Join thousands of companies that have revolutionized their payroll with PayFlow.
            Start your free trial and see the difference in minutes.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
            <button className="bg-white hover:bg-gray-50 text-gray-900 px-8 py-4 rounded-xl text-lg font-semibold transition-all duration-200 flex items-center space-x-2 group shadow-lg">
              <span>Start Free Trial</span>
              <ArrowUpRight className="w-5 h-5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </button>
            <button className="border-2 border-white/30 hover:border-white/50 text-white px-8 py-4 rounded-xl text-lg font-semibold transition-all duration-200 backdrop-blur-sm">
              Schedule a Demo
            </button>
          </div>
        </div>

        {/* Trust indicators */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto">
          <div className="text-center">
            <div className="w-16 h-16 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-white" />
            </div>
            <div className="text-2xl font-bold text-white mb-2">10,000+</div>
            <div className="text-gray-300">Happy Workers Worldwide</div>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Globe className="w-8 h-8 text-white" />
            </div>
            <div className="text-2xl font-bold text-white mb-2">150+</div>
            <div className="text-gray-300">Countries Supported</div>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Rocket className="w-8 h-8 text-white" />
            </div>
            <div className="text-2xl font-bold text-white mb-2">99.9%</div>
            <div className="text-gray-300">Uptime Guarantee</div>
          </div>
        </div>

        {/* Security badges */}
        <div className="mt-16 text-center">
          <p className="text-gray-400 mb-6">Trusted by leading companies worldwide</p>
          <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
            {badges.map((badge, index) => (
              <div key={index} className="bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2">
                <span className="text-white text-sm font-medium">{badge}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Final message */}
        <div className="mt-16 text-center">
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 max-w-2xl mx-auto border border-white/10">
            <h3 className="text-2xl font-bold text-white mb-4">
              Ready in 5 Minutes
            </h3>
            <p className="text-gray-300 leading-relaxed">
              Set up your global payroll system in minutes, not months.
              Our team will help you migrate and get started with zero downtime.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
