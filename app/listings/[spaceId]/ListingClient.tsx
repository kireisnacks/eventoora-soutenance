'use client';

import { useRouter } from "next/navigation";
import { useMemo, useState, useCallback } from 'react';
import { format, differenceInMinutes, addMinutes } from 'date-fns';
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

  const generateTimeSlots = (start: Date, end: Date) => {
    const slots: string[] = [];
    let current = new Date(start);
    while (current < end) {
      slots.push(format(current, 'HH:mm'));
      current = addMinutes(current, 30);
    }
    return slots;
  };

  const bookedSlots = useMemo(() => {
    return reservations.map(reservation => ({
      date: format(new Date(reservation.startDateHour), 'yyyy-MM-dd'),
      slots: generateTimeSlots(
        new Date(reservation.startDateHour),
        new Date(reservation.endDateHour)
      )
    }));
  }, [reservations]);


  const disabledDates = useMemo(() => {
    const closedDates = [];
    const currentDate = new Date();
    for (let i = 0; i < 365; i++) {
      const date = new Date(currentDate);
      date.setDate(currentDate.getDate() + i);
      const formattedDay = format(date, 'EEEE', { locale: fr })
        .toLowerCase()
        .replace(/^\w/, (c) => c.toUpperCase());
      
      const hours = listing.operatingHours.find(oh => 
        oh.dayOfWeek.toLowerCase() === formattedDay.toLowerCase()
      );
      if (!hours?.isOpen) closedDates.push(new Date(date));
    }
    return closedDates;
  }, [listing.operatingHours]);

  const totalPrice = useMemo(() => {
    return dateTimeEntries.reduce((sum, entry) => {
      if (!entry.startTime || !entry.endTime) return sum;
      const [startH, startM] = entry.startTime.split(':').map(Number);
      const [endH, endM] = entry.endTime.split(':').map(Number);
      const hours = (endH + endM/60) - (startH + startM/60);
      return sum + Math.round(hours * listing.price * 1.08);
    }, 0);
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
      const isValid = dateTimeEntries.every(entry => 
        entry.startTime && entry.endTime &&
        new Date(`${format(entry.date, 'yyyy-MM-dd')}T${entry.startTime}`) <
        new Date(`${format(entry.date, 'yyyy-MM-dd')}T${entry.endTime}`)
      );

      if (!isValid) throw new Error('Plages horaires invalides');

      const reservationsData = dateTimeEntries.map(entry => {
        const start = new Date(`${format(entry.date, 'yyyy-MM-dd')}T${entry.startTime}`);
        const end = new Date(`${format(entry.date, 'yyyy-MM-dd')}T${entry.endTime}`);
        const hours = differenceInMinutes(end, start) / 60;
        
        return {
          startDateHour: start.toISOString(),
          endDateHour: end.toISOString(),
          price: Math.round(hours * listing.price * 1.08)
        };
      });

      const response = await fetch('/api/create-stripe-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          spaceId: listing.id,
          reservations: reservationsData
        })
      });

      if (!response.ok) throw new Error('Échec de la création de session Stripe');
      
      const { url } = await response.json();
      window.location.href = url;

    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Erreur inconnue');
    } finally {
      setIsSubmitting(false);
    }
  }, [currentUser, dateTimeEntries, listing.id, listing.price, loginModal]);

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
                bookedSlots={bookedSlots}
                disabledDates={disabledDates}
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