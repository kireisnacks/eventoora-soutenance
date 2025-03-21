'use client';

import { useRouter } from "next/navigation";

import Heading from './Heading';
import Button from './Button';

interface EmptyState{
    title?: string;
    subtitle?: string;
    showReset?: boolean;
}

const EmptyState:React.FC<EmptyState>  = ({
    title = "Pas de résultats.",
    subtitle = "Essayez de changer ou de supprimer certains de vos filtres.",
    showReset
}) => {
    const router = useRouter();
    return(
        <div
            className="
                h-[60vh]
                flex
                flex-col
                gap-2
                justify-center
                items-center
            ">
            <Heading
                center
                title={title}
                subtitle={subtitle}
            />
            <div className="w-64 mt-4">
                {showReset && (
                    <Button
                        outline
                        label="Supprimer tous les filtres"
                        onClick={() => router.push('/listings')}
                        rounded
                    />       
                )}
            </div>
        </div>
    );
}

export default EmptyState;