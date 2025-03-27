'use client';

import { LucideIcon } from 'lucide-react';
import { IconType } from 'react-icons';

interface ButtonProps {
    label: string;
    onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
    disabled?: boolean;
    outline?: boolean;
    small?: boolean;
    medium?: boolean;
    iconLucide?: LucideIcon;
    iconReact?: IconType;
    rounded?: boolean
}

const Button: React.FC<ButtonProps> = ({
    label,
    onClick,
    disabled,
    outline,
    small,
    medium,
    iconLucide:Iconl,
    iconReact:Iconr,
    rounded
}) => {
    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className={`
                relative
                disabled:opacity-70
                disabled:cursor-not-allowed
                hover:opacity-80
                transition
                w-full
                ${rounded ? 'rounded-md' : ''}
                ${outline ? 'bg-white' : 'bg-rose-500'}
                ${outline ? 'border-black' : 'border-rose-500'}
                ${outline ? 'text-black' : 'text-white'}
                ${small ? 'py-1' : 'py-3'}
                ${small ? 'text-sm' : 'text-md'}
                ${small ? 'font-light' : 'font-semibold'}
                ${small ? 'border-[1px]' : 'border-2'}
                ${medium ? 'py-2' : ''}
                ${medium ? 'text-md' : ''}
                ${medium ? 'font-semibold' : ''}
                ${medium ? 'border-2' : ''}
            `}
        >
            {Iconr && (
                <Iconr
                    size={24}
                    className="absolute left-4 top-3"
                />
            )}
            {!Iconr && Iconl && (
                <Iconl
                    size={24}
                    className="absolute left-4 top-3"
                />
            )}
            {label}
        </button>
    );
};

export default Button;
