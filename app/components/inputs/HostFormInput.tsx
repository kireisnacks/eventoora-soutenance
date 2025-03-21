'use client'

import { FieldValues, FieldErrors, UseFormRegister } from 'react-hook-form'

interface HostFormInputProps {
  id: string;
  label: string;
  type?: string;
  disabled?: boolean;
  required?: boolean;
  register: UseFormRegister<FieldValues>;
  errors: FieldErrors;
}

const HostFormInput: React.FC<HostFormInputProps> = ({
  id,
  label,
  type = "text",
  disabled,
  required,
  register,
  errors
}) => {
  return (
    <div className="flex flex-col gap-2 w-full">
      <label className="font-medium text-sm">
        {label}
      </label>
      <input
        id={id}
        disabled={disabled}
        {...register(id, { required })}
        type={type}
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
    </div>
  )
}

export default HostFormInput
