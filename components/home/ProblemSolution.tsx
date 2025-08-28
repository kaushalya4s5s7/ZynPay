"use client";

import Image from 'next/image';
import { X, Check, AlertTriangle, DollarSign, Clock, Shield } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ProblemSolution() {
  const problems = [
    {
      icon: <AlertTriangle className="text-red-500" size={24} />,
      title: "Manual Payroll Chaos",
      description: "Spending hours on spreadsheets, calculations, and compliance"
    },
    {
      icon: <DollarSign className="text-red-500" size={24} />,
      title: "Hidden Costs & Fees",
      description: "Expensive international transfers and unexpected charges"
    },
    {
      icon: <Clock className="text-red-500" size={24} />,
      title: "Delayed Payments",
      description: "Team members waiting weeks for their salaries"
    },
    {
      icon: <Shield className="text-red-500" size={24} />,
      title: "Compliance Nightmares",
      description: "Struggling with different tax laws across countries"
    }
  ];

  const solutions = [
    {
      icon: <Check className="text-green-500" size={24} />,
      title: "Automated Everything",
      description: "Set it once, runs forever. No manual calculations needed"
    },
    {
      icon: <Check className="text-green-500" size={24} />,
      title: "Transparent Pricing",
      description: "Fixed rates, no hidden fees, complete cost visibility"
    },
    {
      icon: <Check className="text-green-500" size={24} />,
      title: "Instant Payments",
      description: "Same-day payouts to 120+ countries worldwide"
    },
    {
      icon: <Check className="text-green-500" size={24} />,
      title: "Built-in Compliance",
      description: "Automatic tax calculations and regulatory compliance"
    }
  ];

  return (
    <section className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-black mb-6">
            Stop Fighting Payroll. Start Growing.
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Traditional payroll systems create more problems than they solve. 
            ZynPay eliminates every pain point with intelligent automation.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Problems */}
          <div>
            <div className="flex items-center mb-8">
              <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center mr-3">
                <X className="text-red-500" size={16} />
              </div>
              <h3 className="text-2xl font-bold text-black">Common Problems</h3>
            </div>

            <div className="space-y-6">
              {problems.map((problem, index) => (
                <motion.div 
                  key={index} 
                  className="bg-gradient-to-br from-red-100 via-red-200 to-red-300 border border-red-300/60 rounded-xl p-6 hover:shadow-lg hover:shadow-red-300/40 transition-all duration-300 backdrop-blur-sm"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ 
                    duration: 0.6, 
                    delay: index * 0.2,
                    ease: [0.25, 0.46, 0.45, 0.94]
                  }}
                  whileHover={{ scale: 1.02, y: -2 }}
                >
                  <div className="flex items-start">
                    <div className="mr-4 mt-1">{problem.icon}</div>
                    <div>
                      <h4 className="font-semibold text-black mb-2">{problem.title}</h4>
                      <p className="text-gray-700">{problem.description}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Solutions */}
          <div>
            <div className="flex items-center mb-8">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3">
                <Check className="text-green-500" size={16} />
              </div>
              <h3 className="text-2xl font-bold text-black">ZynPay Solutions</h3>
            </div>

            <div className="space-y-6">
              {solutions.map((solution, index) => (
                <motion.div 
                  key={index} 
                  className="bg-gradient-to-br from-green-100 via-green-200 to-green-300 border border-green-300/60 rounded-xl p-6 hover:shadow-lg hover:shadow-green-300/40 transition-all duration-300 backdrop-blur-sm"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ 
                    duration: 0.6, 
                    delay: index * 0.2,
                    ease: [0.25, 0.46, 0.45, 0.94]
                  }}
                  whileHover={{ scale: 1.02, y: -2 }}
                >
                  <div className="flex items-start">
                    <div className="mr-4 mt-1">{solution.icon}</div>
                    <div>
                      <h4 className="font-semibold text-black mb-2">{solution.title}</h4>
                      <p className="text-gray-700">{solution.description}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Background Image */}
        <div className="mt-16 relative rounded-2xl overflow-hidden h-64">
          <Image
            src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=1200&q=80"
            alt="Happy remote team"
            fill
            className="object-cover opacity-20"
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <h3 className="text-3xl font-bold text-black mb-4">Ready to Transform Your Payroll?</h3>
              <button className="bg-black text-white px-8 py-4 rounded-lg font-semibold hover:bg-gray-800 transition-colors">
                Start Your Free Trial
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
