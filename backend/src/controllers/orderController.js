import { z } from 'zod';
import { prisma } from '../db.js';
import { serializeOrder } from '../utils/serialize.js';

const orderSchema = z.object({
  items: z.array(z.object({
    productId: z.string().min(1),
    quantity: z.coerce.number().int().min(1).max(20),
  })).min(1).max(50),
  shippingAddress: z.object({
    fullName: z.string().trim().min(2).max(80),
    line1: z.string().trim().min(4).max(120),
    city: z.string().trim().min(2).max(60),
    state: z.string().trim().min(2).max(60),
    postalCode: z.string().trim().min(4).max(12),
    country: z.string().trim().min(2).max(60).default('India'),
    phone: z.string().trim().min(8).max(20),
  }),
  paymentMethod: z.enum(['COD', 'UPI_DEMO', 'CARD_DEMO']),
});

function makeOrderNumber() {
  const stamp = new Date().toISOString().slice(0, 10).replaceAll('-', '');
  return `NM-${stamp}-${Math.random().toString(36).slice(2, 7).toUpperCase()}`;
}

export async function createOrder(req, res, next) {
  try {
    const input = orderSchema.parse(req.body);
    const uniqueIds = [...new Set(input.items.map((item) => item.productId))];
    const products = await prisma.product.findMany({ where: { id: { in: uniqueIds }, active: true } });
    const byId = new Map(products.map((product) => [product.id, product]));

    let subtotal = 0;
    const orderItems = [];

    for (const item of input.items) {
      const product = byId.get(item.productId);
      if (!product) return res.status(400).json({ message: 'One of the selected products is no longer available.' });
      if (product.stock < item.quantity) {
        return res.status(400).json({ message: `${product.name} only has ${product.stock} item(s) left.` });
      }
      const lineTotal = Number(product.price) * item.quantity;
      subtotal += lineTotal;
      orderItems.push({ productId: product.id, quantity: item.quantity, price: product.price });
    }

    const shipping = subtotal >= 50 ? 0 : 5.99;
    const tax = Number((subtotal * 0.08).toFixed(2));
    const total = Number((subtotal + shipping + tax).toFixed(2));

    const order = await prisma.$transaction(async (tx) => {
      for (const item of input.items) {
        const changed = await tx.product.updateMany({
          where: { id: item.productId, active: true, stock: { gte: item.quantity } },
          data: { stock: { decrement: item.quantity } },
        });
        if (changed.count !== 1) {
          throw Object.assign(new Error('Inventory changed while you were checking out. Please review your bag and try again.'), { statusCode: 409 });
        }
      }

      return tx.order.create({
        data: {
          orderNumber: makeOrderNumber(),
          userId: req.user.id,
          subtotal,
          shipping,
          tax,
          total,
          paymentMethod: input.paymentMethod,
          paymentStatus: input.paymentMethod === 'COD' ? 'PENDING' : 'DEMO_SUCCESS',
          status: 'PLACED',
          shippingAddress: input.shippingAddress,
          items: { create: orderItems },
        },
        include: { items: { include: { product: true } } },
      });
    });

    return res.status(201).json({ order: serializeOrder(order) });
  } catch (error) {
    return next(error);
  }
}

export async function listMyOrders(req, res, next) {
  try {
    const orders = await prisma.order.findMany({
      where: { userId: req.user.id },
      orderBy: { createdAt: 'desc' },
      include: { items: { include: { product: true } } },
    });
    return res.json({ orders: orders.map(serializeOrder) });
  } catch (error) {
    return next(error);
  }
}

export async function getOrder(req, res, next) {
  try {
    const order = await prisma.order.findFirst({
      where: { orderNumber: req.params.orderNumber, ...(req.user.role === 'ADMIN' ? {} : { userId: req.user.id }) },
      include: { items: { include: { product: true } } },
    });
    if (!order) return res.status(404).json({ message: 'Order not found.' });
    return res.json({ order: serializeOrder(order) });
  } catch (error) {
    return next(error);
  }
}

export async function listAllOrders(req, res, next) {
  try {
    const orders = await prisma.order.findMany({
      orderBy: { createdAt: 'desc' },
      include: { user: { select: { id: true, name: true, email: true } }, items: { include: { product: true } } },
    });
    return res.json({ orders: orders.map(serializeOrder) });
  } catch (error) {
    return next(error);
  }
}

export async function updateOrderStatus(req, res, next) {
  try {
    const input = z.object({ status: z.enum(['PLACED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED']) }).parse(req.body);
    const order = await prisma.order.update({
      where: { id: req.params.id },
      data: { status: input.status },
      include: { items: { include: { product: true } } },
    });
    return res.json({ order: serializeOrder(order) });
  } catch (error) {
    return next(error);
  }
}
