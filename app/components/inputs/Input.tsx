'use client';

import { FieldErrors, FieldValues, UseFormRegister } from 'react-hook-form';
import { DollarSign } from 'lucide-react';

interface InputProps {
    id: string;
    label: string;
    type?: string;
    disabled?: boolean;
    formatPrice?: boolean;
    required?: boolean;
    register: UseFormRegister<FieldValues>;
    errors: FieldErrors;
}

const Input: React.FC<InputProps> = ({
    id,
    label,
    type = 'text',
    disabled,
    formatPrice,
    register,
    required,
    errors,
}) => {
    return (
        <div className="w-full relative">
            {formatPrice && (
                <DollarSign
                    size={20} // Reduced size
                    className="
                        text-neutral-700
                        absolute
                        top-4 // Adjusted position
                        left-2
                    "
                />
            )}
            <input
                id={id}
                disabled={disabled}
                {...register(id, { required })}
                placeholder=" "
                type={type}
                className={`
                    peer
                    w-full
                    p-3 // Reduced padding
                    pt-5 // Adjusted padding-top
                    font-light
                    text-sm // Reduced font size
                    bg-white
                    border-2
                    rounded-md
                    outline-none
                    transition
                    disabled:opacity-70
                    disabled:cursor-not-allowed
                    ${formatPrice ? 'pl-8' : 'pl-3'} // Adjusted padding-left
                    ${errors[id] ? 'border-rose-500' : 'border-neutral-300'}
                    ${errors[id] ? 'focus:border-rose-500' : 'focus:border-black'}
                `}
            />
            <label
                className={`
                    absolute
                    text-sm // Reduced font size
                    duration-150
                    transform
                    -translate-y-3
                    top-4 // Adjusted position
                    z-10
                    origin-[0]
                    ${formatPrice ? 'left-8' : 'left-3'} // Adjusted position
                    peer-placeholder-shown:scale-100
                    peer-placeholder-shown:translate-y-0
                    peer-focus:scale-75
                    peer-focus:-translate-y-4
                    ${errors[id] ? 'text-rose-500' : 'text-zinc-400'}
                `}
            >
                {label}
            </label>
        </div>
    );
};

export default Input;
