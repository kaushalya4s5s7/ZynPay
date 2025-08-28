import { useState } from 'react';
import Image from 'next/image';

export default function GlobalCoverage() {
  const [hoveredRegion, setHoveredRegion] = useState<string | null>(null);

  const regions = [
    { name: "North America", countries: 3, compliance: "🇺🇸 🇨🇦 🇲🇽", position: { top: "25%", left: "20%" } },
    { name: "Europe", countries: 45, compliance: "🇬🇧 🇩🇪 🇫🇷 🇮🇹 🇪🇸", position: { top: "20%", left: "50%" } },
    { name: "Asia Pacific", countries: 28, compliance: "🇯🇵 🇰🇷 🇸🇬 🇦🇺 🇮🇳", position: { top: "30%", left: "75%" } },
    { name: "South America", countries: 12, compliance: "🇧🇷 🇦🇷 🇨🇱 🇨🇴", position: { top: "60%", left: "25%" } },
    { name: "Africa", countries: 15, compliance: "🇿🇦 🇳🇬 🇰🇪 🇪🇬", position: { top: "50%", left: "55%" } },
    { name: "Middle East", countries: 8, compliance: "🇦🇪 🇸🇦 🇮🇱", position: { top: "40%", left: "60%" } }
  ];

  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-black mb-6">
            Global Coverage, Local Compliance
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Pay your team across 120+ countries with full regulatory compliance. 
            We handle local tax laws, so you don't have to.
          </p>
        </div>

        {/* World Map Visualization */}
        <div className="relative bg-gray-400 rounded-2xl p-8 lg:p-16">
          <div className="relative w-full h-96 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl overflow-hidden">
            {/* World map video placeholder */}
          <video
  src="/Global_Money_Transfer_Animation_Scene.mp4"
  autoPlay
  loop
  muted
  playsInline
  preload="auto" // <-- important for faster start
  className="w-full h-full object-cover opacity-80"
/>

            
            {/* Interactive regions */}
            {regions.map((region, index) => (
              <div
                key={index}
                className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-300 hover:scale-110"
                style={{ top: region.position.top, left: region.position.left }}
                onMouseEnter={() => setHoveredRegion(region.name)}
                onMouseLeave={() => setHoveredRegion(null)}
              >
                {/* Pin */}
                <div className={`w-6 h-6 rounded-full flex items-center justify-center transition-all duration-300 ${
                  hoveredRegion === region.name 
                    ? 'bg-purple-600 scale-125 shadow-lg shadow-purple-500/50' 
                    : 'bg-black hover:bg-purple-500'
                } animate-pulse`}>
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                </div>
                
                {/* Tooltip */}
                {hoveredRegion === region.name && (
                  <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 bg-white border border-gray-200 rounded-lg p-4 shadow-xl min-w-max z-10 animate-in fade-in duration-200">
                    <h4 className="font-semibold text-black mb-1">{region.name}</h4>
                    <p className="text-sm text-gray-600 mb-2">{region.countries} countries supported</p>
                    <p className="text-xs">{region.compliance}</p>
                    <div className="text-xs text-green-600 mt-1">✓ Local Compliance Supported</div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
            <div className="text-center">
              <div className="text-3xl font-bold text-black mb-2">120+</div>
              <div className="text-sm text-gray-600">Countries Supported</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-black mb-2">45</div>
              <div className="text-sm text-gray-600">Currencies</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-black mb-2">99.8%</div>
              <div className="text-sm text-gray-600">Compliance Rate</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-black mb-2">24/7</div>
              <div className="text-sm text-gray-600">Support</div>
            </div>
          </div>
        </div>

        {/* Key Features */}
        <div className="grid md:grid-cols-3 gap-8 mt-16">
          <div className="text-center p-6 rounded-xl transition-all duration-300 hover:bg-gray-50 hover:scale-105 hover:shadow-lg cursor-pointer">
            <div className="w-16 h-16 bg-black text-white rounded-xl flex items-center justify-center mx-auto mb-4 transition-all duration-300 hover:bg-purple-600 hover:scale-110">
              <span className="text-2xl">🌍</span>
            </div>
            <h3 className="text-xl font-bold text-black mb-2">Local Expertise</h3>
            <p className="text-gray-600">Tax calculations and compliance handled by local experts in each country.</p>
          </div>
          
          <div className="text-center p-6 rounded-xl transition-all duration-300 hover:bg-gray-50 hover:scale-105 hover:shadow-lg cursor-pointer">
            <div className="w-16 h-16 bg-black text-white rounded-xl flex items-center justify-center mx-auto mb-4 transition-all duration-300 hover:bg-purple-600 hover:scale-110">
              <span className="text-2xl">⚡</span>
            </div>
            <h3 className="text-xl font-bold text-black mb-2">Instant Setup</h3>
            <p className="text-gray-600">Add new countries to your payroll in minutes, not months.</p>
          </div>
          
          <div className="text-center p-6 rounded-xl transition-all duration-300 hover:bg-gray-50 hover:scale-105 hover:shadow-lg cursor-pointer">
            <div className="w-16 h-16 bg-black text-white rounded-xl flex items-center justify-center mx-auto mb-4 transition-all duration-300 hover:bg-purple-600 hover:scale-110">
              <span className="text-2xl">🔒</span>
            </div>
            <h3 className="text-xl font-bold text-black mb-2">Guaranteed Compliance</h3>
            <p className="text-gray-600">Stay compliant with automatic updates to local tax laws and regulations.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
