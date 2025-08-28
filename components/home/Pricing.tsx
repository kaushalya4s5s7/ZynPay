import { Check, ArrowRight, Zap } from 'lucide-react';
import React from 'react';

interface Plan {
  name: string;
  description: string;
  price: string;
  period: string;
  features: string[];
  cta: string;
  popular: boolean;
  color: string;
}

export default function Pricing(): React.JSX.Element {
  const plans: Plan[] = [
    {
      name: "Starter",
      description: "Perfect for small teams and startups",
      price: "0.25%",
      period: "per transaction",
      features: [
        "Up to 50 employees",
        "5 countries coverage",
        "Basic compliance",
        "Standard support",
        "Web dashboard",
        "Basic reporting"
      ],
      cta: "Start Free Trial",
      popular: false,
      color: "border-gray-200 bg-white"
    },
    {
      name: "Professional",
      description: "Ideal for growing companies",
      price: "0.15%",
      period: "per transaction",
      features: [
        "Up to 500 employees",
        "50+ countries coverage",
        "Advanced compliance",
        "Priority support",
        "Mobile app access",
        "Advanced analytics",
        "API integration",
        "Custom workflows"
      ],
      cta: "Start Free Trial",
      popular: true,
      color: "border-blue-500 bg-gradient-to-br from-blue-50 to-teal-50"
    },
    {
      name: "Enterprise",
      description: "For large organizations",
      price: "Custom",
      period: "volume pricing",
      features: [
        "Unlimited employees",
        "150+ countries coverage",
        "Full compliance suite",
        "Dedicated support",
        "White-label options",
        "Custom integrations",
        "SLA guarantees",
        "Advanced security"
      ],
      cta: "Contact Sales",
      popular: false,
      color: "border-purple-200 bg-gradient-to-br from-purple-50 to-pink-50"
    }
  ];

  return (
    <section id="pricing" className="py-20 bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-6">
            Simple, Transparent Pricing
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Pay only for what you use. No hidden fees, no setup costs, no monthly minimums. 
            Scale your payroll as your team grows.
          </p>
        </div>

        <div className="flex justify-center mb-12">
          <div className="bg-gray-100 p-1 rounded-full">
            <div className="flex">
              <button className="px-6 py-2 text-sm font-medium text-white bg-gray-900 rounded-full">
                Pay Per Transaction
              </button>
              <button className="px-6 py-2 text-sm font-medium text-gray-600 hover:text-gray-900">
                Monthly Plans
              </button>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 mb-16">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`relative rounded-3xl p-8 border-2 transition-all duration-300 hover:shadow-xl ${plan.color} ${
                plan.popular ? 'ring-2 ring-blue-500 ring-offset-2' : ''
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-medium flex items-center space-x-1">
                    <Zap className="w-4 h-4" />
                    <span>Most Popular</span>
                  </div>
                </div>
              )}

              <div className="space-y-6">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">{plan.name}</h3>
                  <p className="text-gray-600 mt-2">{plan.description}</p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-baseline space-x-2">
                    <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                    <span className="text-gray-600">{plan.period}</span>
                  </div>
                  {index === 0 && (
                    <div className="text-sm text-gray-500">$0.50 minimum per transaction</div>
                  )}
                </div>

                <ul className="space-y-4">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center space-x-3">
                      <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>

                <button className={`w-full py-4 px-6 rounded-full font-medium transition-all duration-200 flex items-center justify-center space-x-2 ${
                  plan.popular 
                    ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg hover:shadow-xl' 
                    : 'bg-gray-900 text-white hover:bg-gray-800 shadow-md hover:shadow-lg'
                }`}>
                  <span>{plan.cta}</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center space-y-6">
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8 border border-gray-100">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Volume Discounts Available</h3>
            <p className="text-gray-600 mb-6">
              Processing large volumes? Our enterprise plans offer custom pricing with significant discounts 
              for high-volume transactions and dedicated account management.
            </p>
            <div className="grid md:grid-cols-3 gap-6 text-center">
              <div>
                <div className="text-3xl font-bold text-blue-600 mb-2">$1M+</div>
                <div className="text-sm text-gray-600">Monthly volume gets 0.1% rate</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-green-600 mb-2">$10M+</div>
                <div className="text-sm text-gray-600">Monthly volume gets 0.05% rate</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-purple-600 mb-2">$50M+</div>
                <div className="text-sm text-gray-600">Contact us for custom pricing</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
