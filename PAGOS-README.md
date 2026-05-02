# The Flower Lab — Setup de pagos con Stripe

Pasarela de pago white-label que acepta **tarjeta de crédito/débito** y **OXXO** (efectivo) en pesos mexicanos. La pantalla de pago muestra tu logo y branding, no el de un proveedor externo.

## Estructura

```
collection.html              ← UI del carrito (ya llama al endpoint)
success.html                 ← Pantalla post-pago exitoso
api/create-checkout-session.js  ← Backend serverless (Vercel)
package.json                 ← Dependencia: stripe
```

## Setup paso a paso

### 1. Crear cuenta de Stripe
1. Ir a https://dashboard.stripe.com/register y crear cuenta.
2. Completa el setup de tu negocio (datos fiscales, cuenta bancaria) — esto activa pagos en producción. Mientras tanto, puedes probar todo en **modo prueba**.

### 2. Personalizar la marca en Stripe Checkout
1. En el dashboard de Stripe → **Settings → Branding**.
2. Sube tu logo, color de acento (`#6E2A38` — vino) y fondo (`#EDE8DF` — crema).
3. La pantalla de pago va a respetar esos colores y mostrará tu logo arriba.

### 3. Obtener tus llaves
1. Dashboard → **Developers → API keys**.
2. Copiar la **Secret key** que empieza con `sk_test_...` (modo prueba).
3. Cuando pases a producción, vas a usar la `sk_live_...`.

### 4. Deploy en Vercel
1. Subir el proyecto a un repo de GitHub.
2. En https://vercel.com → **New Project** → importar el repo.
3. En **Environment Variables** agregar:
   - `STRIPE_SECRET_KEY` = `sk_test_...`
4. Deploy. Vercel detecta automáticamente la función en `api/`.

### 5. Probar el flujo
1. Abrir tu sitio en Vercel (ej: `https://the-flower-lab.vercel.app/collection.html?id=amor`).
2. Agregar arreglos al carrito → **Pagar ahora**.
3. Stripe Checkout abre con tu logo.
4. Usar tarjeta de prueba: `4242 4242 4242 4242` · cualquier fecha futura · CVC `123`.
5. Te redirige a `success.html` y se vacía el carrito.

### 6. Pasar a producción
1. Activa tu cuenta en Stripe (datos fiscales + bancarios verificados).
2. En Vercel cambia `STRIPE_SECRET_KEY` a tu llave `sk_live_...`.
3. Listo.

## Métodos de pago activos

En `api/create-checkout-session.js`:

```js
payment_method_types: ['card', 'oxxo'],
```

Métodos opcionales que puedes agregar después:
- `'spei'` — transferencia SPEI (requiere activación manual con Stripe MX).
- Apple Pay / Google Pay — se activan solos cuando el cliente usa un device compatible.

## Comisiones de Stripe en México (referencia)

- Tarjetas mexicanas: **3.6% + $3 MXN** por transacción.
- OXXO: **3.6% + $3 MXN** por pago en efectivo.
- Sin costos mensuales ni de setup.

(Verifica en stripe.com/mx/pricing — pueden cambiar.)

## Seguridad

- ✅ La `STRIPE_SECRET_KEY` solo vive en variables de entorno de Vercel — nunca en el frontend.
- ⚠️ El backend actualmente confía en los precios que manda el carrito. Para producción real, deberías **validar los precios contra un catálogo en el servidor** (ver comentario `TODO` en `api/create-checkout-session.js`). Si no, alguien con dev tools podría modificar los precios antes de pagar.

## Siguientes pasos sugeridos

- [ ] Validar precios server-side contra catálogo.
- [ ] Configurar webhook de Stripe (`checkout.session.completed`) para mandarte email/WhatsApp cuando entre un pedido.
- [ ] Capturar dirección de envío (`shipping_address_collection` en el código — está comentado).
- [ ] Página `cancel.html` si quieres una landing dedicada para pagos cancelados (actualmente vuelve al carrito).
