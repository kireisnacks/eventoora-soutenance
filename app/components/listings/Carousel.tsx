'use client';

import { useState, useCallback } from 'react';
import Image from 'next/image';
import { AiOutlineLeft, AiOutlineRight } from 'react-icons/ai';
import { BsCircle, BsCircleFill } from 'react-icons/bs';

// Separate carousel component with TypeScript props
interface CarouselProps {
  images: string[];
  badgeLabel?: string;
}

const Carousel: React.FC<CarouselProps> = ({ images, badgeLabel }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePrev = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex(prev => (prev === 0 ? images.length - 1 : prev - 1));
  }, [images.length]);

  const handleNext = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex(prev => (prev === images.length - 1 ? 0 : prev + 1));
  }, [images.length]);

  if (!images.length) return null;

  return (
    <div className="relative h-full w-full overflow-hidden rounded-xl">
      {/* Badge label */}
      {badgeLabel && (
        <div className="absolute top-2 left-2 z-10 bg-white text-black px-3 py-1 rounded-full text-sm font-semibold">
          {badgeLabel}
        </div>
      )}
      {/* Main image */}
      <Image
        fill
        alt="Space thumbnail"
        src={images[currentIndex]}
        className="object-cover transition-transform duration-300 group-hover:scale-105"
        priority
      />

      {/* Navigation buttons */}
      {images.length > 1 && (
        <>
          <button
            onClick={handlePrev}
            className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-2 shadow-md transition hover:bg-white/100"
            aria-label="Previous image"
          >
            <AiOutlineLeft className="h-5 w-5" />
          </button>
          
          <button
            onClick={handleNext}
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-2 shadow-md transition hover:bg-white/100"
            aria-label="Next image"
          >
            <AiOutlineRight className="h-5 w-5" />
          </button>

          {/* Dots indicator */}
          <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1">
            {images.map((_, index) => (
              index === currentIndex ? (
                <BsCircleFill key={index} className="h-3 w-3 text-white" />
              ) : (
                <BsCircle 
                  key={index} 
                  className="h-3 w-3 text-white/50 cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentIndex(index);
                  }}
                />
              )
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Carousel;