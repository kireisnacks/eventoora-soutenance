'use client';

import { LucideIcon } from 'lucide-react';

interface UserMenuItemProps {
    onClick: () => void;
    label: string;
    icon?: LucideIcon; // Single icon prop for the right side
    color?: string; // Prop for the color
}

const UserMenuItem: React.FC<UserMenuItemProps> = ({
    onClick,
    label,
    icon: Icon,
    color = 'text-black', // Default color
}) => {
    return (
        <div
            onClick={onClick}
            className={`px-4 py-3 hover:bg-neutral-100 transition font-semibold flex items-center justify-between ${color}`}
        >
            <span>{label}</span>
            {Icon && <Icon size={16} className={color} />} {/* Icon on the right */}
        </div>
    );
};

export default UserMenuItem;
