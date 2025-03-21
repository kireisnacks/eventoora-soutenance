import prisma from '@/app/lib/prismadb';
import { CancellationPolicyKey } from '@/app/types';

interface IParams {
    spaceId?: string;
    userId?: string;
    authorId?: string;
}

export default async function getReservations(params: IParams) {
    try {
        const { spaceId, userId, authorId } = params;

        const query: any = {};

        if (spaceId) {
            query.spaceId = spaceId;
        }

        if (userId) {
            query.userId = userId;
        }

        if (authorId) {
            query.space = { userId: authorId };
        }

        const reservations = await prisma.reservation.findMany({
            where: query,
            include: {
                space: {
                    include: {
                        operatingHours: true, // Include operatingHours for the space
                    },
                },
            },
            orderBy: {
                createdAt: 'desc',
            },
        });

        const safeReservations = reservations.map((reservation) => {
            // Validate or cast cancellationPolicy
            const validPolicies: CancellationPolicyKey[] = [
                "veryFlexible",
                "flexible",
                "standard30",
                "standard90",
            ];
            const cancellationPolicy = validPolicies.includes(
                reservation.space.cancellationPolicy as CancellationPolicyKey
            )
                ? (reservation.space.cancellationPolicy as CancellationPolicyKey)
                : "flexible"; // Fallback to "flexible" if invalid

            return {
                ...reservation,
                createdAt: reservation.createdAt.toISOString(),
                startDateHour: reservation.startDateHour.toISOString(),
                endDateHour: reservation.endDateHour.toISOString(),
                space: {
                    ...reservation.space,
                    createdAt: reservation.space.createdAt.toISOString(),
                    operatingHours: reservation.space.operatingHours,
                    cancellationPolicy, // Ensure proper typing
                },
            };
        });

        return safeReservations;
    } catch (error: any) {
        throw new Error(error);
    }
}