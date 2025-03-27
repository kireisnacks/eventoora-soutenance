'use client';

import { useRouter } from 'next/navigation';
import MenuItem from './MenuItem'; // Adjust the import path as necessary

const Menu = () => {
    const router = useRouter();
    const handleClick = (label: string) => {
        switch (label) {
            case 'Accueil':
                router.push('/'); // Navigate to the home page
                break;
            case 'Parcourir':
                console.log(`Clicked on ${label}`); // Add logic for "Parcourir" if needed
                break;
            case 'Réservations':
                router.push('/reservations'); // Navigate to the reservations page
                break;
            case 'Messagerie':
                console.log(`Clicked on ${label}`); // Add logic for "Messagerie" if needed
                break;
            default:
                console.log(`Clicked on ${label}`); // Default case for other labels
        }
    };

    return (
        <div className="hidden lg:flex lg:items-center space-x-2">
            <MenuItem onClick={() => handleClick('Accueil')} label="Accueil" />
            <MenuItem onClick={() => handleClick('Parcourir')} label="Parcourir" ifDropdown={true} />
            <MenuItem onClick={() => handleClick('Réservations')} label="Réservations" />
            <MenuItem onClick={() => handleClick('Rechercher')} label="Messagerie" />
        </div>
    );
};

export default Menu;
