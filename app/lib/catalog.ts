export type Product = {
  id: string;
  name: string;
  category: "Desk" | "Tech" | "Carry" | "Home";
  price: number;
  description: string;
  image: string;
  label?: string;
};

export const products: Product[] = [
  {
    id: "arc-desk-lamp",
    name: "Arc desk lamp",
    category: "Home",
    price: 86,
    description: "A warm pool of light, right where you need it.",
    image:
      "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=1000&q=85",
    label: "Bestseller",
  },
  {
    id: "daily-notebook",
    name: "Daily notebook set",
    category: "Desk",
    price: 28,
    description: "Three lay-flat notebooks for plans in progress.",
    image:
      "https://images.unsplash.com/photo-1531346878377-a5be20888e57?auto=format&fit=crop&w=1000&q=85",
  },
  {
    id: "studio-headphones",
    name: "Studio headphones",
    category: "Tech",
    price: 124,
    description: "Comfortable, considered sound for the long stretch.",
    image:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1000&q=85",
    label: "New",
  },
  {
    id: "everyday-tote",
    name: "Everyday canvas tote",
    category: "Carry",
    price: 42,
    description: "Room for the essentials, built for every day.",
    image:
      "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=1000&q=85",
  },
  {
    id: "stoneware-cup",
    name: "Stoneware cup",
    category: "Home",
    price: 24,
    description: "Hand-finished stoneware with a little extra room.",
    image:
      "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=1000&q=85",
  },
  {
    id: "field-camera",
    name: "Field camera",
    category: "Tech",
    price: 168,
    description: "A pocket-sized excuse to take the longer way home.",
    image:
      "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=1000&q=85",
    label: "Limited",
  },
  {
    id: "cable-organizer",
    name: "Cable keeper set",
    category: "Desk",
    price: 18,
    description: "Small details that make a workspace feel settled.",
    image:
      "https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?auto=format&fit=crop&w=1000&q=85",
  },
  {
    id: "weekender-bag",
    name: "Softside weekender",
    category: "Carry",
    price: 112,
    description: "An easy carry-on for spontaneous two-day plans.",
    image:
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=1000&q=85",
  },
];
