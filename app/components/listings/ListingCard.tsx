'use client';

import {Review} from "@prisma/client";

import { SafeSpace, SafeUser , SafeReservation } from "@/app/types";
import { useRouter } from "next/navigation";
import React, { useCallback , useMemo } from "react";
import { format } from "date-fns";
import Image from "next/image";
import HeartButton from "../HeartButton";
import { AiFillStar } from 'react-icons/ai';
import { BsPeople } from 'react-icons/bs';
import  Button  from "../Button";
import Carousel from "./Carousel";



interface ListingCardProps {
    data: SafeSpace & {
        reviews: Review[];
    };
    reservation?: SafeReservation;
    onAction?: (id: string) => void;
    disabled?: boolean;
    actionLabel?: string;
    actionId?: string;
    currentUser?: SafeUser | null;
    badgeLabel? : string;

}

const ListingCard: React.FC<ListingCardProps> = ({
    data,
    reservation,
    onAction,
    disabled,
    actionLabel,
    actionId="",
    currentUser,
    badgeLabel ="",
}) => {
    const router = useRouter();
    //const {getByValue} = useCountries()

    const averageRating = useMemo(() => {
        if(!data.reviews?.length) return null;

        const sum = data.reviews.reduce((acc,review) => acc + review.rating, 0);
        return (sum / data.reviews.length).toFixed(1);
    }, [data.reviews]);

    const handleCancel = useCallback( 
        (e: React.MouseEvent<HTMLButtonElement>) => {
            e.stopPropagation();

            if(disabled){
                return;
            }

            onAction?.(actionId);
         },[onAction, actionId, disabled]
    )

    const price = useMemo(() => {
        if(reservation){
            return reservation.totalPrice;
        }

        return data.price;
    },[reservation, data.price]);

    const reservationDate = useMemo(() => {
        if (!reservation) {
            return null;
        }
    
        const start = new Date(reservation.startDateHour);
        const end = new Date(reservation.endDateHour);
    
        // Format the date and time
        const formattedDate = format(start, 'PP'); // Format the date as 'PP'
        const formattedStartTime = format(start, 'HH:mm'); // Format the start time as 'HH:mm'
        const formattedEndTime = format(end, 'HH:mm'); // Format the end time as 'HH:mm'
    
        return `${formattedDate} | ${formattedStartTime} - ${formattedEndTime}`;
    }, [reservation]);


    return(
        <div 
            onClick={() => router.push(`/listings/${data.id}`)}
            className="
                col-span-1 cursor-pointer group
            "
        >
            <div className="flex flex-col gap-1 w-full">
                <div
                    className="
                        aspect-square
                        w-full
                        relative
                        overflow-hidden
                        rounded-xl
                    "
                >
                    <Carousel images={data.thumbnail} badgeLabel={badgeLabel} />
                    <div className="absolute top-3 right-3">
                        <HeartButton
                            spaceId={data.id}
                            currentUser={currentUser}
                        />
                    </div>
                </div>
                <div className="font-semibold text-lg">
                    {data?.title}
                </div>
                <div className="flex items-center gap-4 font-light text-neutral-500">
                    {reservation ? (
                        // Display reservation date if a reservation exists
                        <div className="font-light text-neutral-500">
                            {reservationDate}
                        </div>
                    ) : (
                        // Display average rating and capacity if no reservation exists
                        <>
                            {averageRating && (
                                <div className="flex items-center gap-1">
                                    <AiFillStar className="text-yellow-500" />
                                    <span>{averageRating}</span>
                                </div>
                            )}
                            <div className="flex items-center gap-1">
                                <BsPeople />
                                <span>{data.capacity} Personnes</span>
                            </div>
                        </>
                    )}
                </div>  
                <div className="flex flex-row items-center gap-1 pb-2">
                    <div className="font-semibold">
                        {price} MGA
                    </div>
                    {!reservation && (
                        <div className="font-light">
                            par heure
                        </div>
                    )}
                </div>
                {onAction && actionLabel && (
                    <Button
                        disabled={disabled}
                        small
                        label={actionLabel}
                        onClick={handleCancel}
                    />
                )}
            </div>
        </div>
    );
}

export default ListingCard;