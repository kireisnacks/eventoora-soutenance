import { NextResponse } from "next/server";
import prisma from "@/app/lib/prismadb";
import getCurrentUser from "@/app/actions/getCurrentUser";

export async function PATCH(request: Request) {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
        return NextResponse.error();
    }

    const body = await request.json();

    // Filter out undefined or null values from the request body
    const updates = Object.fromEntries(
        Object.entries(body).filter(([_, value]) => value !== undefined && value !== null && value !=='')
    );

    if (updates.dateOfBirth) {
        if (typeof updates.dateOfBirth === "string" || typeof updates.dateOfBirth === "number") {
            const date = new Date(updates.dateOfBirth);
            if (!isNaN(date.getTime())) {
                updates.dateOfBirth = date;
            } else {
                return NextResponse.json(
                    { error: "Invalid date format for dateOfBirth." },
                    { status: 400 }
                );
            }
        } else {
            return NextResponse.json(
                { error: "Invalid type for dateOfBirth. Must be a string or number." },
                { status: 400 }
            );
        }
    }

    if (Object.keys(updates).length === 0) {
        return NextResponse.json(
            { error: "No valid fields provided for update." },
            { status: 400 }
        );
    }

    try {
        const updatedUser = await prisma.user.update({
            where: {
                id: currentUser.id,
            },
            data: updates, // Dynamically update only the provided fields
        });

        return NextResponse.json(updatedUser);
    } catch (error) {
        return NextResponse.json(
            { error: "Failed to update user." },
            { status: 500 }
        );
    }
}