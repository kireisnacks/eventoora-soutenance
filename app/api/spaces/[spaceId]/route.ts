import { NextResponse } from "next/server";

import getCurrentUser from "@/app/actions/getCurrentUser";
import prisma from "@/app/lib/prismadb";

interface IParams {
    spaceId? : string;
}

export async function DELETE (
    request: Request,
    { params } : { params: IParams } 
) {
    const currentUser = await getCurrentUser();

    if(!currentUser) {
        return NextResponse.error();
    }

    const { spaceId } = params;

    if(!spaceId || typeof spaceId !== 'string') {
        throw new Error('ID Invalide');
    }

    const listing = await prisma.space.deleteMany({
        where: {
            id: spaceId,
            userId: currentUser.id
        }
    });

    return NextResponse.json(listing);
}