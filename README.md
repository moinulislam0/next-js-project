# Northline Supply

A small e-commerce storefront starter built with Next.js App Router and TypeScript.

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## API

The API uses Next.js App Router Route Handlers under `app/api`.

### `GET /api/products`

Returns the product catalog. An optional category filter is supported:

```text
GET /api/products?category=Desk
```

### `POST /api/orders`

Validates customer details and product quantities, recalculates prices on the server, and returns a demo order confirmation with HTTP `201`.

```json
{
  "customer": {
    "name": "Sam Example",
    "email": "sam@example.com",
    "address": "123 Market Street"
  },
  "items": [{ "productId": "daily-notebook", "quantity": 2 }]
}
```

Example using PowerShell:

```powershell
Invoke-RestMethod -Method Get -Uri http://localhost:3000/api/products

$body = @{
  customer = @{ name = "Sam Example"; email = "sam@example.com"; address = "123 Market Street" }
  items = @(@{ productId = "daily-notebook"; quantity = 2 })
} | ConvertTo-Json -Depth 4

Invoke-RestMethod -Method Post -Uri http://localhost:3000/api/orders -ContentType "application/json" -Body $body
```

## Project structure

```text
app/
  api/
    orders/route.ts       POST order validation and demo confirmation
    products/route.ts     GET product catalog
  components/
    storefront.tsx        Search, category filters, bag, and checkout UI
  lib/
    catalog.ts            Shared demo product data
  globals.css             Responsive storefront styles
  layout.tsx              Root layout and page metadata
  page.tsx                Storefront route
```

## Demo boundaries

Products are currently kept in `app/lib/catalog.ts`. The bag lives in client-side state for the current page session. Orders are validated and returned as demo confirmations, but are not saved to a database; no payment is collected. Before taking real orders, connect a persistent database, add authentication and inventory checks, and integrate a payment provider such as Stripe.
