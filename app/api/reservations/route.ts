import {NextResponse} from "next/server";

import prisma from "@/app/lib/prismadb";
import getCurrentUser from "@/app/actions/getCurrentUser";

export async function POST(
    request: Request
){
    const currentUser = await getCurrentUser();

    if(!currentUser) {
        return NextResponse.error();
    }

    const body = await request.json();

    const {
        spaceId,
        startDateHour,
        endDateHour,
        totalPrice
    } = body;

    if(!spaceId ||  !startDateHour || !startDateHour || !totalPrice) {
        return NextResponse.error();
    }

    const spaceAndReservation = await prisma.space.update({
        where: {
            id: spaceId
        },
        data:{
            reservations: {
                create: {
                    userId: currentUser.id,
                    startDateHour,
                    endDateHour,
                    totalPrice 
                }
            }
        }
    });

    return NextResponse.json(spaceAndReservation);

}