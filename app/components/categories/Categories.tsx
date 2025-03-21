"use client";

import { useSearchParams, usePathname } from 'next/navigation';
import Container from '../Container';

import CategoryBox from './CategoryBox';

import {
    PartyPopper,
    Building,
    Utensils,
    Drama,
} from 'lucide-react';

export const categories = [
    {
        label: 'Salle de réception',
        icon: PartyPopper,
        description: "Espace pour divers événements tels que des mariages, conférences, séminaires, et autres rassemblements sociaux ou professionnels."
    },
    {
        label: 'Salle de conférence',
        icon: Building,
        description: "Espace équipé pour accueillir des réunions, présentations et événements professionnels."
    },
    {
        label: 'Restaurant & Bar',
        icon: Utensils,
        description: "Espace pour des dîners, fêtes, et événements spéciaux."
    },
    {
        label: 'Studio Créatif',
        icon: Drama,
        description: "Espace pour tout ce qui est artistique."
    },

]

 
const Categories = () => {
    const params= useSearchParams();
    const category = params?.get('category');
    const pathName = usePathname();

    const isMainPage = pathName === '/';
    
    return (
        <Container>
            <div 
                className="
                    pt-4
                    flex
                    flex-row
                    items-center
                    justify-between
                    overflow-x-auto"
            >
                {categories.map((item) => (
                        <CategoryBox
                            key={item.label}
                            label={item.label}
                            selected={category === item.label}
                            icon={item.icon}
                        />
                    )
                )}
            </div>
        </Container>
    );
}

export default Categories;