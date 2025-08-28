'use client';

import { Users, Settings, FileText, Send } from 'lucide-react';
import Image from 'next/image';
import { useState, useEffect } from 'react';

export default function Workflow() {
  const [activeStep, setActiveStep] = useState(0);
  const [isInView, setIsInView] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const steps = [
    {
      number: '01',
      icon: <Users size={32} />,
      title: 'Add Employees',
      description:
        'Import your team from CSV or add manually. Include role, salary, and location details.',
      image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&q=80',
    },
    {
      number: '02',
      icon: <Settings size={32} />,
      title: 'Define Payment Rules',
      description:
        'Set up payment schedules, currencies, and local compliance rules automatically.',
      image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=600&q=80',
    },
    {
      number: '03',
      icon: <FileText size={32} />,
      title: 'Auto-generate Payslips',
      description:
        'Tax calculations, deductions, and payslips generated instantly for all countries.',
      image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=600&q=80',
    },
    {
      number: '04',
      icon: <Send size={32} />,
      title: '1-click Global Payout',
      description:
        'Send payments to 120+ countries with one click. No manual transfers needed.',
      image: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=600&q=80',
    },
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
        }
      },
      { 
        threshold: 0.2,
        rootMargin: '0px 0px -10% 0px'
      }
    );

    const section = document.getElementById('workflow-section');
    if (section) {
      observer.observe(section);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isInView) return;
    
    const interval = setInterval(() => {
      setIsTransitioning(true);
      
      // Small delay for smooth transition effect
      setTimeout(() => {
        setActiveStep((prev) => (prev + 1) % steps.length);
        setIsTransitioning(false);
      }, 150);
      
    }, 4000); // Increased to 4 seconds for better viewing

    return () => clearInterval(interval);
  }, [isInView, steps.length]);

  // Smooth scroll progress tracking
  useEffect(() => {
    const handleScroll = () => {
      const section = document.getElementById('workflow-section');
      if (!section) return;
      
      const rect = section.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const sectionHeight = rect.height;
      
      // Calculate scroll progress
      const scrolled = Math.max(0, Math.min(1, (windowHeight - rect.top) / (windowHeight + sectionHeight)));
      setScrollProgress(scrolled);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial call
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section 
      id="workflow-section" 
      className="py-24 bg-black relative overflow-hidden"
      style={{
        transform: `translateY(${(1 - scrollProgress) * 20}px)`,
        transition: 'transform 0.1s ease-out'
      }}
    >
      {/* Background gradient with smooth opacity */}
      <div 
        className="absolute inset-0 bg-gradient-to-b from-purple-900/20 via-black to-black transition-opacity duration-1000"
        style={{ opacity: scrollProgress }}
      ></div>
      
      {/* Animated background particles with enhanced smoothness */}
      <div className="absolute inset-0">
        <div 
          className="absolute top-1/4 left-1/4 w-2 h-2 bg-purple-500 rounded-full transition-all duration-1000 ease-out"
          style={{
            opacity: scrollProgress,
            transform: `scale(${scrollProgress}) rotate(${scrollProgress * 360}deg)`,
            animation: scrollProgress > 0.5 ? 'pulse 2s infinite' : 'none'
          }}
        ></div>
        <div 
          className="absolute top-3/4 right-1/4 w-1 h-1 bg-white rounded-full transition-all duration-1200 ease-out"
          style={{
            opacity: scrollProgress * 0.8,
            transform: `scale(${scrollProgress * 1.5})`,
            animation: scrollProgress > 0.3 ? 'ping 3s infinite' : 'none'
          }}
        ></div>
        <div 
          className="absolute bottom-1/4 left-1/3 w-1.5 h-1.5 bg-purple-400 rounded-full transition-all duration-800 ease-out"
          style={{
            opacity: scrollProgress * 0.9,
            transform: `translateY(${(1 - scrollProgress) * 10}px) scale(${scrollProgress})`,
            animation: scrollProgress > 0.7 ? 'pulse 2.5s infinite' : 'none'
          }}
        ></div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        <div 
          className="text-center mb-20 transition-all duration-1000 ease-out"
          style={{
            opacity: scrollProgress,
            transform: `translateY(${(1 - scrollProgress) * 30}px)`
          }}
        >
          <h2 className="text-5xl lg:text-6xl font-bold text-white mb-6">
            How <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-purple-600">ZynPay</span> Works
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            From setup to payout in 4 simple steps. Our platform handles the complexity,
            so you can focus on growing your business.
          </p>
        </div>

        {/* Desktop Version - Vertical Flow with Enhanced Smoothness */}
        <div className="hidden lg:block">
          <div className="max-w-4xl mx-auto">
            {steps.map((step, index) => (
              <div 
                key={step.number} 
                className="relative mb-16 last:mb-0"
                style={{
                  opacity: Math.max(0.3, Math.min(1, scrollProgress + (index * 0.1))),
                  transform: `translateY(${(1 - Math.min(1, scrollProgress + (index * 0.1))) * 40}px)`,
                  transition: 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)'
                }}
              >
                {/* Connecting line with smooth animation */}
                {index < steps.length - 1 && (
                  <div 
                    className="absolute left-1/2 top-full w-0.5 bg-gradient-to-b from-purple-500 to-transparent transform -translate-x-1/2 z-0 transition-all duration-1000 ease-out"
                    style={{
                      height: `${Math.min(64, scrollProgress * 64)}px`,
                      opacity: activeStep >= index ? 1 : 0.3
                    }}
                  ></div>
                )}
                
                <div className={`flex items-center gap-12 transition-all duration-1200 ease-out ${
                  activeStep === index 
                    ? 'opacity-100 scale-100 translate-y-0' 
                    : 'opacity-70 scale-98 translate-y-1'
                } ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'} ${
                  isTransitioning && activeStep === index ? 'animate-pulse' : ''
                }`}>
                  
                  {/* Content with staggered animation */}
                  <div 
                    className="flex-1 text-center lg:text-left transition-all duration-1000 ease-out"
                    style={{
                      transform: `translateX(${activeStep === index ? '0' : (index % 2 === 0 ? '-10px' : '10px')})`,
                      transition: 'transform 1s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.8s ease-out'
                    }}
                  >
                    <div className={`${index % 2 === 0 ? 'lg:text-left' : 'lg:text-right'}`}>
                      <div className="flex items-center justify-center lg:justify-start gap-4 mb-6">
                        <div className={`w-16 h-16 rounded-full flex items-center justify-center transition-all duration-700 ease-out ${
                          activeStep === index 
                            ? 'bg-gradient-to-r from-purple-500 to-purple-600 text-white scale-110 shadow-2xl shadow-purple-500/40 rotate-6' 
                            : 'bg-gray-800 text-gray-400 scale-100 rotate-0'
                        }`}>
                          {step.icon}
                        </div>
                        <span className={`text-6xl font-bold transition-all duration-700 ease-out ${
                          activeStep === index ? 'text-purple-500 scale-105' : 'text-gray-700 scale-100'
                        }`}>
                          {step.number}
                        </span>
                      </div>
                      
                      <h3 className={`text-3xl font-bold mb-4 transition-all duration-600 ease-out ${
                        activeStep === index ? 'text-white scale-105' : 'text-gray-400 scale-100'
                      }`}>
                        {step.title}
                      </h3>
                      
                      <p className={`text-lg leading-relaxed transition-all duration-500 ease-out ${
                        activeStep === index ? 'text-gray-300' : 'text-gray-500'
                      }`}>
                        {step.description}
                      </p>
                    </div>
                  </div>

                  {/* Image with enhanced smoothness */}
                  <div 
                    className="flex-1 transition-all duration-1000 ease-out"
                    style={{
                      transform: `translateX(${activeStep === index ? '0' : (index % 2 === 0 ? '10px' : '-10px')}) scale(${activeStep === index ? '1.02' : '0.98'})`,
                      transition: 'transform 1s cubic-bezier(0.4, 0, 0.2, 1)'
                    }}
                  >
                    <div className={`relative overflow-hidden rounded-2xl transition-all duration-900 ease-out ${
                      activeStep === index 
                        ? 'shadow-2xl shadow-purple-500/30 scale-105 rotate-1' 
                        : 'shadow-lg scale-100 rotate-0'
                    }`}>
                      <Image
                        src={step.image}
                        alt={step.title}
                        width={600}
                        height={400}
                        className="w-full h-80 object-cover transition-transform duration-700 ease-out"
                        style={{
                          transform: activeStep === index ? 'scale(1.1)' : 'scale(1)',
                          filter: activeStep === index ? 'brightness(1.1) contrast(1.1)' : 'brightness(0.9)'
                        }}
                      />
                      <div className={`absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent transition-all duration-500 ease-out ${
                        activeStep === index ? 'opacity-20' : 'opacity-50'
                      }`}></div>
                      
                      {/* Glow effect for active step */}
                      {activeStep === index && (
                        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-transparent animate-pulse"></div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Mobile Version - Cards with Enhanced Smoothness */}
        <div className="lg:hidden grid gap-8">
          {steps.map((step, index) => (
            <div 
              key={step.number} 
              className={`relative transition-all duration-1000 ease-out ${
                activeStep === index 
                  ? 'opacity-100 scale-100' 
                  : 'opacity-75 scale-97'
              }`}
              style={{
                transform: `translateY(${activeStep === index ? '0' : '5px'})`,
                transition: 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)'
              }}
            >
              <div className={`bg-gray-900 border rounded-2xl p-8 transition-all duration-700 ease-out ${
                activeStep === index 
                  ? 'border-purple-500 shadow-2xl shadow-purple-500/30 bg-gradient-to-br from-gray-900 to-gray-800' 
                  : 'border-gray-800 shadow-lg'
              }`}>
                <div className="flex items-center gap-4 mb-6">
                  <div className={`w-16 h-16 rounded-full flex items-center justify-center transition-all duration-600 ease-out ${
                    activeStep === index 
                      ? 'bg-gradient-to-r from-purple-500 to-purple-600 text-white scale-110 rotate-3' 
                      : 'bg-gray-800 text-gray-400 scale-100 rotate-0'
                  }`}>
                    {step.icon}
                  </div>
                  <span className={`text-5xl font-bold transition-all duration-500 ease-out ${
                    activeStep === index ? 'text-purple-500 scale-105' : 'text-gray-700 scale-100'
                  }`}>
                    {step.number}
                  </span>
                </div>

                <h3 className={`text-2xl font-bold mb-4 transition-all duration-500 ease-out ${
                  activeStep === index ? 'text-white scale-105' : 'text-gray-400 scale-100'
                }`}>
                  {step.title}
                </h3>
                
                <p className={`mb-6 transition-all duration-400 ease-out ${
                  activeStep === index ? 'text-gray-300' : 'text-gray-500'
                }`}>
                  {step.description}
                </p>

                <div className="aspect-video rounded-lg overflow-hidden">
                  <Image
                    src={step.image}
                    alt={step.title}
                    width={600}
                    height={400}
                    className="w-full h-full object-cover transition-all duration-700 ease-out"
                    style={{
                      transform: activeStep === index ? 'scale(1.05)' : 'scale(1)',
                      filter: activeStep === index ? 'brightness(1.1)' : 'brightness(0.9)'
                    }}
                  />
                </div>
                
                {/* Mobile glow effect */}
                {activeStep === index && (
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-transparent rounded-2xl pointer-events-none animate-pulse"></div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Progress indicators with smooth interactions */}
        <div 
          className="flex justify-center mt-16 gap-3 transition-all duration-500 ease-out"
          style={{
            opacity: scrollProgress,
            transform: `translateY(${(1 - scrollProgress) * 20}px)`
          }}
        >
          {steps.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setIsTransitioning(true);
                setTimeout(() => {
                  setActiveStep(index);
                  setIsTransitioning(false);
                }, 100);
              }}
              className={`rounded-full transition-all duration-500 ease-out hover:scale-150 ${
                activeStep === index 
                  ? 'w-8 h-3 bg-gradient-to-r from-purple-500 to-purple-600 scale-125 shadow-lg shadow-purple-500/30' 
                  : 'w-3 h-3 bg-gray-600 hover:bg-gray-500 scale-100'
              }`}
              style={{
                transform: activeStep === index ? 'scale(1.25)' : 'scale(1)',
                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
              }}
            />
          ))}
        </div>

        {/* CTA Section with smooth entrance */}
        <div 
          className="text-center mt-20 transition-all duration-1000 ease-out"
          style={{
            opacity: Math.max(0.5, scrollProgress),
            transform: `translateY(${(1 - scrollProgress) * 30}px)`
          }}
        >
          <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-3xl p-12 border border-gray-700">
            <h3 className="text-4xl font-bold text-white mb-6">
              Ready to streamline your payroll process?
            </h3>
            <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto leading-relaxed">
              Join thousands of companies who've automated their global payroll with ZynPay.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <button className="bg-gradient-to-r from-purple-500 to-purple-600 text-white px-10 py-4 rounded-xl font-semibold hover:from-purple-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg shadow-purple-500/25">
                Start Free Trial
              </button>
              <button className="border-2 border-gray-600 text-gray-300 px-10 py-4 rounded-xl font-semibold hover:border-purple-500 hover:text-white transition-all duration-300">
                Schedule Demo
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
