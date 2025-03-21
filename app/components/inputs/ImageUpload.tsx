'use client';

import { CldUploadWidget } from 'next-cloudinary';
import Image from 'next/image';
import { useCallback, useEffect, useRef } from 'react';
import { TbPhotoPlus, TbX } from 'react-icons/tb';

interface ImageUploadProps {
    onChange: (value: string[]) => void;
    value: string[];
}

const MAX_IMAGES = 7;

const ImageUpload: React.FC<ImageUploadProps> = ({
    onChange,
    value
}) => {
    const valueRef = useRef(value);
    useEffect(() => {
        valueRef.current = value;
    }, [value]);

    const handleUpload = useCallback((result: any) => {
        if (result.event === "success") {
            const newUrl = result.info.secure_url;
            onChange([...valueRef.current, newUrl]);
        }
    }, [onChange]);

    const handleRemoveImage = useCallback((indexToRemove: number) => {
        const updatedImages = value.filter((_, index) => index !== indexToRemove);
        onChange(updatedImages);
    }, [onChange, value]);

    const renderImageSlot = (index: number) => {
        const hasImage = value[index];
        const isMainImage = index === 0;
        
        return (
            <div
                key={index}
                className={`
                    relative rounded-lg overflow-hidden
                    ${isMainImage ? 'col-span-2 row-span-2' : 'col-span-1 row-span-1'}
                    group transition duration-200
                    ${hasImage ? 'hover:shadow-lg' : 'bg-neutral-200'}
                    aspect-square w-full h-full
                `}
            >
                {hasImage ? (
                    <>
                        <Image
                            fill
                            src={value[index]}
                            alt={`Image ${index + 1}`}
                            className="object-cover"
                        />
                        <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition duration-200">
                            <button
                                onClick={() => handleRemoveImage(index)}
                                className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md hover:bg-red-500 hover:text-white transition"
                            >
                                <TbX size={20} />
                            </button>
                        </div>
                    </>
                ) : (
                    <div className="w-full h-full" />
                )}
            </div>
        );
    };

    return (
        <div className="space-y-4">
            <div className="grid grid-cols-5 gap-3 h-[300px] auto-rows-fr">
                {Array.from({ length: MAX_IMAGES }).map((_, index) => renderImageSlot(index))}
            </div>
            
            {value.length < MAX_IMAGES && (
                <CldUploadWidget
                    onSuccess={handleUpload}
                    uploadPreset="fnheptjm"
                    options={{
                        maxFiles: MAX_IMAGES - value.length,
                        multiple: true
                    }}
                >
                    {({ open }: { open?: () => void }) => (
                        <button
                            onClick={() => open?.()}
                            className="w-full p-4 border-2 border-dashed border-neutral-300 rounded-lg hover:border-neutral-400 transition flex items-center justify-center gap-4"
                        >
                            <TbPhotoPlus size={30} />
                            <span className="font-medium">
                            Ajouter {MAX_IMAGES - value.length === 1 ? '1 photo' : `1 à ${MAX_IMAGES - value.length} photos`}
                            </span>
                        </button>
                    )}
                </CldUploadWidget>
            )}
        </div>
    );
};

export default ImageUpload;
