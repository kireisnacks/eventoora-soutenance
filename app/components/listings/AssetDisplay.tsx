// components/AssetDisplay.tsx
'use client';

import { AssetCategory } from '@/app/types';
import { ASSET_MAP } from '@/app/constants/assets';
import { FaQuestionCircle } from 'react-icons/fa';

interface AssetDisplayProps {
  assets: string[];
}

const AssetDisplay: React.FC<AssetDisplayProps> = ({ assets }) => {
  const categorizedAssets = assets.reduce((acc, assetName) => {
    const asset = ASSET_MAP.get(assetName) || { 
      name: assetName,
      reactIcon: FaQuestionCircle,
      category: 'other' as AssetCategory
    };
    
    if (!acc[asset.category]) acc[asset.category] = [];
    acc[asset.category].push(asset);
    return acc;
  }, {} as Record<AssetCategory, Array<{ name: string; reactIcon: any }>>);

  const categoriesOrder: AssetCategory[] = ['equipment', 'feature', 'other'];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
      {categoriesOrder.map(category => {
        const items = categorizedAssets[category];
        if (!items?.length) return null;

        return (
          <div key={category} className="flex flex-col gap-3">
            <h3 className="text-sm font-semibold capitalize">
              {category === 'equipment' ? 'Équipements' : 
               category === 'feature' ? 'Caractéristiques' : 'Autres'}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {items.map((item, index) => (
                <div key={index} className="flex items-center gap-3 text-xs">
                  <item.reactIcon className="w-5 h-5 text-neutral-600 flex-shrink-0" />
                  <span className="">{item.name}</span>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default AssetDisplay;