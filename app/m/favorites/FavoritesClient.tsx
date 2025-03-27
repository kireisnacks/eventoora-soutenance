import Container from "../../components/Container";
import Heading from "../../components/Heading";
import ListingCard from "../../components/listings/ListingCard";

import { SafeSpace, SafeUser } from "../../types";

interface FavoritesClientProps {
    listings: SafeSpace[];
    currentUser?: SafeUser | null;
}

const FavoritesClient:React.FC<FavoritesClientProps> = ({
    listings,
    currentUser
}) => {
    return (
        <Container>
            <Heading
                title="Favoris"
                subtitle="La liste des espaces que vous avez mis en favoris !"
            />
            <div
                className="mt-10
                grid
                grid-cols-1
                sm:grid-cols-2
                md:grid-cols-3
                lg:grid-cols-4
                xl:grid-cols-5
                2xl:grid-cols-6
                gap-8
            ">
                {listings.map((listing) =>(
                    <ListingCard
                        currentUser = {currentUser}
                        key={listing.id}
                        data={listing}
                    />
                ))}
            </div>
        </Container>
    );
}

export default FavoritesClient;