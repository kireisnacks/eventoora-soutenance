'use client';

import MenuItem from './MenuItem'; // Adjust the import path as necessary

const Menu = () => {
    const handleClick = (label: string) => {
        console.log(`Clicked on ${label}`);
        // Add your click handling logic here
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
