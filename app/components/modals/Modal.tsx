'use client';

import { useState , useEffect, useCallback } from "react";
import { X } from 'lucide-react';
import { Separator } from "../ui/separator";
import Button from "../Button";
import SplitText from "../animata/text/split-text";

interface ModalProps {
    isOpen?: boolean;
    onClose: () => void;
    onSubmit: () => void;
    title?: string;
    body?: React.ReactElement;
    footer?: React.ReactElement;
    actionLabel: string;
    disabled?: boolean;
    secondaryAction?: () => void;
    secondaryActionLabel?: string;
}

const Modal: React.FC<ModalProps> = (
    {
        isOpen,
        onClose,
        onSubmit,
        title,
        body,
        footer,
        actionLabel,
        disabled,
        secondaryAction,
        secondaryActionLabel
    }
) => { 
    const[showModal, setShowModal] = useState(isOpen);

    useEffect(() => {
        setShowModal(isOpen);
    }, [isOpen]);

    const handleClose = useCallback(() => {
        if(disabled) {
            return;
        }

        setShowModal(false);
        setTimeout(() => {
            onClose();
        }, 300);
    }, [disabled, onClose]);

    const handleSubmit = useCallback(() => {
        if(disabled) {
            return;
        }

        onSubmit();
    }, [disabled, onSubmit]);

    const handleSecondaryAction = useCallback(() => {
        if(disabled || !secondaryAction) {
            return;
        }

        secondaryAction();
    },[disabled, secondaryAction]);

    if(!isOpen) {
        return null;
    }

    return (
        <>
            <div 
                className="
                    justify-center 
                    items-center
                    flex
                    overflow-x-hidden
                    overflow-y-auto
                    fixed
                    pt-8
                    inset-0
                    z-50
                    outline-none
                    focus:outline-none
                    bg-neutral-800/70
                "
            >
                <div
                    className="
                        relative
                        w-full
                        md:w-4/6
                        lg:w-3/6
                        xl:w-2/5
                        my-6
                        mx-auto
                        h-full
                        lg:h-auto
                        md:h-auto
                    "
                >
                    {/* CONTENT */}
                    <div 
                     className={`
                        translate
                        duration-300
                        h-full
                        ${showModal ? 'translate-y-0' : 'translate-y-full'}
                        ${showModal ? 'opacity-100' : 'opacity-0'}
                     `}
                    >
                        <div
                            className ="
                                translate
                                h-full
                                lg:h-auto
                                md:h-auto
                                rounded-lg
                                shadow-lg
                                border-0
                                relative
                                flex
                                flex-col
                                w-full
                                bg-white
                                outline-none
                                focus:outline-none
                                p-4
                            "
                        >
                            {/* HEADER */}
                            <div
                                className="
                                    flex
                                    items-center
                                    p-5
                                    rounded-t
                                    justify-center
                                    relative
                                    border-p-[1px]
                                "
                            >
                                <button
                                    onClick={handleClose}
                                    className="
                                        p-1
                                        border-0
                                        hover:opacity-70
                                        transition
                                        absolute
                                        right-9
                                    "
                                >
                                    <X size={18}/>
                                </button>
                                <div className="text-sm font-semibold">
                                    <SplitText text={title}/>
                                </div>
                            </div>
                            <Separator />

                            {/* BODY */}
                            <div className="relative p-4 flex-auto">
                                {body}
                            </div>

                            {/* FOOTER */}
                            <div className="flex flex-col gap-2 p-6">
                                <div
                                    className ="
                                        flex
                                        flex-row
                                        items-center
                                        gap-4
                                        w-full
                                    "
                                >
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
                    </div>
                </div>
            </div>
        </>
    );
}

export default Modal;