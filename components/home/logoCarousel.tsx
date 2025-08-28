import React from 'react';

interface Company {
  name: string;
  logo: string;
}

export default function LogoCarousel(): React.JSX.Element {
  const logos: Company[] = [
    { name: "TechCorp", logo: "TC" },
    { name: "GlobalSoft", logo: "GS" },
    { name: "InnovateAI", logo: "IA" },
    { name: "DataFlow", logo: "DF" },
    { name: "CloudVentures", logo: "CV" },
    { name: "NextGen", logo: "NG" },
    { name: "SmartSystems", logo: "SS" },
    { name: "FutureWorks", logo: "FW" }
  ];

  return (
    <section className="py-16 bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <p className="text-sm text-gray-500 font-medium uppercase tracking-wider">
            Trusted by leading companies worldwide
          </p>
        </div>

        <div className="overflow-hidden">
          <div
            className="flex space-x-12 md:space-x-16"
            style={{ animation: 'scroll 30s linear infinite' }}
          >
            {[...logos, ...logos].map((company, index) => (
              <div
                key={index}
                className="flex-shrink-0 flex items-center justify-center group"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center group-hover:from-blue-50 group-hover:to-teal-50 transition-all duration-300">
                    <span className="text-sm font-semibold text-gray-600 group-hover:text-blue-600">
                      {company.logo}
                    </span>
                  </div>
                  <span className="text-lg font-semibold text-gray-400 group-hover:text-gray-600 transition-colors duration-300">
                    {company.name}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
      `}</style>
    </section>
  );
}
