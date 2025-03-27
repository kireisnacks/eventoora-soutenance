import EmptyState from "../../components/EmptyState";
import ClientOnly from "../../components/ClientOnly";
import MyProfileForm from "./MyProfileForm";
import Background from "../../components/Background";
import Container from "@/app/components/Container";

import getCurrentUser from "@/app/actions/getCurrentUser";

const MyProfilePage = async () => {
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
    return (
        <ClientOnly>
            <Background color="bg-red-400" opacity={90}>
                <Container>
                    <MyProfileForm
                        currentUser={currentUser}
                    />
                </Container>
            </Background>
        </ClientOnly>
    )
    
};


export default MyProfilePage;