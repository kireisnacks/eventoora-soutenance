import { Space, User , Reservation ,  OperatingHours , Review } from "@prisma/client";
import { IconType } from "react-icons";
import { cancellationPolicies } from "../host/HostWindow";


export type SafeSpace = Omit<
    Space,
    "createdAt"
> & {
    createdAt: string;
    operatingHours: OperatingHours[];
    reviews : Review[];
    cancellationPolicy: CancellationPolicyKey;
};

export type Asset = Readonly<{
    name: string
    category: AssetCategory
    reactIcon: IconType
}>;
  
export type AssetCategory = 'equipment' | 'feature' | 'other';

export type CancellationPolicyKey = keyof typeof cancellationPolicies;

export type SafeReservation = Omit<
    Reservation,
    "createdAt" | "startDateHour" | "endDateHour" | "space"
> & {
    createdAt: string;
    startDateHour: string;
    endDateHour: string;
    space: SafeSpace;
    user: SafeUser;
};


// Définition d'un type 'SafeUser' basé sur le modèle 'User' de Prisma
export type SafeUser = Omit<
    User,
    "createdAt" | "updatedAt" | "emailVerified" | "dateOfBirth"
> & {
    createdAt: string; // Convertit 'createdAt' en chaîne pour être compatible avec les composants React
    updatedAt: string; // Convertit 'updatedAt' en chaîne pour être compatible avec les composants React
    emailVerified: string | null; // Convertit 'emailVerified' en chaîne pour uniformiser le format
    dateOfBirth: string | null;
};

/**
 * Intérêt du code :
 * - Compatibilité avec React : Les objets Date ne peuvent pas être passés directement des composants serveur aux composants client dans React.
 *   Convertir les dates en chaînes de caractères résout ce problème.
 * - Sécurité : Évite les risques de manipulation des objets Date.
 * - Interopérabilité : Facilite l'échange de données entre le serveur et le client.
 * - Affichage : Permet un formatage flexible des dates dans les interfaces utilisateur.
 */
