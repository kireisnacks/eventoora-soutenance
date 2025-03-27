import EmptyState from "../components/EmptyState";
import ClientOnly from "../components/ClientOnly";
import ReservationsClient from "./ReservationsClient";

import getCurrentUser from "../actions/getCurrentUser";
import getReservations from "../actions/getReservations";

const ReservationsPage = async() => {
    const currentUser = await getCurrentUser();


    if(!currentUser) {
        return (
            <ClientOnly>
                <EmptyState
                    title="Non autorisé"
                    subtitle="Vous devez être connecté pour accéder à cette page."    
                />
            </ClientOnly>
        )
    }

    const reservations = await getReservations(
       ({userId: currentUser.id})
    );

    if(reservations.length===0){
        return (
            <ClientOnly>
                <EmptyState
                    title="Pas de réservations trouvées."
                    subtitle="Vous n'avez pas encore effectué de réservations."
                />
            </ClientOnly>
        )
    }

    return (
        <ClientOnly>
            <ReservationsClient 
                reservations = {reservations}
                currentUser = {currentUser}
            />
        </ClientOnly>
    )
}

export default ReservationsPage;