import getCurrentUser from "../actions/getCurrentUser";
import getListings , { IListingsParams } from "../actions/getListings";

import ClientOnly from "../components/ClientOnly"
import Container from "../components/Container"
import EmptyState from "../components/EmptyState"
import ListingCard from "../components/listings/ListingCard";

interface MainProps {
    searchParams: IListingsParams
}

const ListingPage = async({ searchParams }: MainProps) => {
    const listings = await getListings(searchParams);
    const currentUser = await getCurrentUser();
    

    if(listings.length === 0){
        return (
            <ClientOnly>
                <EmptyState showReset/>
            </ClientOnly>
        )
    }
    return(
        <ClientOnly>
            <Container>
                <div className="
                    grid
                    grid-cols-1
                    sm:grid-cols-2
                    md:grid-cols-3
                    lg:grid-cols-4
                    xl:grid-cols-5
                    gap-8
                ">
                    {listings.map((listing:any) =>{
                        return(
                            <ListingCard
                                currentUser={currentUser}
                                key={listing.id}
                                data={listing}
                            />
                        )
                    })}
                </div>
            </Container>
        </ClientOnly>
    )
}

export default ListingPage;