'use client';

import { SafeUser } from "@/app/types";
import { useState, useRef, useEffect } from "react";
import Avatar from "../ui/MyAvatar";
import { Separator } from "../ui/separator";
import { User, Grid2x2, AlarmClock, Cctv, Check, X } from 'lucide-react';
import Accordion from "../Accordion";
import AssetDisplay from "./AssetDisplay";
import OperatingHoursDisplay from "./OperatingHoursDisplay";
import { cn } from "@/app/lib/utils";
import { OperatingHours } from "@prisma/client";

interface ListingInfoProps {
  user: SafeUser;
  category: string;
  capacity: number;
  minimumHour: number;
  minimumAge: number;
  size: number;
  description: string;
  parkingDescription: string;
  rules: string;
  scard: boolean;
  assets: string[];
  cancellationPolicy?: {
    title: string;
    description: string;
  };
  operatingHours?: OperatingHours[];
}

const ListingInfo: React.FC<ListingInfoProps> = ({
  user,
  category,
  capacity,
  minimumHour,
  minimumAge,
  size,
  description,
  parkingDescription,
  rules,
  scard,
  assets,
  operatingHours = [],
  cancellationPolicy,
}) => {
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const [hasDescriptionOverflow, setHasDescriptionOverflow] = useState(false);
  const descriptionRef = useRef<HTMLDivElement>(null);

  const [isPolicyExpanded, setIsPolicyExpanded] = useState(false);
  const [hasPolicyOverflow, setHasPolicyOverflow] = useState(false);
  const policyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (descriptionRef.current) {
      const element = descriptionRef.current;
      const hasOverflow = element.scrollHeight > element.clientHeight;
      setHasDescriptionOverflow(hasOverflow);
    }
  }, [description]);

  useEffect(() => {
    if (policyRef.current) {
      const element = policyRef.current;
      const hasOverflow = element.scrollHeight > element.clientHeight;
      setHasPolicyOverflow(hasOverflow);
    }
  }, [cancellationPolicy?.description]);

  return (
    <div className="col-span-4 flex flex-col gap-8">
      <div className="flex flex-col gap-4">
        {/* Top Info Bar */}
        <div className="flex flex-row flex-wrap items-center gap-4 font-light text-neutral-500">
          <div className="flex items-center gap-2">
            <User size={20} />
            {capacity} personnes
          </div>
          <div className="flex items-center gap-2">
            <Grid2x2 size={20} />
            {size} m²
          </div>
          <div className="flex items-center gap-2">
            <AlarmClock size={20} />
            {minimumHour} h minimum
          </div>
          <div className="flex items-center gap-2">
            <Cctv size={22} />
            {scard ? (
              <Check className="text-green-500" size={20} />
            ) : (
              <X className="text-red-500" size={20} />
            )}
          </div>
        </div>

        <Separator />

        {/* Host Information */}
        <div className="flex items-center gap-4">
          <Avatar src={user?.image} />
          <div>
            <p className="font-semibold">Hébergé par {user?.firstName} {user?.lastName}</p>
          </div>
        </div>

        <Separator />

        {/* Description Section */}
        <div className="relative">
          <h2 className="text-xl font-semibold mb-3">Description</h2>
          <div
            ref={descriptionRef}
            className={cn(
              "text-sm font-light text-neutral-600 transition-all duration-300",
              !isDescriptionExpanded && "line-clamp-3"
            )}
          >
            {description}
          </div>
          {hasDescriptionOverflow && (
            <button
              onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
              className="text-primary text-sm mt-1 hover:underline"
            >
              {isDescriptionExpanded ? 'Voir moins' : 'Lire plus'}
            </button>
          )}
        </div>

        <Separator />

        {/* Rules Accordion */}
        {rules && (
          <Accordion title="Règlement">
            <p className="whitespace-pre-line">{rules}</p>
          </Accordion>
        )}

        {/* Parking Accordion */}
        {parkingDescription && (
          <Accordion title="Parking">
            <p className="whitespace-pre-line">{parkingDescription}</p>
          </Accordion>
        )}

        {/* Assets Display */}
        {assets?.length > 0 && (
          <>
            <Separator />
            <div className="flex flex-col gap-4">
              <h2 className="text-xl font-semibold">Inclus</h2>
              <AssetDisplay assets={assets} />
            </div>
          </>
        )}

        {/* Operating Hours */}
        {operatingHours.length > 0 && (
          <>
            <Separator />
            <div className="flex flex-col gap-4">
              <h2 className="text-xl font-semibold">Horaires d'ouverture</h2>
              <OperatingHoursDisplay hours={operatingHours} />
            </div>
          </>
        )}

        {/* Cancellation Policy */}
        {cancellationPolicy && (
          <>
            <Separator />
            <div className="relative">
              <h2 className="text-xl font-semibold mb-3">Politique de résiliation</h2>
              <h3 className="text-lg font-semibold mb-2">{cancellationPolicy.title}</h3>
              <div
                ref={policyRef}
                className={cn(
                  "text-sm text-neutral-600 transition-all duration-300",
                  !isPolicyExpanded && "line-clamp-3"
                )}
              >
                {cancellationPolicy.description}
              </div>
              {hasPolicyOverflow && (
                <button
                  onClick={() => setIsPolicyExpanded(!isPolicyExpanded)}
                  className="text-primary text-sm mt-1 hover:underline"
                >
                  {isPolicyExpanded ? 'Voir moins' : 'Lire plus'}
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ListingInfo;