'use client';

import { FieldValues, FieldErrors, UseFormRegister } from 'react-hook-form'

interface TextAreaProps {
    id: string;
    minLength?: number;
    maxLength?: number;
    disabled?: boolean;
    required?: boolean;
    register: UseFormRegister<FieldValues>;
    errors: FieldErrors;
    placeholder?: string;
  }
  
  const TextArea: React.FC<TextAreaProps> = ({
    id,
    minLength = 50,
    maxLength = 500,
    disabled,
    required,
    register,
    errors,
    placeholder
  }) => {
    return (
      <div className="flex flex-col gap-2 w-full">
        <textarea
          id={id}
          disabled={disabled}
          rows={6}
          placeholder={placeholder}
          {...register(id, { required, minLength, maxLength })}
          className={`
            w-full
            p-4
            font-light
            bg-white
            border-2
            rounded-md
            outline-none
            transition
            disabled:opacity-70
            disabled:cursor-not-allowed
            ${errors[id] ? 'border-rose-500' : 'border-neutral-300'}
            ${errors[id] ? 'focus:border-rose-500' : 'focus:border-black'}
          `}
        />
        <div className="text-sm text-gray-500 self-end">
          {minLength} - {maxLength} Characters
        </div>
      </div>
    )
  }

  export default TextArea;
  