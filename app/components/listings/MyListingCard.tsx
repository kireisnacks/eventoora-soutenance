'use client';

import { Review } from "@prisma/client";
import { SafeReservation, SafeUser, SafeSpace } from "@/app/types";
import { useCallback, useMemo } from "react";
import { format } from "date-fns";
import Image from "next/image";
import { AiFillStar } from 'react-icons/ai';
import { BsPeople } from 'react-icons/bs';
import Button from '../Button';

interface MyListingCardProps {
  data: SafeSpace & {
    reviews: Review[];
  };
  reservation?: SafeReservation;
  onAction?: (id: string) => void;
  disabled?: boolean;
  actionLabel?: string;
  actionId?: string;
  currentUser?: SafeUser | null;
  badgeLabel?: string;
}

const MyListingCard: React.FC<MyListingCardProps> = ({
  data,
  reservation,
  onAction,
  actionLabel,
  actionId = "",
  currentUser,
  disabled,
}) => {
  // Calculate average rating
  const averageRating = useMemo(() => {
    if (!data.reviews?.length) return null;
    const sum = data.reviews.reduce((acc, review) => acc + review.rating, 0);
    return (sum / data.reviews.length).toFixed(1);
  }, [data.reviews]);

  // Calculate price
  const price = useMemo(() => {
    if (reservation) return reservation.totalPrice;
    return data.price;
  }, [reservation, data.price]);

  // Format reservation date
  const reservationDate = useMemo(() => {
    if (!reservation) return null;
    const start = new Date(reservation.startDateHour);
    const end = new Date(reservation.endDateHour);
    return `${format(start, 'dd/MM/yyyy HH:mm')} - ${format(end, 'HH:mm')}`;
  }, [reservation]);

  // Handle cancel action
  const handleCancel = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation();
      if (disabled) return;
      onAction?.(actionId);
    },
    [onAction, actionId, disabled]
  );

  // Get reservation status
  const getStatus = useCallback(() => {
    if (!reservation) return 'Non réservé'; // Handle undefined reservation
    const now = new Date();
    if (reservation.status === 'CANCELED') return 'Annulé';
    return new Date(reservation.endDateHour) < now ? 'Terminé' : 'Réservé';
  }, [reservation]);

  // Get status style
  const statusStyle = useMemo(() => {
    const status = getStatus();
    return {
      'Annulé': 'bg-red-100 text-red-800',
      'Terminé': 'bg-green-100 text-green-800',
      'Réservé': 'bg-blue-100 text-blue-800',
      'Non réservé': 'bg-gray-100 text-gray-800',
    }[status];
  }, [getStatus]);

  return (
    <div className="col-span-1 bg-white rounded-xl shadow-sm border border-neutral-200 overflow-hidden transition hover:shadow-md">
      <div className="flex flex-col gap-4 p-4">
        {/* User Section */}
        <div className="flex items-center gap-3 pb-3 border-b">
          <div className="relative h-10 w-10 rounded-full overflow-hidden">
            <Image
              fill
              alt="User avatar"
              src={reservation?.user.image || '/images/placeholder.jpg'}
              className="object-cover"
            />
          </div>
          <div>
            <p className="font-semibold">{reservation?.user.firstName} {reservation?.user.lastName}</p>
            <p className="text-sm text-neutral-500">{reservation?.user.email}</p>
          </div>
        </div>

        {/* Reservation Details */}
        <div className="space-y-2">
          <div className="flex justify-between items-start">
            <h3 className="text-lg font-semibold">{data.title}</h3>
            <span className={`px-3 py-1 rounded-full text-sm ${statusStyle}`}>
              {getStatus()}
            </span>
          </div>

          <div className="flex items-center gap-4 text-sm">
            {averageRating && (
              <div className="flex items-center gap-1">
                <AiFillStar className="text-yellow-500" />
                <span>{averageRating}</span>
              </div>
            )}
          </div>

          <div className="text-sm text-neutral-600">
            {reservationDate || 'Aucune réservation'}
          </div>

          <div className="flex justify-between items-center pb-2">
            <div className="font-semibold">
              {price} MGA
              {!reservation && (
                <span className="font-light ml-1">par heure</span>
              )}
            </div>
          </div>
          {actionLabel && getStatus() === 'Réservé' && (
              <Button
                small
                disabled={disabled}
                label={actionLabel}
                onClick={handleCancel}
                outline
              />
            )}
        </div>
      </div>
    </div>
  );
};

export default MyListingCard;