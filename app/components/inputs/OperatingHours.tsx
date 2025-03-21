'use client';

import Toggle from './Toggle';

type DayOfWeek = 'Lundi' | 'Mardi' | 'Mercredi' | 'Jeudi' | 'Vendredi' | 'Samedi' | 'Dimanche';

interface OperatingHour {
  dayOfWeek: DayOfWeek;
  isOpen: boolean;
  openTime: string | null;
  closeTime: string | null;
}

interface Props {
  value: OperatingHour[];
  onChange: (hours: OperatingHour[]) => void;
}

const DAYS_CONFIG = [
    { key: 'Lundi' as DayOfWeek, label: 'Lundi' },
    { key: 'Mardi' as DayOfWeek, label: 'Mardi' },
    { key: 'Mercredi' as DayOfWeek, label: 'Mercredi' },
    { key: 'Jeudi' as DayOfWeek, label: 'Jeudi' },
    { key: 'Vendredi' as DayOfWeek, label: 'Vendredi' },
    { key: 'Samedi' as DayOfWeek, label: 'Samedi' },
    { key: 'Dimanche' as DayOfWeek, label: 'Dimanche' },
  ];

export default function OperatingHours({ value, onChange }: Props) {
  const handleTimeChange = (dayOfWeek: DayOfWeek, slotIndex: number, field: 'openTime' | 'closeTime', newValue: string) => {
    const newHours = [...value];
    const daySlots = newHours.filter(h => h.dayOfWeek === dayOfWeek);
    const slot = daySlots[slotIndex];
    
    if (slot) {
      const globalIndex = newHours.findIndex(h => h === slot);
      newHours[globalIndex] = { ...slot, [field]: newValue };
      onChange(newHours);
    }
  };

  const handleToggle = (dayOfWeek: DayOfWeek) => {
    const newHours = value.map(hour =>
      hour.dayOfWeek === dayOfWeek ? { ...hour, isOpen: !hour.isOpen } : hour
    );
    onChange(newHours);
  };

  const addTimeSlot = (dayOfWeek: DayOfWeek) => {
    const newHours = [...value];
    const newSlot: OperatingHour = {
      dayOfWeek: dayOfWeek,
      isOpen: true,
      openTime: '09:00',
      closeTime: '17:00'
    };
    newHours.push(newSlot);
    onChange(newHours);
  };

  const removeTimeSlot = (dayOfWeek: DayOfWeek, slotIndex: number) => {
    const newHours = [...value];
    const daySlots = newHours.filter(h => h.dayOfWeek === dayOfWeek);
    const slot = daySlots[slotIndex];
    
    if (slot) {
      const globalIndex = newHours.findIndex(h => h === slot);
      newHours.splice(globalIndex, 1);
      onChange(newHours);
    }
  };

  return (
    <div className="space-y-4 md:space-y-6">
      {DAYS_CONFIG.map(({ key, label }) => {
        const daySlots = value.filter(h => h.dayOfWeek === key);
        const firstSlot = daySlots[0] || {
          dayOfWeek: key,
          isOpen: true,
          openTime: '09:00',
          closeTime: '17:00'
        };

        return (
          <div
            key={key}
            className={`
              border 
              rounded-lg 
              p-3 
              md:p-4 
              transition-colors 
              duration-200
              ${!firstSlot.isOpen ? 'bg-red-50 border-red-200' : 'bg-white border-neutral-200'}
            `}
          >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3 md:mb-4">
              <span className={`
                font-medium 
                text-base 
                md:text-lg 
                mb-2 
                sm:mb-0
                ${!firstSlot.isOpen ? 'text-red-500' : 'text-neutral-900'}
              `}>
                {label}
              </span>
              <label className="flex items-center space-x-2">
                <Toggle
                  checked={firstSlot.isOpen}
                  onChange={() => handleToggle(key)}
                />
                <span className={`
                  text-sm 
                  md:text-base
                  ${!firstSlot.isOpen ? 'text-red-500' : 'text-neutral-700'}
                `}>
                  {firstSlot.isOpen ? 'Ouvert' : 'Fermé'}
                </span>
              </label>
            </div>
            {daySlots.map((slot, index) => (
              <div key={index} className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4 mb-2">
                <div className="flex items-center space-x-2 sm:space-x-4">
                  <input
                    type="time"
                    value={slot.openTime || ''}
                    onChange={(e) => handleTimeChange(key, index, 'openTime', e.target.value)}
                    className="border rounded p-1 md:p-2 w-full sm:w-auto text-sm md:text-base focus:ring-2 focus:ring-blue-500"
                    disabled={!slot.isOpen}
                    aria-label={`${key} opening time ${index + 1}`}
                  />
                  <span className="text-sm md:text-base">à</span>
                  <input
                    type="time"
                    value={slot.closeTime || ''}
                    onChange={(e) => handleTimeChange(key, index, 'closeTime', e.target.value)}
                    className="border rounded p-1 md:p-2 w-full sm:w-auto text-sm md:text-base focus:ring-2 focus:ring-blue-500"
                    disabled={!slot.isOpen}
                    aria-label={`${key} closing time ${index + 1}`}
                  />
                </div>
                {daySlots.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeTimeSlot(key, index)}
                    className="text-red-500 hover:text-red-700 text-sm md:text-base"
                  >
                    Supprimer
                  </button>
                )}
              </div>
            ))}
            {firstSlot.isOpen && (
              <button
                type="button"
                onClick={() => addTimeSlot(key)}
                className="mt-2 text-blue-500 hover:text-blue-700 text-sm md:text-base"
              >
                + Ajouter un créneau
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
}
