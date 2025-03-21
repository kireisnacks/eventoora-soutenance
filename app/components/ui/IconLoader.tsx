// components/ui/IconLoader.tsx
'use client';

import { IconType } from 'react-icons';
import { useEffect, useState } from 'react';
import { ASSET_CATEGORIES } from '@/app/constants/assets';

// Type for dynamically loaded icons
type IconComponents = Record<string, IconType>;

// Map icon prefixes to their respective react-icons libraries
const getIconLibrary = (iconName: string) => {
  const prefix = iconName.substring(0, 2);
  const libMap: Record<string, string> = {
    Fa: 'fa',
    Gi: 'gi',
    Io: 'io',
    Md: 'md',
    Si: 'si',
    Fi: 'fi',
    Bi: 'bi',
    Ri: 'ri',
    Cg: 'cg',
    Di: 'di',
  };
  return libMap[prefix] || 'fa';
};

export const useIconLoader = () => {
  const [icons, setIcons] = useState<IconComponents>({});

  useEffect(() => {
    const loadIcons = async () => {
      const iconNames = Array.from(
        new Set(
          Object.values(ASSET_CATEGORIES)
            .flat()
            .map(asset => asset.reactIcon)
        )
      );

      const iconModules = await Promise.all(
        iconNames.map(async (iconName) => {
          try {
            const library = getIconLibrary(iconName);
            const module = await import(`react-icons/${library}/index.js`);
            return { iconName, Icon: module[iconName] };
          } catch (error) {
            console.warn(`Icon ${iconName} not found`);
            return null;
          }
        })
      );

      setIcons(
        iconModules.reduce((acc, curr) => {
          if (curr?.Icon) {
            acc[curr.iconName] = curr.Icon;
          }
          return acc;
        }, {} as IconComponents)
      );
    };

    loadIcons();
  }, []);

  return icons;
};