import EmptyState from "../../components/EmptyState";
import ClientOnly from "../../components/ClientOnly";
import MyListingsClient from "./MyListingsClient";

import getCurrentUser from "@/app/actions/getCurrentUser";
import getReservations from "@/app/actions/getReservations";
import getListings from "@/app/actions/getListings";

const MyListingsPage = async () => {
    const currentUser = await getCurrentUser();
    if(!currentUser) {
        return (
            <ClientOnly>
                <EmptyState
                    title="Non autorisé"
                    subtitle="Vous devez être connecté pour accéder à cette page."
                />
            </ClientOnly>
        );
    }
    const reservations = await getReservations({
        authorId: currentUser.id,
    });
    const hostedSpaces = await getListings({ userId: currentUser.id });

    if (reservations.length === 0) {
        return (
            <ClientOnly>
                <EmptyState
                    title="Pas de réservations trouvés"
                    subtitle="Il semblerait qu'il n'y ait pas de réservations pour le moment."
                />
            </ClientOnly>
        )
    }

    return (
        <ClientOnly>
            <MyListingsClient
                reservations={reservations}
                currentUser={currentUser}
                hostedSpaces={hostedSpaces}
            />
        </ClientOnly>
    )
    
};


export default MyListingsPage;