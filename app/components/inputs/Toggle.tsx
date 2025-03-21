'use client';

interface ToggleProps {
  checked: boolean;
  onChange: () => void;
  disabled?: boolean;
}

const Toggle: React.FC<ToggleProps> = ({ checked, onChange }) => {
  return (
    <button
      onClick={onChange}
      className={`
        relative 
        inline-flex 
        h-6 
        w-11 
        items-center 
        rounded-full 
        transition-colors 
        duration-300 
        ease-in-out
        focus:outline-none
        ${checked ? 'bg-green-500' : 'bg-red-500'}
      `}
    >
      <span
        className={`
          inline-block 
          h-4 
          w-4 
          transform 
          rounded-full 
          bg-white 
          shadow-lg 
          transition-transform 
          duration-300 
          ease-in-out
          ${checked ? 'translate-x-6' : 'translate-x-1'}
        `}
      />
    </button>
  );
};

export default Toggle;
