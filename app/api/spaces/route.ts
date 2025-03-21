import { NextResponse } from "next/server";
import prisma from "@/app/lib/prismadb";
import getCurrentUser from "@/app/actions/getCurrentUser";

export async function POST(request: Request) {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
        return NextResponse.error();
    }

    const body = await request.json();
    const {
        title,
        description,
        thumbnail,
        category,
        size,
        city,
        address,
        postalCode,
        parkingDescription,
        rules,
        scard,
        minimumAge,
        instructions,
        cancellationPolicy,
        price,
        minimumHour,
        capacity,
        operatingHours,
        assets,
    } = body;

    Object.keys(body).forEach((value: any) => {
        if (!body[value]) {
            NextResponse.error();
        }
    });

    const space = await prisma.space.create({
        data: {
            title,
            description,
            thumbnail,
            category,
            size,
            city,
            address,
            postalCode,
            parkingDescription,
            rules,
            scard,
            minimumAge,
            instructions,
            cancellationPolicy,
            price: parseInt(price, 10),
            minimumHour: parseInt(minimumHour, 10),
            capacity,
            userId: currentUser.id,
            assets,
            operatingHours: {
                create: operatingHours.map((hour: any) => ({
                    dayOfWeek: hour.dayOfWeek,
                    isOpen: hour.isOpen,
                    openTime: hour.openTime,
                    closeTime: hour.closeTime
                }))
            },
        },
        include: {
            operatingHours: true
        }
    });

    return NextResponse.json(space);
}
