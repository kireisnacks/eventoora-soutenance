import getListingById from "@/app/actions/getListingById";
import getReservations from "@/app/actions/getReservations";
import getCurrentUser from "@/app/actions/getCurrentUser";

import EmptyState from "@/app/components/EmptyState";
import ClientOnly from "@/app/components/ClientOnly";
import Background from "@/app/components/Background";

import ListingClient from "./ListingClient";


interface IParams {
    spaceId?: string;
}
const ListingPage = async ({ params }: { params: IParams }) => {
    const listing = await getListingById(params);
    const reservations = await getReservations(params);
    const currentUser = await getCurrentUser();

    if(!listing) {
        return (
            <ClientOnly>
                <EmptyState />
            </ClientOnly>
        );
    }

    return (
        <ClientOnly>
            <Background color="bg-red-400" opacity={90}>
                <ListingClient
                    listing={listing}
                    currentUser={currentUser}
                    reservations={reservations}
                />
            </Background>
        </ClientOnly>
    );
}

export default ListingPage;