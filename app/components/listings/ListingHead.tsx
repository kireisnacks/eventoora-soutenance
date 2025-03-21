'use client';

import { useRouter } from "next/navigation";
import { SafeUser } from "@/app/types";
import  Heading  from "@/app/components/Heading";
import ListingImageGrid from "./ListingImageGrid";
import HeartButton from "../HeartButton";

interface ListingHeadProps {
    title: string,
    city: string;
    thumbnail: string[];
    id: string;
    currentUser?: SafeUser | null;
}

const ListingHead: React.FC<ListingHeadProps> = ({
    title,
    thumbnail,
    city,
    id,
    currentUser
}) => {
    const router = useRouter();
    return(
        <>
            <div className="flex flex-row items-center justify-between">
                <Heading
                title={title}
                subtitle={city}
                />
                <div className="relative hover:scale-110 transition-transform">
                <HeartButton 
                    spaceId={id}
                    currentUser={currentUser}
                />
                </div>
            </div>
            <ListingImageGrid thumbnail={thumbnail} />
        </>
    );
}

export default ListingHead

