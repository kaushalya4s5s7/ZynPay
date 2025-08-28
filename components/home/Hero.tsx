import { ArrowUpRight, Globe, Users, Zap } from 'lucide-react';
import React, { useState } from 'react';
import ServiceModal from '../intro/ServiceModal';

export default function Hero() {
   const [isModalOpen, setIsModalOpen] = useState(false);

    const openModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };
  return (
    <section className="relative min-h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50 overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-20 left-10 w-64 h-64 bg-gradient-to-r from-blue-200/30 to-teal-200/30 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-r from-teal-200/20 to-blue-200/20 rounded-full blur-3xl"></div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        <div className="text-center max-w-4xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center space-x-2 bg-white/80 backdrop-blur-sm rounded-full px-4 py-2 mb-8 border border-gray-200/50">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-sm text-gray-600 font-medium">Decentralized Global Payroll</span>
          </div>

          {/* Main headline */}
          <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight">
            The Future of 
            <span className="block bg-gradient-to-r from-blue-600 to-teal-500 bg-clip-text text-transparent">
              Global Payroll
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
            Seamlessly pay your global workforce with our decentralized protocol. 
            Instant, transparent, and compliant payroll across 150+ countries.
          </p>

          {/* CTA buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <button className="bg-gray-900 hover:bg-gray-800 text-white px-8 py-4 rounded-xl text-lg font-semibold transition-all duration-200 flex items-center space-x-2 group shadow-lg"
            onClick={openModal}>
              <span>Start Building</span>
              <ArrowUpRight className="w-5 h-5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </button>
            <button className="border border-gray-300 hover:border-gray-400 text-gray-700 px-8 py-4 rounded-xl text-lg font-semibold transition-all duration-200 bg-white/80 backdrop-blur-sm">
              View Documentation
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-2xl mx-auto">
            <div className="flex flex-col items-center space-y-2">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                <Globe className="w-6 h-6 text-white" />
              </div>
              <div className="text-2xl font-bold text-gray-900">150+</div>
              <div className="text-sm text-gray-600">Countries Supported</div>
            </div>
            <div className="flex flex-col items-center space-y-2">
              <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-teal-600 rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div className="text-2xl font-bold text-gray-900">10k+</div>
              <div className="text-sm text-gray-600">Active Workers</div>
            </div>
            <div className="flex flex-col items-center space-y-2">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <div className="text-2xl font-bold text-gray-900">&lt; 1s</div>
              <div className="text-sm text-gray-600">Transaction Speed</div>

            </div>
          </div>
        </div>
      </div>
                                <ServiceModal isOpen={isModalOpen} onClose={closeModal} />

    </section>
  );
}
