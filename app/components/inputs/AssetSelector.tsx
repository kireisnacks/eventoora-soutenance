// components/inputs/AssetSelector.tsx
'use client';

import { useMemo, useState } from 'react';
import { FieldValues, UseFormRegister, FieldErrors } from 'react-hook-form';
import { ASSET_CATEGORIES, ASSET_MAP } from '@/app/constants/assets';

interface AssetSelectorProps {
  id: string;
  label: string;
  required?: boolean;
  disabled?: boolean;
  register: UseFormRegister<FieldValues>;
  errors: FieldErrors;
  selectedAssets: string[];
  onAssetsChange: (assets: string[]) => void;
}

const AssetSelector = ({
  id,
  label,
  required,
  disabled,
  register,
  errors,
  selectedAssets,
  onAssetsChange,
}: AssetSelectorProps) => {
  const [customInput, setCustomInput] = useState('');

  const customAssets = useMemo(() => 
    selectedAssets.filter(name => !ASSET_MAP.has(name)),
    [selectedAssets]
  );

  const handleAssetToggle = (assetName: string) => {
    const newAssets = selectedAssets.includes(assetName)
      ? selectedAssets.filter(name => name !== assetName)
      : [...selectedAssets, assetName];
    onAssetsChange(newAssets);
  };

  const handleAddCustomAsset = (asset: string) => {
    const formatted = asset.trim();
    if (formatted && !selectedAssets.includes(formatted)) {
      onAssetsChange([...selectedAssets, formatted]);
      setCustomInput('');
    }
  };

  return (
    <div className="space-y-6">
      {/* Predefined Assets */}
      {Object.entries(ASSET_CATEGORIES).map(([category, assets]) => (
        <div key={category} className="space-y-4">
          <h3 className="text-sm font-semibold text-gray-700 capitalize text-center">
                {category === 'equipment' ? 'Équipements' : 'Caractéristiques'}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
            {assets.map((asset) => (
              <label
                key={asset.name}
                className={`flex items-center gap-2 p-2 rounded-lg border ${
                  selectedAssets.includes(asset.name)
                    ? 'border-blue-300 bg-blue-50'
                    : 'border-gray-200 hover:border-blue-200'
                } transition-colors cursor-pointer`}
              >
                <input
                  type="checkbox"
                  checked={selectedAssets.includes(asset.name)}
                  onChange={() => handleAssetToggle(asset.name)}
                  className="w-4 h-4 rounded border-gray-300 text-blue-600 
                    focus:ring-blue-500 transition-all ease-in-out duration-200"
                />
                <span className="text-gray-700 text-sm font-normal">{asset.name}</span>
              </label>
            ))}
          </div>
        </div>
      ))}

      {/* Custom Assets Input */}
      <div className="space-y-3">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <input
              {...register(id, { 
                validate: (value) => 
                  !value || value.length >= 3 || 'Minimum 3 characters'
              })}
              id={id}
              type="text"
              value={customInput}
              onChange={(e) => setCustomInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddCustomAsset(e.currentTarget.value)}
              disabled={disabled}
              className={`w-full px-4 py-2 rounded-lg border ${
                errors[id] ? 'border-red-500' : 'border-gray-300'
              } focus:outline-none focus:ring-2 ${
                errors[id] ? 'focus:ring-red-500' : 'focus:ring-blue-500'
              } transition-colors`}
              placeholder={label}
              aria-invalid={!!errors[id]}
            />
          </div>
          <button
            type="button"
            onClick={() => handleAddCustomAsset(customInput)}
            disabled={!customInput.trim() || customInput.trim().length < 3}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 
              disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            Ajouter
          </button>
        </div>

        {errors[id] && (
          <p className="text-red-500 text-sm mt-1">
            {errors[id]?.message?.toString()}
          </p>
        )}

        {/* Display Custom Assets */}
        {customAssets.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-gray-700">Autres</h3>
            <div className="flex flex-wrap gap-2">
              {customAssets.map((asset) => (
                <div
                  key={asset}
                  className="px-3 py-1 bg-gray-100 rounded-lg flex items-center gap-2 border border-gray-200"
                >
                  <span className="text-gray-700 text-sm">{asset}</span>
                  <button
                    type="button"
                    onClick={() => onAssetsChange(selectedAssets.filter(a => a !== asset))}
                    className="text-gray-400 hover:text-gray-600 transition-colors text-sm"
                    aria-label={`Remove ${asset}`}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AssetSelector;