import prisma from "@/app/lib/prismadb";

export default async function getListings(){
    try{
        const listings = await prisma.space.findMany({
            orderBy:{
                createdAt: 'desc'
            }
        });
    
    const safeListings = listings.map((listing) => ({
        ...listing,
        createdAt: listing.createdAt.toISOString(),
    }));

    return safeListings;

    } catch(error:any){
        throw new Error(error);
    }
}