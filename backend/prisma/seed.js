import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const products = [
  {
    name: 'AeroSound Pro Headphones', slug: 'aerosound-pro-headphones', category: 'Audio',
    description: 'Flagship wireless headphones with adaptive noise cancellation, spatial audio and a studio-tuned profile.',
    price: 149, compareAtPrice: 189, stock: 18, featured: true, badge: 'Best Seller',
    imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1000&q=85'
  },
  {
    name: 'Orbit X Smartwatch', slug: 'orbit-x-smartwatch', category: 'Wearables',
    description: 'Minimal AMOLED smartwatch with fitness tracking, sleep insights and all-day battery life.',
    price: 119, compareAtPrice: 149, stock: 24, featured: true, badge: 'New',
    imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1000&q=85'
  },
  {
    name: 'Luma Mechanical Keyboard', slug: 'luma-mechanical-keyboard', category: 'Workspace',
    description: 'Compact hot-swappable mechanical keyboard with tactile switches, premium keycaps and warm backlight.',
    price: 99, compareAtPrice: 129, stock: 31, featured: true, badge: 'Editor Pick',
    imageUrl: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=1000&q=85'
  },
  {
    name: 'ArcBook Wireless Mouse', slug: 'arcbook-wireless-mouse', category: 'Workspace',
    description: 'Silent ergonomic mouse crafted for long work sessions, with precision tracking and dual-device pairing.',
    price: 54, compareAtPrice: 64, stock: 40, featured: false, badge: null,
    imageUrl: 'https://images.unsplash.com/photo-1527814050087-3793815479db?auto=format&fit=crop&w=1000&q=85'
  },
  {
    name: 'Halo Portable Speaker', slug: 'halo-portable-speaker', category: 'Audio',
    description: 'Room-filling sound in a compact waterproof body, engineered for travel and effortless listening.',
    price: 79, compareAtPrice: 99, stock: 27, featured: true, badge: 'Trending',
    imageUrl: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&w=1000&q=85'
  },
  {
    name: 'Nova Air Tablet', slug: 'nova-air-tablet', category: 'Tech',
    description: 'Lightweight high-resolution tablet for streaming, notes, browsing and creative everyday work.',
    price: 329, compareAtPrice: 379, stock: 12, featured: true, badge: 'Premium',
    imageUrl: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=1000&q=85'
  },
  {
    name: 'Flux USB-C Hub', slug: 'flux-usbc-hub', category: 'Tech',
    description: 'Seven-port USB-C expansion dock with HDMI, USB-A, SD and power delivery for hybrid setups.',
    price: 64, compareAtPrice: 79, stock: 34, featured: false, badge: null,
    imageUrl: 'https://images.unsplash.com/photo-1625842268584-8f3296236761?auto=format&fit=crop&w=1000&q=85'
  },
  {
    name: 'PixelBeam Desk Lamp', slug: 'pixelbeam-desk-lamp', category: 'Workspace',
    description: 'Architectural desk lamp with adjustable color temperature and glare-controlled task lighting.',
    price: 69, compareAtPrice: 85, stock: 21, featured: false, badge: null,
    imageUrl: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=1000&q=85'
  },
  {
    name: 'ZenCharge Wireless Stand', slug: 'zencharge-wireless-stand', category: 'Accessories',
    description: 'Elegant magnetic charging stand built to keep your phone visible, aligned and powered throughout the day.',
    price: 49, compareAtPrice: 59, stock: 37, featured: false, badge: 'Everyday',
    imageUrl: 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?auto=format&fit=crop&w=1000&q=85'
  },
  {
    name: 'Vector Everyday Backpack', slug: 'vector-everyday-backpack', category: 'Lifestyle',
    description: 'Weather-resistant everyday carry with a structured laptop sleeve, quick-access pockets and clean lines.',
    price: 89, compareAtPrice: 109, stock: 16, featured: true, badge: 'Travel Ready',
    imageUrl: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=1000&q=85'
  },
  {
    name: 'FocusCam 4K Webcam', slug: 'focuscam-4k-webcam', category: 'Workspace',
    description: '4K camera with HDR imaging, dual microphones and auto-framing for meetings and content creation.',
    price: 109, compareAtPrice: 139, stock: 15, featured: true, badge: 'Creator',
    imageUrl: 'https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?auto=format&fit=crop&w=1000&q=85'
  },
  {
    name: 'Pulse Fit Earbuds', slug: 'pulse-fit-earbuds', category: 'Audio',
    description: 'Compact true-wireless earbuds with punchy sound, clear calls and a pocket-sized charging case.',
    price: 69, compareAtPrice: 89, stock: 45, featured: false, badge: null,
    imageUrl: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=1000&q=85'
  }
];

async function main() {
  const adminPassword = await bcrypt.hash('Admin@12345', 12);
  await prisma.user.upsert({
    where: { email: 'admin@novamart.demo' },
    update: { name: 'NovaMart Admin', passwordHash: adminPassword, role: 'ADMIN' },
    create: { name: 'NovaMart Admin', email: 'admin@novamart.demo', passwordHash: adminPassword, role: 'ADMIN' },
  });

  for (const product of products) {
    await prisma.product.upsert({ where: { slug: product.slug }, update: product, create: product });
  }

  console.log(`Seeded ${products.length} products and the admin account.`);
}

main()
  .catch((error) => { console.error(error); process.exit(1); })
  .finally(async () => prisma.$disconnect());
