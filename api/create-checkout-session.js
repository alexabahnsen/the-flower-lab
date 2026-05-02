// Vercel Serverless Function — Stripe Checkout Session creator
// Deploy: push to Vercel, set env var STRIPE_SECRET_KEY in dashboard.
// In test mode use a key starting with sk_test_; in production sk_live_.

import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2024-06-20',
});

export default async function handler(req, res) {
  // CORS — útil si el front se sirve desde otro dominio en desarrollo
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { items = [], shipping_amount = 0, currency = 'mxn', success_url, cancel_url } = req.body || {};

    if (!items.length) return res.status(400).json({ error: 'Cart is empty' });
    if (!success_url || !cancel_url) return res.status(400).json({ error: 'Missing redirect URLs' });

    // Validate items shape and recompute amounts server-side for safety.
    // (En producción real, deberías VALIDAR precios contra tu catálogo —
    //  no confíes en los precios que manda el cliente.)
    const line_items = items.map((i) => {
      const unit_amount = parseInt(i.unit_amount, 10);
      const quantity = parseInt(i.quantity, 10) || 1;
      if (!i.name || !Number.isFinite(unit_amount) || unit_amount <= 0) {
        throw new Error('Invalid item: ' + JSON.stringify(i));
      }
      return {
        price_data: {
          currency,
          product_data: {
            name: String(i.name).slice(0, 250),
            description: i.description ? String(i.description).slice(0, 500) : undefined,
          },
          unit_amount,
        },
        quantity,
      };
    });

    // Envío como una línea más (Stripe lo muestra como item).
    // Alternativa: usar shipping_options con shipping_rate fijo.
    if (shipping_amount > 0) {
      line_items.push({
        price_data: {
          currency,
          product_data: { name: 'Envío' },
          unit_amount: parseInt(shipping_amount, 10),
        },
        quantity: 1,
      });
    }

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items,
      // Métodos de pago disponibles en MX:
      payment_method_types: ['card', 'oxxo'],
      // Dirección de envío opcional — descomentar si la quieres recolectar:
      // shipping_address_collection: { allowed_countries: ['MX'] },
      phone_number_collection: { enabled: true },
      locale: 'es',
      success_url,
      cancel_url,
      // Para OXXO los vouchers expiran en 3 días por default; configurable:
      payment_method_options: {
        oxxo: { expires_after_days: 3 },
      },
    });

    return res.status(200).json({ url: session.url, id: session.id });
  } catch (err) {
    console.error('Stripe error:', err);
    return res.status(500).json({ error: err.message || 'Internal error' });
  }
}
