import prisma from "@/app/lib/prismadb";

import getCurrentUser from "./getCurrentUser";
import { CancellationPolicyKey } from "@/app/types";

export default async function getFavoriteListings() {
    try {
      const currentUser = await getCurrentUser();
  
      if (!currentUser) return [];
  
      const favorites = await prisma.space.findMany({
        where: {
          id: {
            in: currentUser.favoriteIds || []
          }
        },
        include: {
          operatingHours: true,
          reviews: true
        }
      });
  
      const safeFavorites = favorites.map((favorite) => ({
        ...favorite,
        createdAt: favorite.createdAt.toISOString(),
        operatingHours: favorite.operatingHours,
        reviews: favorite.reviews,
        cancellationPolicy: favorite.cancellationPolicy as CancellationPolicyKey
      }));
  
      return safeFavorites;
    } catch (error: any) {
      throw new Error(error);
    }
  }