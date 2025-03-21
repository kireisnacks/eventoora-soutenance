import { useState, useEffect } from 'react';
import { addMinutes, differenceInMinutes, format, parseISO, setHours, setMinutes } from 'date-fns';
import axios from 'axios';
import { OperatingHours, Reservation } from '@prisma/client';

interface AvailabilityData {
  possibleTimes: string[];
  availableTimes: string[];
}

interface UseAvailabilityProps {
  spaceId: string;
  selectedDate: Date;
  minimumHours: number;
}

export default function useAvailability({ spaceId, selectedDate, minimumHours }: UseAvailabilityProps) {
  const [availability, setAvailability] = useState<AvailabilityData>({
    possibleTimes: [],
    availableTimes: []
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateSlots = (operatingHours: OperatingHours[], reservations: Reservation[], date: Date) => {
    const dayOfWeek = format(date, 'EEEE');
    const hours = operatingHours.find(oh => oh.dayOfWeek === dayOfWeek);
    
    if (!hours?.isOpen || !hours.openTime || !hours.closeTime) {
      return { possible: [], available: [] };
    }

    const [openH, openM] = hours.openTime.split(':').map(Number);
    const [closeH, closeM] = hours.closeTime.split(':').map(Number);
    
    const start = setMinutes(setHours(date, openH), openM);
    const end = setMinutes(setHours(date, closeH), closeM);
    
    const possibleTimes: string[] = [];
    for (let time = start; time < end; time = addMinutes(time, 30)) {
      possibleTimes.push(format(time, 'HH:mm'));
    }

    const bookedSlots = reservations
      .filter(r => format(parseISO(r.startDateHour.toISOString()), 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd'))
      .flatMap(r => {
        const start = parseISO(r.startDateHour.toISOString());
        const end = parseISO(r.endDateHour.toISOString());
        const duration = differenceInMinutes(end, start);
        return Array.from({ length: duration / 30 }, (_, i) => 
          format(addMinutes(start, i * 30), 'HH:mm')
        );
      });

    const availableTimes = possibleTimes.filter(t => {
      const slotIndex = possibleTimes.indexOf(t);
      const requiredSlots = minimumHours * 2; // 30-minute intervals
      return possibleTimes
        .slice(slotIndex, slotIndex + requiredSlots)
        .every(st => !bookedSlots.includes(st));
    });

    return { possible: possibleTimes, available: availableTimes };
  };

  useEffect(() => {
    const fetchAvailability = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await axios.get(`/api/spaces/${spaceId}/availability`, {
          params: { date: format(selectedDate, 'yyyy-MM-dd') }
        });
        
        const slots = generateSlots(response.data.operatingHours, response.data.reservations, selectedDate);
        setAvailability({
          possibleTimes: slots.possible,
          availableTimes: slots.available
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load availability');
      } finally {
        setLoading(false);
      }
    };

    if (selectedDate) {
      fetchAvailability();
    }
  }, [spaceId, selectedDate, minimumHours]);

  return { loading, error, availability };
}