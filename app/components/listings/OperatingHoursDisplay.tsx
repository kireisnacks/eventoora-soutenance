'use client';

import { OperatingHours } from '@prisma/client';
import { Clock } from 'lucide-react';


interface OperatingHoursDisplayProps {
  hours: OperatingHours[];
}

const daysOrder = [
  'Lundi', 'Mardi', 'Mercredi', 'Jeudi',
  'Vendredi', 'Samedi', 'Dimanche'
];

const OperatingHoursDisplay: React.FC<OperatingHoursDisplayProps> = ({ hours }) => {
  const groupedHours = hours.reduce((acc, hour) => {
    const existing = acc.find(h => h.dayOfWeek === hour.dayOfWeek);
    if (existing) {
      existing.timeSlots.push(hour);
    } else {
      acc.push({ ...hour, timeSlots: [hour] });
    }
    return acc;
  }, [] as (OperatingHours & { timeSlots: OperatingHours[] })[]);

  const getDayDisplay = (day: typeof groupedHours[number]) => {
    if (!day.timeSlots.some(slot => slot.isOpen)) return [<span key="closed" className="text-right block">Fermé</span>];
    
    return day.timeSlots
      .filter(slot => slot.isOpen)
      .map((slot, index) => {
        if (slot.openTime === '00:00' && slot.closeTime === '23:59') {
          return <div key={index} className="text-right">24h/24</div>;
        }
        return (
          <div key={index} className="text-right">
            {slot.openTime} - {slot.closeTime}
          </div>
        );
      });
  };

  return (
    <div className="w-full p-2">
      <div className="">
        {daysOrder.map(dayName => {
          const dayData = groupedHours.find(h => h.dayOfWeek === dayName);
          const displayContent = dayData ? getDayDisplay(dayData) : [<span key="closed">Fermé</span>];

          return (
            <div key={dayName} className="flex justify-between items-start gap-4">
              <span className="font-medium w-1/3 shrink-0">{dayName}</span>
              <div className="flex-1">
                {displayContent}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default OperatingHoursDisplay;