'use client';

import { Check } from 'lucide-react';
import { cn } from '@/app/lib/utils';

interface ProgressStepsProps {
  currentStep: number;
  totalSteps: number;
}

const ProgressSteps = ({ currentStep, totalSteps }: ProgressStepsProps) => {
  return (
    <div className="flex items-center justify-between w-full px-4 sm:px-8">
      {Array.from({ length: totalSteps }).map((_, index) => (
        <div key={index} className="flex items-center flex-1">
          <div className="flex items-center w-full">
            <div
              className={cn(
                'w-8 h-8 rounded-full flex items-center justify-center transition-colors duration-300',
                index <= currentStep
                  ? 'bg-primary text-white'
                  : 'bg-muted text-muted-foreground'
              )}
            >
              {index < currentStep ? (
                <Check className="w-4 h-4" />
              ) : (
                index + 1
              )}
            </div>
            {index < totalSteps - 1 && (
              <div
                className={cn(
                  'flex-1 h-1 transition-colors duration-300',
                  index < currentStep ? 'bg-primary' : 'bg-muted'
                )}
              />
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProgressSteps;