'use client';

import { useMemo } from 'react';

const patterns = [
  'arches.png',
  'cartographer.png',
  'checkered-pattern.png',
  'cubes.png',
  'dark-brick-wall.png',
  'dark-exa.png',
  'dark-wood.png',
  'diagmonds.png',
  'diagonal-noise.png',
  'escheresque.png',
  'food.png',
  'kuji.png',
  'notebook-dark.png'
];

interface BackgroundProps {
    children: React.ReactNode;
    color?: string;
    opacity?: number;
  }
  
  const Background = ({ 
    children, 
    color = 'bg-red-400',
    opacity = 90 
  }: BackgroundProps) => {
    const randomPattern = useMemo(() => {
      const randomIndex = Math.floor(Math.random() * patterns.length);
      return patterns[randomIndex];
    }, []);
  
    return (
      <div 
        // Removed 'relative' class to avoid creating stacking context
        className="min-h-screen pt-16 pb-32"
        style={{
          backgroundImage: `
            linear-gradient(
              rgba(248, 113, 113, ${opacity / 100}), 
              rgba(248, 113, 113, ${opacity / 100})
            ),
            url('/patterns/${randomPattern}')
          `,
          backgroundRepeat: 'repeat',
          backgroundBlendMode: 'multiply'
        }}
      >
        {children}
      </div>
    );
  };
  
  export default Background;
  