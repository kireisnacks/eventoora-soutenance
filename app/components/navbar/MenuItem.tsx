'use client';

import { ChevronDown } from 'lucide-react';
import { useState } from 'react';

interface MenuItemProps {
    onClick: () => void;
    label: string;
    ifDropdown?: boolean;
    dropdownContent?: React.ReactNode; // Accept a React node as dropdown content
}

const MenuItem: React.FC<MenuItemProps> = ({
    onClick,
    label,
    ifDropdown,
    dropdownContent,
}) => {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <div
            className="group flex items-center justify-center h-10 w-max rounded-md bg-background px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-accent-foreground cursor-pointer relative"
            onClick={onClick}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <span className="flex items-center">
                {label}
                {ifDropdown && (
                    <>
                        <ChevronDown
                            className={`mt-1 ml-1 -mr-2 transition-transform transform scale-50 ${isHovered ? 'rotate-180' : 'rotate-0'}`}
                        />
                        {isHovered && dropdownContent && (
                            <div className="absolute mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
                                {dropdownContent}
                            </div>
                        )}
                    </>
                )}
            </span>
        </div>
    );
};

export default MenuItem;
