'use client';

import { useRouter } from "next/navigation";
import { useMemo, useState, useCallback } from 'react';
import { DateRange } from 'react-date-range';
import { format, differenceInMinutes } from 'date-fns';
import { fr } from 'date-fns/locale';
import toast from 'react-hot-toast';

import { SafeSpace, SafeUser, SafeReservation } from "@/app/types";
import Container from "@/app/components/Container";
import ListingHead from "@/app/components/listings/ListingHead";
import ListingInfo from "@/app/components/listings/ListingInfo";
import { cancellationPolicies } from "@/app/host/HostWindow";
import ReservationForm from "@/app/components/listings/ReservationForm";
import useLoginModal from "@/app/hooks/useLoginModal";

interface DateTimeEntry {
  date: Date;
  startTime: string;
  endTime: string;
}

interface ListingClientProps {
  reservations?: SafeReservation[];
  listing: SafeSpace & {
    user: SafeUser;
  };
  currentUser?: SafeUser | null;
}


const ListingClient: React.FC<ListingClientProps> = ({
  listing,
  reservations = [],
  currentUser
}) => {
  const loginModal = useLoginModal();
  const router = useRouter();
  const [dateTimeEntries, setDateTimeEntries] = useState<DateTimeEntry[]>([
    { date: new Date(), startTime: '', endTime: '' }
  ]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const disabledDates = useMemo(() => {
    // Get reservation-blocked dates
    const reservationDates = reservations
      .filter(reservation => 
        reservation.status === 'CONFIRMED' || 
        reservation.status === 'PAYMENT_PENDING'
      )
      .flatMap(reservation => {
        const start = new Date(reservation.startDateHour);
        const end = new Date(reservation.endDateHour);
        const dates = [];
        let current = start;
        while (current <= end) {
          dates.push(new Date(current));
          current = new Date(current.setDate(current.getDate() + 1));
        }
        return dates;
      });

    // Get operating-hours closed dates
    const closedDates = [];
    const currentDate = new Date();

    for (let i = 0; i < 365; i++) {
        const date = new Date(currentDate);
        date.setDate(currentDate.getDate() + i);
        
        // Format to French day name and capitalize first letter
        const formattedDay = format(date, 'EEEE', { locale: fr })
                              .toLowerCase()
                              .replace(/^\w/, (c) => c.toUpperCase());
        
        const hours = listing.operatingHours.find(oh => 
          oh.dayOfWeek.toLowerCase() === formattedDay.toLowerCase()
        );
    
        if (!hours?.isOpen) {
          closedDates.push(new Date(date));
        }
      }

    return [...reservationDates, ...closedDates];
  }, [reservations, listing.operatingHours]);

  const { basePrice, totalPrice } = useMemo(() => {
    const base = dateTimeEntries.reduce((sum, entry) => {
      if (!entry.startTime || !entry.endTime) return sum;
      const [startH, startM] = entry.startTime.split(':').map(Number);
      const [endH, endM] = entry.endTime.split(':').map(Number);
      const hours = (endH + endM/60) - (startH + startM/60);
      return sum + (hours * listing.price);
    }, 0);
    
    return {
      basePrice: base,
      totalPrice: base * 1.08 // Base + 8% fee
    };
  }, [dateTimeEntries, listing.price]);

  const handleAddEntry = useCallback(() => {
    setDateTimeEntries(prev => [...prev, {
      date: prev[0]?.date || new Date(),
      startTime: '',
      endTime: ''
    }]);
  }, []);

  const handleSubmit = useCallback(async () => {
    if (!currentUser) return loginModal.onOpen();

    setIsSubmitting(true);
    try {
      await Promise.all(dateTimeEntries.map(async (entry) => {
        if (!entry.startTime || !entry.endTime) return;
        
        const startDateHour = new Date(`${format(entry.date, 'yyyy-MM-dd')}T${entry.startTime}`);
        const endDateHour = new Date(`${format(entry.date, 'yyyy-MM-dd')}T${entry.endTime}`);
        
        const response = await fetch('/api/reservations', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            spaceId: listing.id,
            startDateHour: startDateHour.toISOString(),
            endDateHour: endDateHour.toISOString(),
            totalPrice: (differenceInMinutes(endDateHour, startDateHour) / 60) * listing.price
          })
        });

        if (!response.ok) throw new Error('Reservation failed');
      }));

      toast.success('Réservation créée avec succès !');
      router.push('/reservations');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Échec de la réservation');
    } finally {
      setIsSubmitting(false);
    }
  }, [currentUser, dateTimeEntries, listing.id, listing.price, loginModal, router]);

  const cancellationPolicy = useMemo(() => {
    return cancellationPolicies[listing.cancellationPolicy];
  }, [listing.cancellationPolicy]);

  return (
    <Container>
      <div className="max-w-screen-lg mx-auto bg-white rounded-lg shadow-xl p-4 md:p-8">
        <div className="flex flex-col gap-6">
          <ListingHead
            title={listing.title}
            thumbnail={listing.thumbnail}
            city={listing.city}
            id={listing.id}
            currentUser={currentUser}
          />
          <div className="grid grid-cols-1 md:grid-cols-7 md:gap-10 mt-6">
            <ListingInfo 
              user={listing.user}
              category={listing.category}
              capacity={listing.capacity}
              minimumHour={listing.minimumHour}
              minimumAge={listing.minimumAge}
              size={listing.size}
              description={listing.description}
              parkingDescription={listing.parkingDescription}
              rules={listing.rules}
              scard={listing.scard}
              assets={listing.assets}
              operatingHours={listing.operatingHours}
              cancellationPolicy={cancellationPolicy}
            />
            <div className="order-first mb-10 md:order-last md:col-span-3">
              <ReservationForm
                price={listing.price}
                minimumHour={listing.minimumHour}
                operatingHours={listing.operatingHours}
                disabledDates={disabledDates}
                basePrice={basePrice}
                totalPrice={totalPrice}
                isSubmitting={isSubmitting}
                dateTimeEntries={dateTimeEntries}
                onAddEntry={handleAddEntry}
                onRemoveEntry={(index) => setDateTimeEntries(prev => prev.filter((_, i) => i !== index))}
                onDateChange={(index, date) => setDateTimeEntries(prev => 
                  prev.map((entry, i) => i === index ? { ...entry, date } : entry)
                )}
                onTimeChange={(index, type, value) => setDateTimeEntries(prev => 
                  prev.map((entry, i) => i === index ? {
                    ...entry,
                    [type === 'start' ? 'startTime' : 'endTime']: value
                  } : entry)
                )}
                onSubmit={handleSubmit}
              />
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
};

export default ListingClient;