import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(req) {
  try {
    const { items } = await req.json();

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: items.map(item => ({
        price_data: {
          currency: 'eur',
          product_data: {
            name: `${item.name} - ${item.size}`,
            // Usamos una imagen genérica si la tuya falla (404) para evitar que Stripe rechace la sesión
            images: [item.image.startsWith('http') ? item.image : 'https://placehold.co/400x600/000000/FFFFFF/png?text=Art+Print'],
          },
          unit_amount: Math.round(item.price * 100), // Stripe trabaja en céntimos
        },
        quantity: item.quantity || 1,
      })),
      mode: 'payment',
      // Redirige aquí tras el pago (crearemos esta página ahora)
      success_url: `${req.headers.get('origin')}/success`, 
      cancel_url: `${req.headers.get('origin')}/`,
    });

    // IMPORTANTE: Devolvemos la URL
    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("Error Stripe:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}