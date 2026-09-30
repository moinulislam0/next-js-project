"use client";

import Image from "next/image";
import { FormEvent, useEffect, useMemo, useState } from "react";

type Product = {
  id: string;
  name: string;
  category: string;
  price: number;
  description: string;
  image: string;
  label?: string;
};

type Customer = {
  name: string;
  email: string;
  address: string;
};

const categories = ["All pieces", "Desk", "Tech", "Carry", "Home"];
const formatPrice = (price: number) => `$${price.toFixed(2)}`;

export default function Storefront() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState("All pieces");
  const [query, setQuery] = useState("");
  const [cart, setCart] = useState<Record<string, number>>({});
  const [cartOpen, setCartOpen] = useState(false);
  const [notice, setNotice] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [customer, setCustomer] = useState<Customer>({
    name: "",
    email: "",
    address: "",
  });

  useEffect(() => {
    const controller = new AbortController();
    fetch("/api/products", { signal: controller.signal })
      .then(async (response) => {
        if (!response.ok) throw new Error("Could not load the collection.");
        const data = (await response.json()) as { products: Product[] };
        setProducts(data.products);
      })
      .catch((error: unknown) => {
        if (error instanceof Error && error.name !== "AbortError")
          setNotice(error.message);
      })
      .finally(() => setLoading(false));

    return () => controller.abort();
  }, []);

  const visibleProducts = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return products.filter((product) => {
      const matchesCategory =
        category === "All pieces" || product.category === category;
      const matchesQuery =
        !normalizedQuery ||
        `${product.name} ${product.category} ${product.description}`
          .toLowerCase()
          .includes(normalizedQuery);
      return matchesCategory && matchesQuery;
    });
  }, [category, products, query]);

  const cartItems = useMemo(
    () =>
      products.flatMap((product) =>
        cart[product.id] ? [{ product, quantity: cart[product.id] }] : [],
      ),
    [cart, products],
  );
  const itemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0,
  );

  function changeQuantity(productId: string, amount: number) {
    setCart((current) => {
      const next = { ...current };
      const quantity = (next[productId] ?? 0) + amount;
      if (quantity <= 0) delete next[productId];
      else next[productId] = Math.min(quantity, 20);
      return next;
    });
  }

  async function submitOrder(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setNotice("");

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer,
          items: cartItems.map(({ product, quantity }) => ({
            productId: product.id,
            quantity,
          })),
        }),
      });
      const result = (await response.json()) as {
        error?: string;
        order?: { id: string };
      };
      if (!response.ok || !result.order)
        throw new Error(result.error ?? "Could not place your order.");

      setCart({});
      setCustomer({ name: "", email: "", address: "" });
      setCartOpen(false);
      setNotice(
        `Order ${result.order.id} is confirmed. This demo does not process payment.`,
      );
    } catch (error) {
      setNotice(
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main>
      <div className="announcement">
        Thoughtful goods for your everyday, shipped free over $75
      </div>
      <header className="site-header">
        <a className="wordmark" href="#top" aria-label="Northline Supply home">
          NORTHLINE<span>SUPPLY</span>
        </a>
        <nav className="main-nav" aria-label="Main navigation">
          <a href="#collection">Shop all</a>
          <a href="#story">Our approach</a>
        </nav>
        <div className="header-actions">
          <label className="search-box">
            <span className="sr-only">Search products</span>
            <span aria-hidden="true">⌕</span>
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Find something..."
            />
          </label>
          <button
            className="bag-button"
            type="button"
            onClick={() => setCartOpen(true)}
          >
            Bag <span>{itemCount}</span>
          </button>
        </div>
      </header>

      <section className="hero" id="top" aria-labelledby="hero-title">
        <Image
          className="hero-image"
          src="https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?auto=format&fit=crop&w=2200&q=90"
          alt="A calm, sunlit workspace with useful everyday objects"
          fill
          priority
          sizes="100vw"
        />
        <div className="hero-copy">
          <p className="eyebrow">GOOD THINGS, WELL MADE</p>
          <h1 id="hero-title">
            Make room for
            <br />
            the everyday.
          </h1>
          <p>
            Useful objects. Honest materials. A little more intention in the
            things you keep close.
          </p>
          <a className="button button-dark" href="#collection">
            Explore the collection <span aria-hidden="true">↘</span>
          </a>
        </div>
        <div className="hero-index">
          <span>01</span> / 03
        </div>
      </section>

      <div className="benefit-strip" aria-label="Store benefits">
        <p>
          <span>01</span> Considered materials
        </p>
        <p>
          <span>02</span> Made to be kept
        </p>
        <p>
          <span>03</span> Free shipping over $75
        </p>
      </div>

      <section className="collection-section" id="collection">
        <div className="section-heading">
          <div>
            <p className="eyebrow">THE NORTHLINE EDIT</p>
            <h2>Everyday, elevated.</h2>
          </div>
          <p className="section-note">
            A small collection of useful things
            <br />
            that earn their place.
          </p>
        </div>

        <div className="collection-toolbar">
          <div className="category-list" aria-label="Filter by category">
            {categories.map((item) => (
              <button
                className={
                  category === item
                    ? "category-button is-active"
                    : "category-button"
                }
                key={item}
                type="button"
                onClick={() => setCategory(item)}
                aria-pressed={category === item}
              >
                {item}
              </button>
            ))}
          </div>
          <span className="result-count">
            {loading ? "Loading pieces..." : `${visibleProducts.length} pieces`}
          </span>
        </div>

        {notice && !cartOpen && (
          <p className="notice-banner" role="status">
            {notice}
          </p>
        )}

        <div className="product-grid">
          {visibleProducts.map((product, index) => (
            <article className="product-card" key={product.id}>
              <div className="product-image-wrap">
                <Image
                  className="product-image"
                  src={product.image}
                  alt={product.name}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1000px) 50vw, 25vw"
                />
                {product.label && (
                  <span className="product-label">{product.label}</span>
                )}
                <button
                  className="quick-add"
                  type="button"
                  onClick={() => changeQuantity(product.id, 1)}
                  aria-label={`Add ${product.name} to bag`}
                >
                  Add to bag <span aria-hidden="true">+</span>
                </button>
              </div>
              <div className="product-info">
                <div>
                  <p className="product-category">{product.category}</p>
                  <h3>{product.name}</h3>
                  <p className="product-description">{product.description}</p>
                </div>
                <span className="product-price">
                  {formatPrice(product.price)}
                </span>
              </div>
              <span className="product-number">0{index + 1}</span>
            </article>
          ))}
          {!loading && visibleProducts.length === 0 && (
            <p className="empty-results">
              No pieces match that search. Try another word or category.
            </p>
          )}
        </div>
      </section>

      <section className="story-section" id="story">
        <div className="story-mark" aria-hidden="true">
          N.
        </div>
        <div>
          <p className="eyebrow">LESS, BUT BETTER</p>
          <h2>
            Keep what
            <br />
            works beautifully.
          </h2>
        </div>
        <p className="story-copy">
          We look for the useful details: a comfortable weight, a finish that
          wears in, a shape that feels right in your hand. The best everyday
          things do not ask for attention. They simply make the day work a
          little better.
        </p>
        <a className="text-link" href="#collection">
          Find your everyday pieces <span aria-hidden="true">↗</span>
        </a>
      </section>

      <footer className="site-footer">
        <a className="wordmark footer-wordmark" href="#top">
          NORTHLINE<span>SUPPLY</span>
        </a>
        <p>Good things, for the long run.</p>
        <span>© 2026 Northline Supply</span>
      </footer>

      {cartOpen && (
        <div className="drawer-backdrop" onClick={() => setCartOpen(false)}>
          <aside
            className="cart-drawer"
            aria-label="Shopping bag"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="drawer-header">
              <div>
                <p className="eyebrow">YOUR SELECTION</p>
                <h2>
                  Your bag <span>({itemCount})</span>
                </h2>
              </div>
              <button
                className="close-button"
                type="button"
                onClick={() => setCartOpen(false)}
                aria-label="Close bag"
              >
                ×
              </button>
            </div>

            {notice && (
              <p className="notice-banner" role="status">
                {notice}
              </p>
            )}

            {cartItems.length === 0 ? (
              <div className="empty-cart">
                <p>Your bag is taking a quiet moment.</p>
                <button
                  className="text-link"
                  onClick={() => setCartOpen(false)}
                  type="button"
                >
                  Continue exploring <span aria-hidden="true">↗</span>
                </button>
              </div>
            ) : (
              <>
                <div className="cart-lines">
                  {cartItems.map(({ product, quantity }) => (
                    <div className="cart-line" key={product.id}>
                      <div className="cart-thumb">
                        <Image src={product.image} alt="" fill sizes="80px" />
                      </div>
                      <div className="cart-line-copy">
                        <h3>{product.name}</h3>
                        <p>{formatPrice(product.price)}</p>
                        <div className="quantity-control">
                          <button
                            type="button"
                            onClick={() => changeQuantity(product.id, -1)}
                            aria-label={`Remove one ${product.name}`}
                          >
                            −
                          </button>
                          <span>{quantity}</span>
                          <button
                            type="button"
                            onClick={() => changeQuantity(product.id, 1)}
                            aria-label={`Add one ${product.name}`}
                          >
                            +
                          </button>
                        </div>
                      </div>
                      <strong>{formatPrice(product.price * quantity)}</strong>
                    </div>
                  ))}
                </div>
                <div className="checkout-area">
                  <div className="subtotal-line">
                    <span>Subtotal</span>
                    <strong>{formatPrice(subtotal)}</strong>
                  </div>
                  <p className="shipping-note">
                    Shipping and taxes are calculated at checkout.
                  </p>
                  <form className="checkout-form" onSubmit={submitOrder}>
                    <label>
                      Name
                      <input
                        required
                        autoComplete="name"
                        value={customer.name}
                        onChange={(event) =>
                          setCustomer({ ...customer, name: event.target.value })
                        }
                      />
                    </label>
                    <label>
                      Email
                      <input
                        required
                        type="email"
                        autoComplete="email"
                        value={customer.email}
                        onChange={(event) =>
                          setCustomer({
                            ...customer,
                            email: event.target.value,
                          })
                        }
                      />
                    </label>
                    <label>
                      Delivery address
                      <textarea
                        required
                        autoComplete="street-address"
                        rows={2}
                        value={customer.address}
                        onChange={(event) =>
                          setCustomer({
                            ...customer,
                            address: event.target.value,
                          })
                        }
                      />
                    </label>
                    <button
                      className="button button-dark checkout-button"
                      type="submit"
                      disabled={submitting}
                    >
                      {submitting ? "Placing order..." : "Place demo order"}
                    </button>
                    <p className="demo-note">
                      Demo checkout only. No payment is collected.
                    </p>
                  </form>
                </div>
              </>
            )}
          </aside>
        </div>
      )}
    </main>
  );
}
