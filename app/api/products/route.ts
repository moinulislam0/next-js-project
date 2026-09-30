import { products } from "../../lib/catalog";

export async function GET(request: Request) {
  const category = new URL(request.url).searchParams.get("category");
  const result = category
    ? products.filter(
        (product) => product.category.toLowerCase() === category.toLowerCase(),
      )
    : products;

  return Response.json({ products: result });
}
