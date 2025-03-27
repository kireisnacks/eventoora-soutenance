'use client';

import { useState } from 'react';
import Calendar from '@/app/components/inputs/Calendar';
import { format, addMinutes } from 'date-fns';
import { fr } from 'date-fns/locale';
import Button from '@/app/components/Button';
import { CalendarIcon, X } from 'lucide-react';
import { OperatingHours } from '@prisma/client';
import { RangeKeyDict } from 'react-date-range';

interface DateTimeEntry {
  date: Date;
  startTime: string;
  endTime: string;
}

interface ReservationFormProps {
  price: number;
  minimumHour: number;
  operatingHours: OperatingHours[];
  bookedSlots: Array<{ date: string; slots: string[] }>;
  disabledDates?: Date[];
  totalPrice: number;
  isSubmitting: boolean;
  dateTimeEntries: DateTimeEntry[];
  onAddEntry: () => void;
  onRemoveEntry: (index: number) => void;
  onDateChange: (index: number, date: Date) => void;
  onTimeChange: (index: number, type: 'start' | 'end', value: string) => void;
  onSubmit: () => void;
}

const ReservationForm: React.FC<ReservationFormProps> = ({ 
  price,
  minimumHour,
  operatingHours,
  bookedSlots,
  disabledDates,
  totalPrice,
  isSubmitting,
  dateTimeEntries,
  onAddEntry,
  onRemoveEntry,
  onDateChange,
  onTimeChange,
  onSubmit
}) => {
  const [openCalendarIndex, setOpenCalendarIndex] = useState<number | null>(null);
  const processingFee = Math.round(totalPrice * 0.08 / 1.08);

  const normalizeDayName = (date: Date) => {
    return format(date, 'EEEE', { locale: fr })
      .toLowerCase()
      .replace(/^\w/, (c) => c.toUpperCase());
  };

  const generateTimeSlots = (start: Date, end: Date) => {
    const slots: string[] = [];
    let current = new Date(start);
    
    if (end < start) end.setDate(end.getDate() + 1);
    
    while (current < end) {
      slots.push(format(current, 'HH:mm'));
      current = addMinutes(current, 30);
    }
    return slots;
  };

  const getAvailableSlots = (date: Date, currentIndex: number) => {
    const dayName = normalizeDayName(date);
    const hoursList = operatingHours
      .filter((oh): oh is OperatingHours & { openTime: string; closeTime: string } => 
        oh.dayOfWeek.toLowerCase() === dayName.toLowerCase() &&
        !!oh.openTime &&
        !!oh.closeTime
      )
      .sort((a, b) => a.openTime.localeCompare(b.openTime));

    const currentEntriesSlots = dateTimeEntries
      .filter((_, idx) => idx !== currentIndex)
      .flatMap(entry => {
        const start = new Date(`${format(entry.date, 'yyyy-MM-dd')}T${entry.startTime}`);
        const end = new Date(`${format(entry.date, 'yyyy-MM-dd')}T${entry.endTime}`);
        return generateTimeSlots(start, end);
      });

    const currentDate = format(date, 'yyyy-MM-dd');
    const bookedForDate = bookedSlots.find(s => s.date === currentDate)?.slots || [];

    const allBookedSlots = [...bookedForDate, ...currentEntriesSlots];

    const slots: string[] = [];
    
    for (const hours of hoursList) {
      const [openH, openM] = hours.openTime.split(':').map(Number);
      const [closeH, closeM] = hours.closeTime.split(':').map(Number);
      
      let current = new Date(date);
      current.setHours(openH, openM, 0);
      
      const end = new Date(date);
      end.setHours(closeH, closeM, 0);

      if (end < current) end.setDate(end.getDate() + 1);

      while (current < end) {
        const time = format(current, 'HH:mm');
        if (!allBookedSlots.includes(time)) slots.push(time);
        current = addMinutes(current, 30);
      }
    }
    
    return Array.from(new Set(slots)).sort();
  };

  const handleCalendarChange = (index: number, range: RangeKeyDict) => {
    if (range.selection?.startDate) {
      onDateChange(index, range.selection.startDate);
      setOpenCalendarIndex(null);
    }
  };

  const getTimeInterval = (date: Date, time: string) => {
    const dayName = normalizeDayName(date);
    return operatingHours.find(oh => 
      oh.dayOfWeek.toLowerCase() === dayName.toLowerCase() &&
      oh.openTime &&
      oh.closeTime &&
      time >= oh.openTime && 
      time <= oh.closeTime
    );
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-6">
      <div className="space-y-4">
        <div className="pb-4 border-b">
          <h2 className="text-3xl font-bold">{totalPrice.toLocaleString()} MGA</h2>
          <p className="text-sm text-gray-500">Total Estimé</p>
        </div>

        {dateTimeEntries.map((entry, index) => (
          <div key={index} className="border-b pb-4">
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <div className="relative">
                  <button
                    onClick={() => setOpenCalendarIndex(openCalendarIndex === index ? null : index)}
                    className="w-full flex items-center gap-2 p-3 border rounded-lg hover:bg-gray-50"
                  >
                    <CalendarIcon size={20} />
                    {format(entry.date, 'd MMM yyyy', { locale: fr })}
                  </button>

                  {openCalendarIndex === index && (
                    <div className="absolute top-12 left-0 z-10 bg-white border rounded-lg shadow-lg">
                      <Calendar
                        value={{
                          startDate: entry.date,
                          endDate: entry.date,
                          key: 'selection'
                        }}
                        onChange={(range) => handleCalendarChange(index, range)}
                        disabledDates={disabledDates}
                      />
                    </div>
                  )}
                </div>
              </div>
              {dateTimeEntries.length > 1 && (
                <button
                  onClick={() => onRemoveEntry(index)}
                  className="text-red-600 text-xs flex items-center gap-1 hover:text-red-700 ml-4 py-3"
                >
                  <X size={16} />
                </button>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm mb-2">Heure de début:</label>
                <select
                  value={entry.startTime}
                  onChange={(e) => onTimeChange(index, 'start', e.target.value)}
                  className="w-full p-2 border rounded-md"
                  disabled={isSubmitting}
                >
                  <option value="">Sélectionner heure de début</option>
                  {getAvailableSlots(entry.date, index).map(time => (
                    <option key={time} value={time}>{time}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm mb-2">Heure de fin:</label>
                <select
                  value={entry.endTime}
                  onChange={(e) => onTimeChange(index, 'end', e.target.value)}
                  className="w-full p-2 border rounded-md"
                  disabled={!entry.startTime || isSubmitting}
                >
                  <option value="">Sélectionner heure de fin</option>
                  {getAvailableSlots(entry.date, index)
                    .filter(time => {
                      if (!entry.startTime) return false;
                      
                      const startInterval = getTimeInterval(entry.date, entry.startTime);
                      const endInterval = getTimeInterval(entry.date, time);
                      
                      const startMinutes = entry.startTime.split(':')
                        .map(Number)
                        .reduce((h, m) => h * 60 + m);
                      const endMinutes = time.split(':')
                        .map(Number)
                        .reduce((h, m) => h * 60 + m);

                      return !!startInterval?.openTime &&
                             startInterval.openTime === endInterval?.openTime &&
                             (endMinutes - startMinutes >= minimumHour * 60);
                    })
                    .map(time => (
                      <option key={time} value={time}>{time}</option>
                    ))}
                </select>
              </div>
            </div>
          </div>
        ))}

        <div className="pt-4 space-y-2">
        <div className="flex justify-between text-sm text-gray-500">
            <span>Prix Horaire ({price}MGA/h)</span>
            <span>{(totalPrice - processingFee).toLocaleString()} MGA</span>
          </div>
          <div className="flex justify-between text-sm text-gray-500">
            <span>Commission (8%)</span>
            <span>{processingFee.toLocaleString()} MGA</span>
          </div>
          <div className="flex justify-between font-bold pt-2 border-t">
            <span>Total</span>
            <span>{totalPrice.toLocaleString()} MGA</span>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <button
            onClick={onAddEntry}
            className="text-sm text-blue-600 hover:underline self-start"
          >
            + Ajouter une journée
          </button>

          <Button
            label={isSubmitting ? 'Traitement...' : 'Réserver maintenant'}
            onClick={onSubmit}
            disabled={isSubmitting || dateTimeEntries.some(entry => !entry.startTime || !entry.endTime)}
          />
        </div>
      </div>
    </div>
  );
};

export default ReservationForm;