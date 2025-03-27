import EmptyState from "../../components/EmptyState";
import ClientOnly from "../../components/ClientOnly";
import FavoritesClient from "./FavoritesClient";

import getCurrentUser from "@/app/actions/getCurrentUser";
import getFavoriteListings from "@/app/actions/getFavoriteListings";

const ListingPage = async() => {
    const listings = await getFavoriteListings();
    const currentUser = await getCurrentUser();

    if(listings.length===0) {
        return(
            <ClientOnly>
                <EmptyState 
                    title="Pas de favoris trouvés"
                    subtitle="Il semblerait que vous n'avez pas encore ajouté de favoris."
                />
            </ClientOnly>
        )
    }

    return (
        <ClientOnly>
            <FavoritesClient
                listings = {listings}
                currentUser = {currentUser} 
            />
        </ClientOnly>
    )
}

export default ListingPage;
