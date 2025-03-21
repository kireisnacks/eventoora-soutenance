import { NextResponse } from "next/server";
import getCurrentUser from "@/app/actions/getCurrentUser";
import prisma from "@/app/lib/prismadb";

export async function POST(
    request: Request,
    { params }: { params: Promise<{ spaceId: string }> }
) {
    try {
        const currentUser = await getCurrentUser();
        const { spaceId } = await params;

        if (!currentUser) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        if (!spaceId || typeof spaceId !== 'string') {
            return new NextResponse("Invalid space ID", { status: 400 });
        }

        let favoriteIds = [...(currentUser.favoriteIds || [])];
        favoriteIds.push(spaceId);

        const user = await prisma.user.update({
            where: {
                id: currentUser.id
            },
            data: {
                favoriteIds
            }
        });

        return NextResponse.json(user);
    } catch (error) {
        console.error('[FAVORITE_POST]', error);
        return new NextResponse("Internal error", { status: 500 });
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ spaceId: string }> }
) {
    try {
        const currentUser = await getCurrentUser();
        const { spaceId } = await params;

        if (!currentUser) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        if (!spaceId || typeof spaceId !== 'string') {
            return new NextResponse("Invalid space ID", { status: 400 });
        }

        let favoriteIds = [...(currentUser.favoriteIds || [])];
        favoriteIds = favoriteIds.filter((id) => id !== spaceId);

        const user = await prisma.user.update({
            where: {
                id: currentUser.id
            },
            data: {
                favoriteIds
            }
        });

        return NextResponse.json(user);
    } catch (error) {
        console.error('[FAVORITE_DELETE]', error);
        return new NextResponse("Internal error", { status: 500 });
    }
}
