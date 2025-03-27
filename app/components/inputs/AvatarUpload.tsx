'use client';

import { CldUploadWidget } from "next-cloudinary";
import Image from "next/image";
import { useCallback } from "react";
import { MdPhotoCamera } from "react-icons/md";
import Button from "../Button"; // Assurez-vous d'importer votre composant Button

declare global {
  var cloudinary: any;
}

interface AvatarUploadProps {
  onChange: (value: string) => void;
  value: string;
}

const AvatarUpload: React.FC<AvatarUploadProps> = ({ onChange, value }) => {
  const handleUpload = useCallback(
    (result: any) => {
      onChange(result.info.secure_url);
    },
    [onChange]
  );

  const handleDefault = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      onChange('');
    },
    [onChange]
  );

  return (
    <CldUploadWidget
      onSuccess={handleUpload}
      uploadPreset="fnheptjm"
      options={{ maxFiles: 1 }}
    >
      {({ open }) => (
        <div className="flex flex-col items-center gap-4">
          {/* Cercle avatar + overlay appareil photo */}
          <div
            onClick={() => open?.()}
            className="relative w-[150px] h-[150px] rounded-full cursor-pointer group"
          >
            <Image
              fill
              alt="Avatar"
              src={value || '/placeholder-profile.png'}
              className="rounded-full object-cover border-4 border-neutral-100"
            />
            
            {/* Overlay avec icône caméra */}
            <div className="absolute inset-0 bg-black/30 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <div className="bg-white p-2 rounded-full">
                <MdPhotoCamera className="h-8 w-8 text-neutral-800" />
              </div>
            </div>
          </div>

          {/* Boutons */}
          <div className="flex flex-wrap gap-2 w-full sm:w-auto justify-center">
            <Button 
                label="Changer d'avatar"
                onClick={() => open?.()}
                rounded
                medium
            />
            <Button
                label="Par défaut"
                onClick={handleDefault}
                rounded
                medium
                outline
            />
         </div>
        </div>
      )}
    </CldUploadWidget>
  );
};

export default AvatarUpload;