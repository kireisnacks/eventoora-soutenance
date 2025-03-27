import { NextResponse } from "next/server";

import getCurrentUser from "@/app/actions/getCurrentUser";
import prisma from "@/app/lib/prismadb";

interface IParams {
    reservationId?: string;
};

export async function DELETE(
    request: Request,
    { params }: { params: IParams }
) {
    const currentUser = await getCurrentUser();

    if(!currentUser) {
        return NextResponse.error();
    }

    const {reservationId} = await params;

    if(!reservationId || typeof reservationId !== 'string'){
        throw new Error('Invalid ID');
    }

    const reservation = await prisma.reservation.deleteMany({
        where:{
            id: reservationId,
            OR : [
                {userId: currentUser.id},
                {space: { userId: currentUser.id}}
            ]
        }
    });

    return NextResponse.json(reservation);
}

export async function PATCH(
    request: Request,
    { params }: { params: IParams }
) {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
        return NextResponse.error();
    }

    const { reservationId } = params;

    if (!reservationId || typeof reservationId !== "string") {
        throw new Error("Invalid ID");
    }

    const body = await request.json();
    const { status } = body;

    if (!status) {
        return NextResponse.json(
            { error: "Status is required" },
            { status: 400 }
        );
    }

    const updatedReservation = await prisma.reservation.update({
        where: {
            id: reservationId,
        },
        data: {
            status,
        },
    });

    return NextResponse.json(updatedReservation);
}