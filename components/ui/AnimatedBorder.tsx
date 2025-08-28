// AnimatedBorder.jsx
'use client';

import { useState, useEffect, useRef } from 'react';

export const AnimatedBorder = () => {
  const pathRef = useRef<SVGPathElement>(null);
  const [pathLength, setPathLength] = useState(0);

  useEffect(() => {
    if (pathRef.current) {
      // Get the total length of the SVG path
      const length = pathRef.current.getTotalLength();
      setPathLength(length);
    }
  }, []);

  return (
    <svg
      className="absolute inset-0 w-full h-full"
      viewBox="0 0 100 100" // Use a viewBox for responsive scaling
      preserveAspectRatio="none"
      fill="none"
    >
      <path
        ref={pathRef}
        // This path creates the same octagon shape as your clip-path
        d="M 20 0 L 80 0 L 100 20 L 100 80 L 80 100 L 20 100 L 0 80 L 0 20 Z"
        stroke="white"
        strokeWidth="0.5" // Adjust border thickness
        style={{
          strokeDasharray: pathLength,
          strokeDashoffset: pathLength,
          // Apply the animation
          animation: 'draw-border 2s ease-out forwards 0.5s',
        }}
      />
    </svg>
  );
};