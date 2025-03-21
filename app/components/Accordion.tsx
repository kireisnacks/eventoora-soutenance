// components/ui/Accordion.tsx
'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { cn } from '@/app/lib/utils';

interface AccordionProps {
  title: string;
  children: React.ReactNode;
  className?: string;
  defaultOpen?: boolean;
}

const Accordion: React.FC<AccordionProps> = ({ 
  title, 
  children, 
  className,
  defaultOpen = false 
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className={cn("border rounded-lg overflow-hidden", className)}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-4 text-left bg-neutral-50 hover:bg-neutral-100 transition-colors"
      >
        <div className="flex justify-between items-center">
          <h3 className="font-semibold">{title}</h3>
          {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </div>
      </button>
      {isOpen && (
        <div className="p-4 text-sm text-neutral-600">
          {children}
        </div>
      )}
    </div>
  );
};

export default Accordion;