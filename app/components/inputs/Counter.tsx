'use client';

import { useState, useCallback } from "react";
import { Minus, Plus } from 'lucide-react';

interface CounterProps {
    title: string;
    subtitle: string;
    value: number;
    onChange: (value: number) => void;
}

const Counter = ({
    title,
    subtitle,
    value,
    onChange
}: CounterProps) => {
    const onAdd = useCallback(() => {
        onChange(value + 1);
    }, [onChange, value]);

    const onReduce = useCallback(() => {
        if (value === 1) {
            return;
        }
        onChange(value - 1);
    }, [value, onChange]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = parseInt(e.target.value.replace(/^0+/, '')) || 0;
        onChange(newValue);
    };

    return (
        <div className="flex flex-row items-center justify-between">
            <div className="flex flex-col">
                <div className="font-medium">{title}</div>
                <div className="font-light text-gray-600">{subtitle}</div>
            </div>
            <div className="flex flex-row items-center gap-4">
                <div
                    onClick={onReduce}
                    className="
                    w-10
                    h-10
                    rounded-full
                    border-[1px]
                    border-neutral-400
                    flex
                    items-center
                    justify-center
                    text-neutral-600
                    cursor-pointer
                    hover:opacity-80
                    transition
                    "
                >
                    <Minus />
                </div>
                <input
                    type="number"
                    value={value.toString()}
                    onChange={handleInputChange}
                    className="w-8   text-center font-light text-xl text-neutral-600 border-none focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />

                <div
                    onClick={onAdd}
                    className="
                    w-10
                    h-10
                    rounded-full
                    border-[1px]
                    border-neutral-400
                    flex
                    items-center
                    justify-center
                    text-neutral-600
                    cursor-pointer
                    hover:opacity-80
                    transition
                    "
                >
                    <Plus />
                </div>
            </div>
        </div>
    )
}

export default Counter;
