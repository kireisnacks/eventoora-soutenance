'use client';

import Image from "next/image";
import { useState } from "react";
import LightboxModal from "../modals/LightboxModal";

interface ListingImageGridProps {
  thumbnail: string[];
}

const ListingImageGrid: React.FC<ListingImageGridProps> = ({ thumbnail }) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);

  return (
    <>
      <div className="grid grid-cols-4 grid-rows-2 gap-4 h-[60vh] w-full rounded-xl overflow-hidden">
        {thumbnail.map((img, index) => (
          <div 
            key={img}
            className={`
              relative cursor-pointer transition-transform hover:scale-95
              ${index === 0 ? 'col-span-2 row-span-2' : 'col-span-1'}
              ${index === 1 ? 'row-span-1' : ''}
            `}
            onClick={() => setSelectedImageIndex(index)}
          >
            <Image
              fill
              alt={`Property image ${index + 1}`}
              src={img}
              className="object-cover"
              sizes={index === 0 ? "(max-width: 768px) 100vw, 50vw" : "33vw"}
            />
          </div>
        ))}
      </div>

      <LightboxModal
        images={thumbnail}
        selectedIndex={selectedImageIndex}
        onClose={() => setSelectedImageIndex(null)}
        onNavigate={(newIndex) => setSelectedImageIndex(newIndex)}
      />
    </>
  );
};

export default ListingImageGrid;