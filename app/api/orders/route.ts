import { products } from "../../lib/catalog";

type OrderItemInput = {
  productId: string;
  quantity: number;
};

export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return Response.json(
      { error: "Request body must be valid JSON." },
      { status: 400 },
    );
  }

  if (typeof body !== "object" || body === null) {
    return Response.json(
      { error: "Request body must be an object." },
      { status: 400 },
    );
  }

  const payload = body as { customer?: unknown; items?: unknown };
  const customer = payload.customer;

  if (typeof customer !== "object" || customer === null) {
    return Response.json(
      { error: "Customer details are required." },
      { status: 400 },
    );
  }

  const details = customer as Record<string, unknown>;
  const name = typeof details.name === "string" ? details.name.trim() : "";
  const email = typeof details.email === "string" ? details.email.trim() : "";
  const address =
    typeof details.address === "string" ? details.address.trim() : "";

  if (!name || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || !address) {
    return Response.json(
      { error: "Enter a name, valid email, and delivery address." },
      { status: 400 },
    );
  }

  if (
    !Array.isArray(payload.items) ||
    payload.items.length === 0 ||
    payload.items.length > 30
  ) {
    return Response.json(
      { error: "Add between 1 and 30 items to your order." },
      { status: 400 },
    );
  }

  const quantities = new Map<string, number>();

  for (const item of payload.items) {
    if (typeof item !== "object" || item === null) {
      return Response.json(
        { error: "Each item needs a product ID and quantity." },
        { status: 400 },
      );
    }

    const line = item as Partial<OrderItemInput>;
    if (
      typeof line.productId !== "string" ||
      !products.some((product) => product.id === line.productId) ||
      typeof line.quantity !== "number" ||
      !Number.isInteger(line.quantity) ||
      (line.quantity ?? 0) < 1 ||
      (line.quantity ?? 0) > 20
    ) {
      return Response.json(
        { error: "An item is unavailable or has an invalid quantity." },
        { status: 400 },
      );
    }

    const nextQuantity = (quantities.get(line.productId) ?? 0) + line.quantity;
    if (nextQuantity > 20) {
      return Response.json(
        { error: "Maximum quantity per product is 20." },
        { status: 400 },
      );
    }
    quantities.set(line.productId, nextQuantity);
  }

  const items = [...quantities].map(([productId, quantity]) => {
    const product = products.find((entry) => entry.id === productId)!;
    return {
      productId,
      name: product.name,
      unitPrice: product.price,
      quantity,
      lineTotal: product.price * quantity,
    };
  });

  return Response.json(
    {
      order: {
        id: crypto.randomUUID().slice(0, 8).toUpperCase(),
        customer: { name, email, address },
        items,
        total: items.reduce((sum, item) => sum + item.lineTotal, 0),
        currency: "USD",
        status: "demo-confirmed",
      },
    },
    { status: 201 },
  );
}
