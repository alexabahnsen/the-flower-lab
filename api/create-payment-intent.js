// Vercel Serverless Function — Stripe PaymentIntent creator
// Usado por el checkout custom (checkout.html) con Stripe Elements.
// Recibe los items + datos de envío y crea un PaymentIntent con metadata.

import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2024-06-20',
});

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const {
      items = [],
      shipping_amount = 0,
      currency = 'mxn',
      customer_email = '',
      customer_name = '',
      customer_phone = '',
      sender_name = '',
      recipient_name = '',
      recipient_phone = '',
      card_message = '',
      shipping_address = {},
      delivery_date = '',
      delivery_time = '',
      special_instructions = '',
    } = req.body || {};

    if (!items.length) return res.status(400).json({ error: 'Cart is empty' });

    let subtotal = 0;
    items.forEach((i) => {
      const unit_amount = parseInt(i.unit_amount, 10);
      const quantity = parseInt(i.quantity, 10) || 1;
      if (!Number.isFinite(unit_amount) || unit_amount <= 0) {
        throw new Error('Invalid item');
      }
      subtotal += unit_amount * quantity;
    });
    const ship = parseInt(shipping_amount, 10) || 0;
    const amount = subtotal + ship;

    if (amount < 1000) {
      return res.status(400).json({ error: 'Monto demasiado bajo' });
    }

    const item_descriptions = items
      .map((i) => `${i.quantity}x ${i.name}`)
      .join(' | ')
      .slice(0, 500);

    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency,
      automatic_payment_methods: { enabled: true },
      receipt_email: customer_email || undefined,
      description: item_descriptions,
      shipping: shipping_address && shipping_address.line1 ? {
        name: recipient_name || customer_name || 'Destinatario',
        phone: recipient_phone || customer_phone || undefined,
        address: {
          line1: String(shipping_address.line1 || '').slice(0, 250),
          line2: String(shipping_address.line2 || '').slice(0, 250) || undefined,
          city: String(shipping_address.city || '').slice(0, 100),
          state: String(shipping_address.state || '').slice(0, 100),
          postal_code: String(shipping_address.postal_code || '').slice(0, 20),
          country: 'MX',
        },
      } : undefined,
      metadata: {
        items: item_descriptions,
        customer_name: customer_name.slice(0, 250),
        customer_phone: customer_phone.slice(0, 50),
        sender_name: (sender_name || 'Anónimo').slice(0, 250),
        recipient_name: recipient_name.slice(0, 250),
        recipient_phone: (recipient_phone || '').slice(0, 50),
        card_message: card_message.slice(0, 500),
        delivery_date: delivery_date.slice(0, 50),
        delivery_time: delivery_time.slice(0, 50),
        special_instructions: special_instructions.slice(0, 500),
        subtotal_mxn: (subtotal / 100).toFixed(2),
        shipping_mxn: (ship / 100).toFixed(2),
        total_mxn: (amount / 100).toFixed(2),
      },
    });

    return res.status(200).json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
      amount,
    });
  } catch (err) {
    console.error('Stripe error:', err);
    return res.status(500).json({ error: err.message || 'Internal error' });
  }
}
