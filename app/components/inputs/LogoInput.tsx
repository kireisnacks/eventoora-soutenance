'use client';

import { FieldValues, UseFormRegister, FieldErrors } from 'react-hook-form';
import { LucideIcon } from 'lucide-react';

interface LogoInputProps {
  id: string;
  label: string;
  icon: LucideIcon;
  type?: string;
  disabled?: boolean;
  required?: boolean;
  register: UseFormRegister<FieldValues>;
  errors: FieldErrors;
  min?: number;
  max?: number;
}

const LogoInput: React.FC<LogoInputProps> = ({
  id,
  label,
  icon: Icon,
  type = 'number',
  disabled,
  register,
  required,
  errors,
  min,
  max,
}) => {
  return (
    <div className="flex flex-col gap-2">
      <label
        htmlFor={id}
        className="text-sm font-medium"
      >
        {label}
      </label>
      <div className={`
        group
        flex
        items-center
        w-full
        h-10
        bg-white
        border
        transition
        ${errors[id] ? 'border-rose-500' : 'border-neutral-300'}
        ${errors[id] ? 'focus-within:border-rose-500' : 'focus-within:border-black'}
      `}>
        <div className="flex items-center h-full px-2">
          <Icon size={16} className="text-neutral-700" />
          <div className={`
            h-full
            w-[1px]
            mx-2
            transition
            ${errors[id] ? 'bg-rose-500' : 'bg-neutral-300'}
            ${errors[id] ? 'group-focus-within:bg-rose-500' : 'group-focus-within:bg-black'}
          `} />
        </div>
        <input
          id={id}
          disabled={disabled}
          {...register(id, { 
            required,
            valueAsNumber: type === 'number',
            min,
            max
          })}
          type={type}
          className="
            w-full
            h-full
            outline-none
            text-sm
            disabled:opacity-70
            disabled:cursor-not-allowed
          "
        />
      </div>
    </div>
  );
};

export default LogoInput;
