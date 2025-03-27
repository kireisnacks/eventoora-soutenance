import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import prisma from '@/app/lib/prismadb';
import getCurrentUser from '@/app/actions/getCurrentUser';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2025-02-24.acacia', // Version compatible
    typescript: true,
});

export async function POST(request: Request) {
  const currentUser = await getCurrentUser();
  if (!currentUser) return NextResponse.error();

  const { spaceId, reservations } = await request.json();
  const totalAmount = reservations.reduce((sum: number, r: any) => sum + r.price, 0);

  try {
    // 1. Créer la session Stripe
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: reservations.map((res: any) => ({
        price_data: {
          currency: 'mga',
          product_data: {
            name: `Réservation ${spaceId}`,
            metadata: { spaceId }
          },
          unit_amount: res.price,
        },
        quantity: 1,
      })),
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_URL}/reservations?success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_URL}/reservations?canceled=true`,
    });

    // 2. Enregistrer en base
    await prisma.transaction.create({
      data: {
        userId: currentUser.id,
        amount: totalAmount,
        status: 'COMPLETED',
        stripeId: session.id,
        reservations: {
          create: reservations.map((r: any) => ({
            spaceId,
            startDateHour: r.startDateHour,
            endDateHour: r.endDateHour,
            totalPrice: r.price,
            status: 'CONFIRMED',
            userId: currentUser.id
          }))
        }
      }
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    return NextResponse.error();
  }
}