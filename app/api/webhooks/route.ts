import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import prisma from '@/app/lib/prismadb';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2025-02-24.acacia', // Version compatible
    typescript: true,
});

export async function POST(req: Request) {
  const sig = req.headers.get('stripe-signature')!;
  const body = await req.text();

  try {
    const event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );

    // Handle payment success
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;
      
      // Update transaction and reservations
      await prisma.$transaction([
        prisma.transaction.update({
          where: { stripeId: session.id },
          data: { status: 'COMPLETED' },
        }),
        prisma.reservation.updateMany({
          where: { transaction: { stripeId: session.id } },
          data: { status: 'CONFIRMED' },
        }),
      ]);
    }

    console.log("✅ Webhook received:", event.id);
    return NextResponse.json({ received: true });

  } catch (err: any) {
    console.error(`❌ Webhook Error: ${err.message}`);
    return NextResponse.json(
      { error: `Webhook Error: ${err.message}` },
      { status: 400 }
    );
  }
}

export const config = {
  api: {
    bodyParser: false, // Required for raw body verification
  },
};