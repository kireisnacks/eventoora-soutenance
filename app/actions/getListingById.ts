import prisma from "@/app/lib/prismadb";
import { CancellationPolicyKey } from "@/app/types";

interface IParams {
    spaceId?: string;
}

export default async function getListingById (
    params: IParams
) {
    try {
        const { spaceId } = params;

        const listing = await prisma.space.findUnique({
            where: {
                id: spaceId
            },
            include: {
                user: true,
                operatingHours: true,
            }
        });

        if(!listing) {
            return null;
        }

        const cancellationPolicy = listing.cancellationPolicy as CancellationPolicyKey;

        return {
            ...listing,
            createdAt: listing.createdAt.toISOString(),
            cancellationPolicy,
            user: {
                ...listing.user,
                createdAt: listing.user.createdAt.toISOString(),
                updatedAt: listing.user.updatedAt.toISOString(),
                emailVerified:
                    listing.user.emailVerified?.toISOString() || null,
            }
        }
    } catch (error: any) {
        throw new Error(error);
    }
}