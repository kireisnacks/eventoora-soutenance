'use client';

import { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { SafeReservation, SafeUser } from "@/app/types";
import Container from "../../components/Container";
import Heading from "../../components/Heading";
import ListingCard from "../../components/listings/ListingCard";
import MyListingCard from "../../components/listings/MyListingCard";
import toast from "react-hot-toast";
import { SectionHeading } from "../../components/SectionHeading";
import EmptyState from "../../components/EmptyState";

interface MyListingsClientProps {
  reservations: SafeReservation[];
  currentUser?: SafeUser | null;
  hostedSpaces: any[];
}

const MyListingsClient: React.FC<MyListingsClientProps> = ({
  reservations,
  currentUser,
  hostedSpaces,
}) => {
  const router = useRouter();
  const [deletingId, setDeletingId] = useState('');
  const [selectedSpaceId, setSelectedSpaceId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [filteredReservations, setFilteredReservations] = useState(reservations);

  // Toggle pour sélectionner l'espace
  const toggleSpaceSelection = (spaceId: string) => {
    setSelectedSpaceId(prev => prev === spaceId ? null : spaceId);
  };

  // Filtrer les réservations selon l'espace sélectionné
  useEffect(() => {
    setIsLoading(true);
    const filtered = selectedSpaceId 
      ? reservations.filter(r => r.space.id === selectedSpaceId)
      : reservations;
    
    setFilteredReservations(filtered);
    setIsLoading(false);
  }, [selectedSpaceId, reservations]);

  // Logique d'annulation existante
  const onCancel = useCallback(async (id: string) => {
    /* ... (garder la logique existante) ... */
  }, [router]);

  // Catégoriser les réservations
  const categorizeReservations = (reservations: SafeReservation[]) => {
    return reservations.reduce((acc, reservation) => {
      const status = getReservationStatus(reservation);
      if (!acc[status]) acc[status] = [];
      acc[status].push(reservation);
      return acc;
    }, {} as Record<string, SafeReservation[]>);
  };

  // Obtenir le statut d'une réservation
  const getReservationStatus = (reservation: SafeReservation) => {
    const now = new Date();
    if (reservation.status === 'CANCELED') return 'Annulé';
    return new Date(reservation.endDateHour) < now ? 'Terminé' : 'En cours';
  };

  // Trier par date de création
  const sortedReservations = filteredReservations.sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  const categorized = categorizeReservations(sortedReservations);

  return (
    <Container>
      {/* Section Mes Espaces */}
      <SectionHeading title="Mes espaces" />
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-12">
        {hostedSpaces.map((space) => (
          <ListingCard
            key={space.id}
            data={space}
            currentUser={currentUser}
            actionLabel={selectedSpaceId === space.id ? "Masquer les réservations" : "Afficher les réservations"}
            onAction={() => toggleSpaceSelection(space.id)}
            badgeLabel={selectedSpaceId === space.id ? "Sélectionné" : undefined}
          />
        ))}
      </div>

      {/* Section Réservations */}
      <SectionHeading title="Les réservations de mes espaces" />
      
      {isLoading && (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
        </div>
      )}

      {!isLoading && Object.entries(categorized).map(([status, res]) => (
        <div key={status} className="mb-8">
          <Heading
            title={status}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {res.length === 0 ? (
              <EmptyState
                title="Aucune réservation"
                subtitle={`Aucune réservation ${status.toLowerCase()} trouvée`}
              />
            ) : (
              res.map((reservation) => (
                <MyListingCard
                  key={reservation.id}
                  data={reservation.space}
                  reservation={reservation}
                  onAction={onCancel}
                  actionLabel="Annuler la réservation"
                  disabled={reservation.status === "CANCELED"}
                  currentUser={currentUser}
                />
              ))
            )}
          </div>
        </div>
      ))}
    </Container>
  );
};

export default MyListingsClient;