// components/SeparatorWithText.tsx
import React from 'react';

interface SeparatorWithTextProps {
  text: string;
}

const SeparatorWithText: React.FC<SeparatorWithTextProps> = ({ text }) => {
  return (
    <div className="flex items-center">
      <hr className="flex-grow border-t border-gray-300" />
      <span className="mx-4 text-gray-500 text-xs">{text}</span>
      <hr className="flex-grow border-t border-gray-300" />
    </div>
  );
};

export default SeparatorWithText;
