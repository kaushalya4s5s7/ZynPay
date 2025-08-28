'use client';

import { ArrowRight, Shield, Zap, Globe2, Users, TrendingUp } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import ServiceModal from '../intro/ServiceModal';
import { Globe } from '@/components/magicui/globe';

export default function Hero() {
   const [isModalOpen, setIsModalOpen] = useState(false);

    const openModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };
  return (
    <>
      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');
        
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          33% { transform: translateY(-10px) rotate(1deg); }
          66% { transform: translateY(5px) rotate(-1deg); }
        }
        
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        
        @keyframes aurora {
          0%, 100% { transform: translateX(-10%) scale(1); opacity: 0.3; }
          50% { transform: translateX(10%) scale(1.1); opacity: 0.6; }
        }
        
        @keyframes slideUp {
          from { transform: translateY(30px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 1; }
        }
        
        .hero-section {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
          background: linear-gradient(135deg, 
            #f8fafc 0%, 
            #e2e8f0 25%, 
            #cbd5e1 50%, 
            #94a3b8 75%, 
            #64748b 100%);
          position: relative;
          overflow: hidden;
        }
        
        .noise-texture {
          background-image: 
            radial-gradient(circle at 20% 30%, rgba(59, 130, 246, 0.03) 1px, transparent 1px),
            radial-gradient(circle at 80% 70%, rgba(139, 92, 246, 0.02) 1px, transparent 1px),
            radial-gradient(circle at 40% 80%, rgba(236, 72, 153, 0.015) 1px, transparent 1px);
          background-size: 60px 60px, 80px 80px, 100px 100px;
          animation: float 20s ease-in-out infinite;
        }
        
        .aurora-bg {
          background: radial-gradient(ellipse 800px 400px at 20% 30%, 
            rgba(59, 130, 246, 0.15) 0%, 
            rgba(139, 92, 246, 0.1) 40%, 
            transparent 70%);
          animation: aurora 15s ease-in-out infinite;
        }
        
        .aurora-bg-2 {
          background: radial-gradient(ellipse 600px 300px at 80% 70%, 
            rgba(236, 72, 153, 0.1) 0%, 
            rgba(59, 130, 246, 0.08) 40%, 
            transparent 70%);
          animation: aurora 18s ease-in-out infinite reverse;
        }
        
        .glass-card {
          background: rgba(255, 255, 255, 0.15);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          box-shadow: 
            0 8px 32px 0 rgba(31, 38, 135, 0.37),
            inset 0 1px 0 0 rgba(255, 255, 255, 0.3);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .glass-card:hover {
          transform: translateY(-5px);
          box-shadow: 
            0 20px 40px 0 rgba(31, 38, 135, 0.5),
            inset 0 1px 0 0 rgba(255, 255, 255, 0.4);
          border-color: rgba(255, 255, 255, 0.3);
        }
        
        .feature-bar {
          background: rgba(255, 255, 255, 0.2);
          backdrop-filter: blur(25px);
          -webkit-backdrop-filter: blur(25px);
          border: 1px solid rgba(255, 255, 255, 0.25);
          box-shadow: 
            0 4px 20px 0 rgba(31, 38, 135, 0.2),
            inset 0 1px 0 0 rgba(255, 255, 255, 0.4);
          animation: slideUp 0.8s ease-out;
        }
        
        .shimmer-text {
          background: linear-gradient(
            90deg,
            #0f172a 0%,
            #1e293b 25%,
            #3b82f6 50%,
            #1e293b 75%,
            #0f172a 100%
          );
          background-size: 200% 100%;
          background-clip: text;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: shimmer 3s ease-in-out infinite;
        }
        
        .cta-button {
          background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
          border: 1px solid rgba(59, 130, 246, 0.3);
          box-shadow: 
            0 4px 15px 0 rgba(59, 130, 246, 0.4),
            inset 0 1px 0 0 rgba(255, 255, 255, 0.2);
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }
        
        .metric-card {
          background: rgba(255, 255, 255, 0.15);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          box-shadow: 
            0 8px 32px 0 rgba(31, 38, 135, 0.37),
            inset 0 1px 0 0 rgba(255, 255, 255, 0.3);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          overflow: hidden;
        }
        
        .metric-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-image: url('https://framerusercontent.com/images/VSKXXbby1d8KiLHkPqnzNbqnFM.png?scale-down-to=2048');
          background-size: cover;
          background-position: center;
          background-repeat: no-repeat;
          opacity: 0.3;
          z-index: -1;
          pointer-events: none;
        }
        
        .metric-card:hover {
          background: rgba(255, 255, 255, 0.25);
          border-color: rgba(255, 255, 255, 0.3);
          transform: translateY(-2px);
        }
        
        .metric-card:hover::before {
          opacity: 0.2;
        }
        .cta-button-bg {
          position: absolute;
          border-radius: inherit;
          top: 0;
          right: 0;
          bottom: 0;
          left: 0;
          background-image: url('https://framerusercontent.com/images/6mcf62RlDfRfU61Yg5vb2pefpi4.png');
          background-repeat: repeat;
          background-position: left top;
          border: 0;
          background-size: 246px auto;
          z-index: 0;
          pointer-events: none;
        }
        
        .metric-card:nth-child(1) { animation-delay: 0s; }
        .metric-card:nth-child(2) { animation-delay: 2s; }
        .metric-card:nth-child(3) { animation-delay: 4s; }
        
        .globe-glow {
          filter: drop-shadow(0 0 50px rgba(79, 150, 255, 0.4)) drop-shadow(0 0 25px rgba(255, 255, 255, 0.1));
        }
        
        .text-shadow-soft {
          text-shadow: 0 2px 20px rgba(0, 0, 0, 0.1);
        }
        
        .icon-glow {
          filter: drop-shadow(0 0 10px rgba(59, 130, 246, 0.4));
        }
      `}</style>

      <section className="hero-section relative h-screen flex flex-col items-center justify-center overflow-hidden">
        {/* Dynamic Background Layers */}
        <div className="absolute inset-0">
          {/* Framer-inspired image overlay for visual effect */}
          <img
            src="https://framerusercontent.com/images/VSKXXbby1d8KiLHkPqnzNbqnFM.png?scale-down-to=2048"
            alt="IgnytLabs Gradient Overlay"
            className="absolute inset-0 w-full h-full object-cover pointer-events-none select-none"
            style={{ opacity: 0.45, zIndex: 1 }}
          />
          {/* Base Aurora Gradients */}
          <div className="absolute inset-0 aurora-bg"></div>
          <div className="absolute inset-0 aurora-bg-2"></div>
          
          {/* Noise Texture Overlay */}
          <div className="absolute inset-0 noise-texture"></div>
          
          {/* Gradient Theme Overlay - Inspired by the image */}
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/30 via-purple-50/20 via-pink-50/15 via-orange-50/10 to-yellow-50/20"></div>
          <div className="absolute inset-0 bg-gradient-to-tl from-blue-100/25 via-violet-100/15 via-rose-100/10 to-amber-100/15"></div>
          
          {/* Additional atmospheric gradient layers */}
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-100/20 via-transparent via-purple-100/15 to-pink-100/20"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-blue-50/30 via-transparent via-violet-50/20 to-rose-50/25"></div>
          
          {/* Subtle Edge Vignetting */}
          <div className="absolute inset-0 bg-gradient-to-r from-slate-100/20 via-transparent to-slate-100/20"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-slate-50/30 via-transparent to-slate-100/40"></div>
        </div>

        {/* Large Globe Background */}
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <div className="relative w-[120vh] h-[120vh] max-w-[800px] max-h-[800px]">
            
            {/* Globe Ambient Lighting Effects */}
            <div className="absolute inset-0">
              {/* Navy highlight - left side */}
              <div className="absolute -left-16 top-1/2 transform -translate-y-1/2 w-32 h-64 bg-blue-900/25 blur-3xl rounded-full"></div>
              
              {/* Pink highlight - top right */}
              <div className="absolute -top-16 -right-16 w-40 h-40 bg-pink-400/20 blur-3xl rounded-full"></div>
              
              {/* Violet highlight - bottom */}
              <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 w-48 h-32 bg-violet-500/18 blur-3xl rounded-full"></div>
              
              {/* Additional subtle navy glow */}
              <div className="absolute -left-8 top-1/3 w-24 h-48 bg-indigo-800/20 blur-2xl rounded-full"></div>
              
              {/* Soft pink accent - right side */}
              <div className="absolute -right-8 bottom-1/3 w-28 h-36 bg-rose-300/15 blur-2xl rounded-full"></div>
              
              {/* Central glow for globe definition */}
              <div className="absolute inset-0 bg-radial-gradient from-white/5 via-transparent to-transparent"></div>
            </div>
            
            <div className="absolute inset-0 globe-glow">
              <Globe 
                className="w-full h-full opacity-55"
                config={{
                  width: 1200,
                  height: 1200,
                  onRender: () => {},
                  devicePixelRatio: 2,
                  phi: 0,
                  theta: 0.3,
                  dark: 0,
                  diffuse: 0.9,
                  mapSamples: 16000,
                  mapBrightness: 0.45,
                  baseColor: [0.7, 0.8, 0.9],
                  markerColor: [79 / 255, 150 / 255, 255 / 255],
                  glowColor: [0.7, 0.8, 0.9],
                  markers: [
                    { location: [14.5995, 120.9842], size: 0.03 },
                    { location: [19.076, 72.8777], size: 0.1 },
                    { location: [23.8103, 90.4125], size: 0.05 },
                    { location: [30.0444, 31.2357], size: 0.07 },
                    { location: [39.9042, 116.4074], size: 0.08 },
                    { location: [-23.5505, -46.6333], size: 0.1 },
                    { location: [19.4326, -99.1332], size: 0.1 },
                    { location: [40.7128, -74.006], size: 0.1 },
                    { location: [34.6937, 135.5022], size: 0.05 },
                    { location: [41.0082, 28.9784], size: 0.06 },
                  ],
                }}
              />
            </div>
          </div>
        </div>

        {/* Content Container - Overlaid on Globe */}
        <div className="relative z-30 w-full h-full flex flex-col items-center justify-center px-4 md:px-6">
          
          {/* Feature Bar - Top */}
         

          {/* Main Hero Content - Center */}
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-3xl md:text-5xl lg:text-6xl xl:text-7xl font-black leading-tight mb-4 text-shadow-soft">
              <span className="text-slate-900">Decentralised</span>
              <br />
              <span className="shimmer-text">P2P & Payroll Protocol</span>
              <br />
             
            </h1>
            
            <p className="text-lg md:text-xl text-slate-600 mb-8 max-w-2xl mx-auto leading-relaxed">
              Experience the future of decentralized payroll. 
              <span className="font-semibold text-slate-700"> Secure</span>, 
              <span className="font-semibold text-slate-700"> instant</span>, and 
              <span className="font-semibold text-slate-700"> globally compliant</span>.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
              <button className="cta-button px-8 py-4 rounded-full text-white font-semibold flex items-center space-x-2 text-lg" onClick={openModal}>
                <span style={{position:'relative',zIndex:2}}>Start Building</span>
                <ArrowRight className="w-5 h-5" style={{position:'relative',zIndex:2}} />
                <span className="cta-button-bg" />
              </button>
              
              <button className="glass-card px-8 py-4 rounded-full text-slate-700 font-semibold flex items-center space-x-2 text-lg">
                <span>Watch Demo</span>
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
              </button>
            </div>
          </div>

          {/* Feature Cards - Bottom Left */}
          <div className="absolute bottom-8 left-8 hidden lg:block">
            <div className="glass-card rounded-xl p-4 w-56">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center icon-glow">
                  <Shield className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-slate-800">Bank-Grade Security</h3>
                  <p className="text-xs text-slate-600">Multi-layer encryption</p>
                </div>
              </div>
            </div>
          </div>

          {/* Feature Cards - Bottom Right */}
          <div className="absolute bottom-8 right-8 hidden lg:block">
            <div className="glass-card rounded-xl p-4 w-56">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center icon-glow">
                  <Globe2 className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-slate-800">Global Compliance</h3>
                  <p className="text-xs text-slate-600">150+ countries</p>
                </div>
              </div>
            </div>
          </div>

          {/* Metric Cards - Bottom Center */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 hidden md:flex">
            <div className="metric-card rounded-l-lg px-4 py-3 flex items-center space-x-2 border-r-0" style={{ position: 'relative', zIndex: 2 }}>
              <Users className="w-4 h-4 text-blue-600" style={{ position: 'relative', zIndex: 3 }} />
              <div style={{ position: 'relative', zIndex: 3 }}>
                <div className="text-lg font-bold text-slate-800">10K+</div>
                <div className="text-xs text-slate-600">Teams</div>
              </div>
            </div>

            <div className="metric-card px-4 py-3 flex items-center space-x-2 border-x-0" style={{ position: 'relative', zIndex: 2, borderRadius: '0px' }}>
              <TrendingUp className="w-4 h-4 text-green-600" style={{ position: 'relative', zIndex: 3 }} />
              <div style={{ position: 'relative', zIndex: 3 }}>
                <div className="text-lg font-bold text-slate-800">$2.5B</div>
                <div className="text-xs text-slate-600">Processed</div>
              </div>
            </div>

            <div className="metric-card rounded-r-lg px-4 py-3 flex items-center space-x-2 border-l-0" style={{ position: 'relative', zIndex: 2 }}>
              <Globe2 className="w-4 h-4 text-purple-600" style={{ position: 'relative', zIndex: 3 }} />
              <div style={{ position: 'relative', zIndex: 3 }}>
                <div className="text-lg font-bold text-slate-800">150+</div>
                <div className="text-xs text-slate-600">Countries</div>
              </div>
            </div>
          </div>

          {/* Mobile Feature Cards - Visible on small screens */}
          <div className="block lg:hidden mt-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-md mx-auto">
              <div className="glass-card rounded-xl p-4 text-center">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center mx-auto mb-2 icon-glow">
                  <Shield className="w-4 h-4 text-white" />
                </div>
                <h3 className="text-sm font-semibold text-slate-800">Security</h3>
              </div>

              <div className="glass-card rounded-xl p-4 text-center">
                <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center mx-auto mb-2 icon-glow">
                  <Globe2 className="w-4 h-4 text-white" />
                </div>
                <h3 className="text-sm font-semibold text-slate-800">Global</h3>
              </div>
            </div>
          </div>
        </div>
                    <ServiceModal isOpen={isModalOpen} onClose={closeModal} />

      </section>
    </>
  );
}


