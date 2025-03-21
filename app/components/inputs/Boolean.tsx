'use client'

interface BooleanToggleProps {
  value: boolean;
  onChange: (value: boolean) => void;
}

const BooleanToggle: React.FC<BooleanToggleProps> = ({
  value,
  onChange
}) => {
  return (
    <div className="flex">
      <button
        onClick={() => onChange(true)}
        className={`
          px-4
          py-2
          font-medium
          transition
          ${value ? 'bg-eventoora text-white' : 'bg-white text-black border-2'}
        `}
      >
        Oui
      </button>
      <button
        onClick={() => onChange(false)}
        className={`
          px-4
          py-2
          font-medium
          transition
          ${!value ? 'bg-eventoora text-white' : 'bg-white text-black border-2'}
        `}
      >
        Non
      </button>
    </div>
  )
}

export default BooleanToggle
