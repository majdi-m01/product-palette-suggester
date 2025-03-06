
import { Product } from "@/types/product";

export const products: Product[] = [
  {
    id: "1",
    name: "Minimalist Watch",
    description: "Elegant timepiece with a clean, minimalist design and premium materials.",
    price: 199.99,
    image: "/placeholder.svg",
    category: "Accessories",
    featured: true,
    rating: 4.8
  },
  {
    id: "2",
    name: "Sleek Laptop Stand",
    description: "Ergonomic aluminum laptop stand with adjustable height settings.",
    price: 79.99,
    image: "/placeholder.svg",
    category: "Home Office",
    featured: true,
    rating: 4.7
  },
  {
    id: "3",
    name: "Bluetooth Earbuds",
    description: "Wireless earbuds with noise cancellation and 24-hour battery life.",
    price: 129.99,
    image: "/placeholder.svg",
    category: "Electronics",
    featured: true,
    rating: 4.5
  },
  {
    id: "4",
    name: "Essential Oil Diffuser",
    description: "Modern ceramic diffuser with adjustable mist settings and LED lighting.",
    price: 49.99,
    image: "/placeholder.svg",
    category: "Home",
    rating: 4.3
  },
  {
    id: "5",
    name: "Bamboo Cutting Board",
    description: "Sustainable bamboo cutting board with juice groove and non-slip feet.",
    price: 34.99,
    image: "/placeholder.svg",
    category: "Kitchen",
    rating: 4.6
  },
  {
    id: "6",
    name: "Leather Wallet",
    description: "Handcrafted genuine leather wallet with RFID protection.",
    price: 59.99,
    image: "/placeholder.svg",
    category: "Accessories",
    rating: 4.4
  },
  {
    id: "7",
    name: "Smart Plant Pot",
    description: "Self-watering pot with soil moisture monitoring and mobile app integration.",
    price: 39.99,
    image: "/placeholder.svg",
    category: "Home",
    featured: true,
    rating: 4.2
  },
  {
    id: "8",
    name: "Ceramic Coffee Mug",
    description: "Artisan mug with minimalist design and ergonomic handle.",
    price: 24.99,
    image: "/placeholder.svg",
    category: "Kitchen",
    rating: 4.5
  }
];

export const categories = Array.from(new Set(products.map(product => product.category)));

export const featuredProducts = products.filter(product => product.featured);
