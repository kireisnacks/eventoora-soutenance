'use client';

import Image from "next/image";
import { FiChevronLeft, FiChevronRight, FiX } from "react-icons/fi";

interface LightboxModalProps {
  images: string[];
  selectedIndex: number | null;
  onClose: () => void;
  onNavigate: (index: number) => void;
}

const LightboxModal: React.FC<LightboxModalProps> = ({
  images,
  selectedIndex,
  onClose,
  onNavigate
}) => {
  if (selectedIndex === null) return null;

  const handleNavigation = (direction: 'prev' | 'next') => {
    const totalImages = images.length;
    const newIndex = direction === 'next' 
      ? (selectedIndex + 1) % totalImages
      : (selectedIndex - 1 + totalImages) % totalImages;
    onNavigate(newIndex);
  };

  return (
    <div className="fixed inset-0 bg-black/90 z-[60] flex items-center justify-center backdrop-blur-lg">
      <button
        onClick={onClose}
        className="absolute top-8 right-8 text-white hover:text-gray-300 transition-colors"
        aria-label="Close lightbox"
      >
        <FiX size={32} />
      </button>

      <div className="relative w-full h-full max-w-7xl max-h-[90vh]">
        <Image
          fill
          src={images[selectedIndex]}
          alt={`Enlarged view`}
          className="object-contain p-8"
          priority
        />

        <div className="absolute inset-0 flex items-center justify-between px-4">
          <button
            onClick={() => handleNavigation('prev')}
            className="text-white hover:text-gray-300 p-4 backdrop-blur-sm rounded-full hover:bg-white/10 transition-all"
            aria-label="Previous image"
          >
            <FiChevronLeft size={48} />
          </button>
          <button
            onClick={() => handleNavigation('next')}
            className="text-white hover:text-gray-300 p-4 backdrop-blur-sm rounded-full hover:bg-white/10 transition-all"
            aria-label="Next image"
          >
            <FiChevronRight size={48} />
          </button>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white bg-black/30 px-4 py-2 rounded-full text-sm backdrop-blur-sm">
          {selectedIndex + 1} / {images.length}
        </div>
      </div>
    </div>
  );
};

export default LightboxModal;