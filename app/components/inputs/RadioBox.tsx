'use client';

interface RadioBoxProps {
  id: string;
  label: string;
  description?: string;
  selected?: boolean;
  onChange: (value: boolean) => void;
}

const RadioBox: React.FC<RadioBoxProps> = ({
  id,
  label,
  description,
  selected,
  onChange
}) => {
  return (
    <div
      onClick={() => onChange(!selected)}
      className={`
        p-4
        border-2
        rounded-lg
        cursor-pointer
        transition
        flex
        gap-4
        items-start
        hover:border-black
        ${selected ? 'border-black bg-neutral-50' : 'border-neutral-200'}
      `}
    >
      <div className="mt-1">
        <div className={`
          w-5
          h-5
          rounded-full
          border-2
          flex
          items-center
          justify-center
          ${selected ? 'border-black' : 'border-neutral-400'}
        `}>
          <div className={`
            w-3
            h-3
            rounded-full
            transition
            ${selected ? 'bg-black' : 'bg-transparent'}
          `}/>
        </div>
      </div>
      <div>
        <div className="font-semibold">{label}</div>
        {description && (
          <div className="text-neutral-500 text-sm mt-1">
            {description}
          </div>
        )}
      </div>
    </div>
  );
};

export default RadioBox;
