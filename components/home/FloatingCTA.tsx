'use client';

import React, { useState, useEffect } from 'react';
import { ArrowUpRight, X } from 'lucide-react';

export default function FloatingCTA(): React.JSX.Element | null {
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [isDismissed, setIsDismissed] = useState<boolean>(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY;
      const viewHeight = window.innerHeight;

      if (scrolled > viewHeight * 2 && !isDismissed) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isDismissed]);

  const handleDismiss = () => {
    setIsDismissed(true);
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-slide-up">
      <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 p-6 max-w-sm relative">
        <button
          onClick={handleDismiss}
          className="absolute top-3 right-3 p-1 text-gray-400 hover:text-gray-600 transition-colors"
          aria-label="Dismiss CTA"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="mb-4">
          <div className="flex items-center space-x-2 mb-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-teal-400 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">P</span>
            </div>
            <span className="font-semibold text-gray-900">PayFlow</span>
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-2">Ready to get started?</h3>
          <p className="text-sm text-gray-600 leading-relaxed">
            Join 500+ companies using PayFlow for seamless global payroll.
          </p>
        </div>

        <div className="space-y-3">
          <button className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold py-3 rounded-xl transition-all duration-200 flex items-center justify-center space-x-2 group">
            <span>Start Free Trial</span>
            <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </button>

          <button className="w-full border border-gray-300 hover:border-gray-400 text-gray-700 font-semibold py-3 rounded-xl transition-all duration-200 text-sm">
            Schedule Demo
          </button>
        </div>

        <div className="mt-4 text-center">
          <div className="flex items-center justify-center space-x-2 text-xs text-gray-500">
            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
            <span>Free • No credit card required</span>
          </div>
        </div>
      </div>
    </div>
  );
}
