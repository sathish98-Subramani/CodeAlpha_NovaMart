import { z } from 'zod';
import { prisma } from '../db.js';
import { serializeProduct } from '../utils/serialize.js';

const productInput = z.object({
  name: z.string().trim().min(2).max(120),
  slug: z.string().trim().min(2).max(140),
  description: z.string().trim().min(20).max(3000),
  category: z.string().trim().min(2).max(40),
  price: z.coerce.number().positive(),
  compareAtPrice: z.coerce.number().positive().nullable().optional(),
  imageUrl: z.string().url(),
  stock: z.coerce.number().int().min(0),
  featured: z.boolean().optional(),
  badge: z.string().trim().max(30).nullable().optional(),
});

export async function listProducts(req, res, next) {
  try {
    const { q, category, featured, sort = 'featured' } = req.query;
    const where = {
      active: true,
      ...(category && category !== 'All' ? { category } : {}),
      ...(featured === 'true' ? { featured: true } : {}),
      ...(q ? { OR: [
        { name: { contains: q, mode: 'insensitive' } },
        { description: { contains: q, mode: 'insensitive' } },
        { category: { contains: q, mode: 'insensitive' } },
      ] } : {}),
    };

    let orderBy = { featured: 'desc' };
    if (sort === 'price_asc') orderBy = { price: 'asc' };
    if (sort === 'price_desc') orderBy = { price: 'desc' };
    if (sort === 'newest') orderBy = { createdAt: 'desc' };

    const products = await prisma.product.findMany({ where, orderBy });
    return res.json({ products: products.map(serializeProduct) });
  } catch (error) {
    return next(error);
  }
}

export async function getProduct(req, res, next) {
  try {
    const product = await prisma.product.findFirst({ where: { OR: [{ id: req.params.id }, { slug: req.params.id }], active: true } });
    if (!product) return res.status(404).json({ message: 'Product not found.' });
    return res.json({ product: serializeProduct(product) });
  } catch (error) {
    return next(error);
  }
}

export async function createProduct(req, res, next) {
  try {
    const input = productInput.parse(req.body);
    const product = await prisma.product.create({ data: input });
    return res.status(201).json({ product: serializeProduct(product) });
  } catch (error) {
    return next(error);
  }
}

export async function updateProduct(req, res, next) {
  try {
    const input = productInput.partial().parse(req.body);
    const product = await prisma.product.update({ where: { id: req.params.id }, data: input });
    return res.json({ product: serializeProduct(product) });
  } catch (error) {
    return next(error);
  }
}

export async function deleteProduct(req, res, next) {
  try {
    await prisma.product.update({ where: { id: req.params.id }, data: { active: false } });
    return res.json({ message: 'Product archived.' });
  } catch (error) {
    return next(error);
  }
}
