"use client"

import React from 'react';
import { 
  Facebook, 
  Youtube, 
  Gamepad2, 
  Code, 
  Palette, 
  Camera,
  Zap
} from 'lucide-react';
import { cn } from '@/lib/utils';

export const SpinningLogos: React.FC = () => {
  const radiusToCenterOfIcons = 120;
  const iconWrapperWidth = 50;
  const ringPadding = 30;

  const toRadians = (degrees: number): number => (Math.PI / 180) * degrees;

  const logos = [
    { Icon: Code, className: 'bg-purple-600 text-white', name: 'Development' },
    { Icon: Palette, className: 'bg-red-600 text-white', name: 'Design' },
    { Icon: Camera, className: 'bg-orange-600 text-white', name: 'Media' },
    { Icon: Zap, className: 'bg-yellow-600 text-white', name: 'Energy' },
    { Icon: Gamepad2, className: 'bg-indigo-600 text-white', name: 'Gaming' },
    { Icon: Facebook, className: 'bg-blue-500 text-white', name: 'Social' },
    { Icon: Youtube, className: 'bg-red-500 text-white', name: 'Video' },
  ];

  return (
    <div className="flex justify-center items-center p-8">
      <div
        style={{
          width: radiusToCenterOfIcons * 2 + iconWrapperWidth + ringPadding,
          height: radiusToCenterOfIcons * 2 + iconWrapperWidth + ringPadding,
        }}
        className="relative rounded-full bg-gray-900/50 shadow-2xl border border-gray-700"
      >
        <div className="absolute inset-0 animate-spin-slow">
          {logos.map((logo, index) => {
            const angle = (360 / logos.length) * index;
            return (
              <div
                key={index}
                style={{
                  top: `calc(50% - ${iconWrapperWidth / 2}px + ${radiusToCenterOfIcons * Math.sin(toRadians(angle))}px)`,
                  left: `calc(50% - ${iconWrapperWidth / 2}px + ${radiusToCenterOfIcons * Math.cos(toRadians(angle))}px)`,
                  width: iconWrapperWidth,
                  height: iconWrapperWidth,
                }}
                className={cn(
                  "absolute flex items-center justify-center rounded-full shadow-lg border-2 border-white/20 animate-spin-reverse hover:scale-110 transition-transform",
                  logo.className
                )}
                aria-label={`${logo.name} logo`}
              >
                <logo.Icon className="w-5 h-5" />
              </div>
            );
          })}
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="bg-black/80 backdrop-blur-sm rounded-full w-24 h-24 flex items-center justify-center shadow-inner border-2 border-cyan-400/50">
            <span className="text-sm font-bold text-cyan-400 text-center">
              ZynPay
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
