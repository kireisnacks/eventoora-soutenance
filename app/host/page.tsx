'use client';

import ClientOnly from "../components/ClientOnly";
import Container from "../components/Container";
import HostWindow from "./HostWindow";
import Background from "../components/Background";

const HostPage = () => {
    return (
        <ClientOnly>
            <Background color="bg-red-400" opacity={90}>
                <Container>
                    <HostWindow />
                </Container>
            </Background>
        </ClientOnly>
    );
}

export default HostPage;