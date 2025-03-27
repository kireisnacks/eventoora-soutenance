'use client';

import { SafeUser } from "@/app/types";

import Heading from "@/app/components/Heading";
import { SectionHeading } from "@/app/components/SectionHeading";
import Button from "@/app/components/Button";
import HostFormInput from "@/app/components/inputs/HostFormInput";
import AvatarUpload from "@/app/components/inputs/AvatarUpload";

import { useForm , FieldValues , SubmitHandler } from "react-hook-form";
import { useState } from 'react';
import { useRouter } from 'next/navigation';

import axios from "axios";
import { toast } from "react-hot-toast";

interface MyProfileFormProps {
    currentUser?: SafeUser | null;
}

const MyProfileForm: React.FC<MyProfileFormProps> = ({
    currentUser
}) => {
    const router = useRouter();

    const [isLoading, setIsLoading] = useState(false);

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors },
    } = useForm<FieldValues>({
        defaultValues: {
            firstName: currentUser?.firstName || '',
            lastName: currentUser?.lastName || '',
            email: currentUser?.email || '',
            dateOfBirth: currentUser?.dateOfBirth
                ? new Date(currentUser.dateOfBirth).toISOString().split('T')[0]
                : '',
            phone: currentUser?.phone || '',
            sexe: currentUser?.sexe || '',
            image: currentUser?.image || '', 
        }
    });

    const image = watch('image');

    const setCustomValue = (id: string, value: any) => {
        setValue(id, value, {
            shouldDirty: true,
            shouldValidate: true,
            shouldTouch: true,
        })
    }

    const onSubmit: SubmitHandler<FieldValues> = (data) => {
        setIsLoading(true);

        axios.patch('/api/user', data)
        .then(() => {
            toast.success('Profil mis à jour avec succès');
            router.refresh();
        })
        .catch(() => {
            toast.error('Something went wrong');
        })
        .finally(() => {
            setIsLoading(false);
        })
    }

    return(
        <div className="max-w-screen-lg mx-auto bg-white rounded-lg shadow-xl p-4 md:p-8 md:pb-24">
            <Heading 
                title="Compte"
                subtitle="Gérez vos informations personnelles/publiques"
            />
            <SectionHeading title="Avatar" />
            <AvatarUpload 
                onChange={(value) => setCustomValue('image', value)}
                value = {image}
            />
            <div className="space-y-6">
                <SectionHeading title="Informations de base"/>
                {/* Prénom + Nom */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <HostFormInput
                        id="firstName"
                        label="Prénom"
                        register={register}
                        errors={errors}
                        disabled={isLoading}
                    />
                    <HostFormInput
                        id="lastName"
                        label="Nom de famille"
                        register={register}
                        errors={errors}
                        disabled={isLoading}
                    />
                </div>

                {/* Email */}
                <HostFormInput
                    id="email"
                    label="Adresse email"
                    type="email"
                    register={register}
                    errors={errors}
                    disabled={true}
                />

                {/* Date de naissance + Téléphone */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-12">
                    <HostFormInput
                        id="dateOfBirth"
                        label="Date de naissance"
                        type="date"
                        register={register}
                        errors={errors}
                        disabled={isLoading}
                    />
                    <HostFormInput
                        id="phone"
                        label="Téléphone"
                        type="tel"
                        register={register}
                        errors={errors}
                        disabled={isLoading}
                    />
                </div>
            </div>
            {/* Bouton de soumission */}
            <Button 
                label="Enregistrer les modifications"
                disabled={isLoading}
                onClick={handleSubmit(onSubmit)}
                rounded
            />
        </div>
    );
};

export default MyProfileForm;