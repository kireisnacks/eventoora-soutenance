'use client'

interface DropdownProps {
  id: string;
  options: { label: string; value: number }[];
  value?: number;
  onChange: (value: number) => void;
  placeholder?: string;
}

const Dropdown: React.FC<DropdownProps> = ({
  id,
  options,
  value,
  onChange,
  placeholder = "Selectionner une option"
}) => {
  return (
    <div className="w-1/2 relative">
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="
          w-full
          p-4
          font-light
          bg-white
          border-2
          border-neutral-300
          rounded-md
          outline-none
          transition
          focus:border-black
          disabled:opacity-70
          disabled:cursor-not-allowed
        "
      >
        <option value="" disabled>
          {placeholder}
        </option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  )
}

export default Dropdown
