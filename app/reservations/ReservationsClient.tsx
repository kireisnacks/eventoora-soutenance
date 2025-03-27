'use client';

import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import axios from "axios";

import Container from "../components/Container";
import Heading from "../components/Heading";
import ListingCard from "../components/listings/ListingCard";

import {SafeReservation, SafeUser} from "../types";
import toast from "react-hot-toast";

interface ReservationsClientProps {
    reservations: SafeReservation [];
    currentUser?: SafeUser | null;
}

const ReservationsClient: React.FC<ReservationsClientProps> = ({
    reservations,
    currentUser
}) => {
    const router = useRouter();
    const [deletingId, setDeletingId] = useState('');

    const onCancel = useCallback((id: string) => {
        setDeletingId(id);

        axios.patch(`/api/reservations/${id}`, {
            status: 'CANCELED'
        })
        .then(() => {
            toast.success('Réservation annulée avec succès');
            router.refresh();
        })
        .catch((error) => {
            toast.error(error?.response?.data?.error);
        })
        .finally(() => {
            setDeletingId('');
        })

    },[router]);
    return (
        <Container>
            <Heading
                title="Mes réservations" 
                subtitle="Retrouvez ici toutes vos réservations passées,  en cours et à venir"
            />
            <div 
                className="
                    mt-10
                    grid
                    grid-cols-1
                    sm:grid-cols-2
                    md:grid-cols-3
                    lg:grid-cols-4
                    xl:grid-cols-5
                    2xl:grid-cols-6
                    gap-6
            ">
                {reservations.map((reservation) => (
                    <ListingCard
                        key={reservation.id}
                        data={reservation.space}
                        reservation={reservation}
                        actionId = {reservation.id}
                        onAction = {onCancel}
                        disabled = {reservation.status === "CANCELED" || deletingId === reservation.id}
                        actionLabel = "Annuler reservation"
                        currentUser={currentUser}
                        badgeLabel={reservation.status}
                    />
                ))} 

            </div>
        </Container>
    );
}

export default ReservationsClient;