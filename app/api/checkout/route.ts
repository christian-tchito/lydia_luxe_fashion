import { NextResponse } from "next/server";
import Stripe from "stripe";

export async function POST(req: Request) {
    try {
        const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

        if (!stripeSecretKey) {
            return NextResponse.json(
                { error: "Stripe secret key is missing." },
                { status: 500 }
            );
        }

        const stripe = new Stripe(stripeSecretKey);

        const { cart } = await req.json();

        const siteUrl =
            process.env.NEXT_PUBLIC_SITE_URL || "https://lydialuxfashion.com";

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            mode: "payment",
            line_items: cart.map((item: any) => ({
                price_data: {
                    currency: "usd",
                    product_data: {
                        name: item.name,
                    },
                    unit_amount: Math.round(item.price * 100),
                },
                quantity: item.quantity,
            })),
            success_url: `${siteUrl}/order-success`,
            cancel_url: `${siteUrl}/checkout`,
        });

        return NextResponse.json({ url: session.url });
    } catch (error: any) {
        return NextResponse.json(
            { error: error.message || "Checkout failed." },
            { status: 500 }
        );
    }
}