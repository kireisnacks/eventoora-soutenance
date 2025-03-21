'use client'

import { useCallback } from "react"
import { Separator } from "../components/ui/separator"
import Button from "../components/Button"
import ProgressSteps from "./ProgressSteps";

interface HostFormProps {
  onSubmit: () => void;
  currentStep: number;
  totalSteps: number;
  title?: string;
  body?: React.ReactElement;
  footer?: React.ReactElement;
  actionLabel: string;
  disabled?: boolean;
  secondaryAction?: () => void;
  secondaryActionLabel?: string;
}

const HostForm: React.FC<HostFormProps> = ({
  onSubmit,
  currentStep,
  totalSteps,
  title,
  body,
  footer,
  actionLabel,
  disabled,
  secondaryAction,
  secondaryActionLabel
}) => {
  const handleSubmit = useCallback(() => {
    if (disabled) {
      return;
    }
    onSubmit();
  }, [disabled, onSubmit]);

  const handleSecondaryAction = useCallback(() => {
    if (disabled || !secondaryAction) {
      return;
    }
    secondaryAction();
  }, [disabled, secondaryAction]);

  return (
    <div className="flex flex-col w-full">
      {/* HEADER */}
      <div className="flex items-center p-5 pb-12 rounded-t justify-center relative">
        <ProgressSteps currentStep={currentStep} totalSteps={totalSteps} />
      </div>
      <Separator />

      {/* BODY */}
      <div className="relative p-4 flex-auto">
        {body}
      </div>

      {/* FOOTER */}
      <div className="flex flex-col gap-2 p-6">
        <div className="flex flex-row items-center gap-4 w-full">
          {secondaryAction && secondaryActionLabel && (
            <Button
              outline
              disabled={disabled}
              label={secondaryActionLabel}
              onClick={handleSecondaryAction}
            />
          )}
          <Button
            disabled={disabled}
            label={actionLabel}
            onClick={handleSubmit}
          />
        </div>
        {footer}
      </div>
    </div>
  )
}

export default HostForm
