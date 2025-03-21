import type { Asset, AssetCategory } from '@/app/types';
import { 
  FaWifi, FaTv, FaVideo,
  FaLightbulb, FaHeadphones, FaMicrophone, FaUtensils, FaCoffee,
  FaPrint, FaRestroom, FaVolumeUp, FaTheaterMasks, FaTemperatureLow,
  FaEthernet, FaStream, FaIceCream, FaStickyNote, FaAdjust,
  FaBluetooth,  FaSink, FaSun, FaParking, FaVolumeMute,
   FaBus, FaTree, FaShieldAlt, FaWheelchair, FaBroom,
  FaStreetView, FaLock, FaBuilding, FaPaintBrush, FaWeightHanging,
  FaStore, FaSubway, FaEye, FaChair 
} from 'react-icons/fa';
import {  GiTable } from 'react-icons/gi';
import { TbHanger ,  TbElevator  } from 'react-icons/tb'
import { LuProjector } from "react-icons/lu";
import { BiChalkboard , BiSolidChalkboard } from "react-icons/bi";
import { MdCurtains } from "react-icons/md";
import { RiScreenshotFill } from "react-icons/ri";


const createCategory = <T extends AssetCategory>(
  category: T,
  items: Omit<Asset, 'category'>[]
): readonly Asset[] => items.map(item => ({ ...item, category }));

const ASSETS = {
  equipment: createCategory('equipment', [
    { name: 'Wi-Fi', reactIcon: FaWifi },
    { name: 'Chaises', reactIcon: FaChair },
    { name: 'Tables', reactIcon: GiTable },
    { name: 'Tableaux blancs', reactIcon: BiChalkboard },
    { name: 'Tableau noir', reactIcon: BiSolidChalkboard },
    { name: 'Projecteur', reactIcon: LuProjector },
    { name: 'Écran', reactIcon: FaTv },
    { name: 'Équipement vidéo', reactIcon: FaVideo },
    { name: "Équipement d'éclairage", reactIcon: FaLightbulb },
    { name: 'Écran vert', reactIcon: RiScreenshotFill },
    { name: 'Technicien audio/vidéo', reactIcon: FaHeadphones },
    { name: 'Micros', reactIcon: FaMicrophone },
    { name: 'Cuisine', reactIcon: FaUtensils },
    { name: 'Café', reactIcon: FaCoffee },
    { name: 'Imprimante', reactIcon: FaPrint },
    { name: 'Toilettes', reactIcon: FaRestroom },
    { name: 'Haut-parleurs', reactIcon: FaVolumeUp },
    { name: 'Scène', reactIcon: FaTheaterMasks },
    { name: 'Système de climatisation/chauffage', reactIcon: FaTemperatureLow },
    { name: 'Connexion Internet par câble (Ethernet)', reactIcon: FaEthernet },
    { name: 'Équipement de streaming', reactIcon: FaStream },
    { name: 'Machine à café/thé', reactIcon: FaCoffee },
    { name: 'Réfrigérateur', reactIcon: FaIceCream },
    { name: 'Paperboard', reactIcon: FaStickyNote },
    { name: 'Éclairage réglable', reactIcon: FaAdjust },
    { name: 'Système de sonorisation (enceintes Bluetooth)', reactIcon: FaBluetooth },
    { name: 'Vestiaire', reactIcon: TbHanger },
    { name: 'Loges', reactIcon: FaTheaterMasks },
    { name: 'Bassin d\'eau/Evier', reactIcon: FaSink },
  ]),
  feature: createCategory('feature', [
    { name: 'Lumière naturelle', reactIcon: FaSun },
    { name: 'Place(s) de stationnement', reactIcon: FaParking },
    { name: 'Insonorisé', reactIcon: FaVolumeMute },
    { name: 'Monte-charges', reactIcon: TbElevator },
    { name: 'Transports en commun (proximité)', reactIcon: FaBus },
    { name: 'Espace en extérieur', reactIcon: FaTree },
    { name: 'Sécurité', reactIcon: FaShieldAlt },
    { name: 'Accessible en fauteuil roulant', reactIcon: FaWheelchair },
    { name: "Services d'entretien", reactIcon: FaBroom },
    { name: 'Accès depuis la rue', reactIcon: FaStreetView },
    { name: 'Salle privée', reactIcon: FaLock },
    { name: 'Toit-terrasse', reactIcon: FaBuilding },
    { name: 'Fonds de studio blanc', reactIcon: FaPaintBrush },
    { name: 'Sacs de sable', reactIcon: FaWeightHanging },
    { name: 'Portant à vêtements', reactIcon: TbHanger },
    { name: 'Rideaux/Stores', reactIcon: MdCurtains }, // No specific curtain icon in FA, using FaHanger as fallback
    { name: 'Vue panoramique', reactIcon: FaEye },
    { name: 'Proximité des commerces/restaurants', reactIcon: FaStore },
    { name: 'Parking privé', reactIcon: FaParking },
    { name: 'Proximité de transports en commun', reactIcon: FaSubway },
  ]),
  other: createCategory('other',[]),
} satisfies Record<AssetCategory, readonly Asset[]>;

export const ASSET_CATEGORIES = ASSETS;
export const ALL_ASSETS = Object.values(ASSETS).flat();

export const ASSET_MAP = new Map(
  ALL_ASSETS.map(asset => [asset.name, asset])
);

export type ReactIcon = typeof FaWifi; // Updated to use actual icon type