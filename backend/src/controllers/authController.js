import { z } from 'zod';
import { prisma } from '../db.js';
import { comparePassword, hashPassword } from '../utils/password.js';
import { signToken } from '../utils/token.js';

const authSchema = z.object({
  name: z.string().trim().min(2).max(60),
  email: z.string().trim().email().max(120).transform((value) => value.toLowerCase()),
  password: z.string().min(8).max(72),
});

export async function register(req, res, next) {
  try {
    const input = authSchema.parse(req.body);
    const existing = await prisma.user.findUnique({ where: { email: input.email } });
    if (existing) return res.status(409).json({ message: 'An account with that email already exists.' });

    const user = await prisma.user.create({
      data: { ...input, passwordHash: await hashPassword(input.password) },
      select: { id: true, name: true, email: true, role: true },
    });

    return res.status(201).json({ token: signToken(user), user });
  } catch (error) {
    return next(error);
  }
}

export async function login(req, res, next) {
  try {
    const input = z.object({
      email: z.string().trim().email().transform((value) => value.toLowerCase()),
      password: z.string().min(1),
    }).parse(req.body);

    const user = await prisma.user.findUnique({ where: { email: input.email } });
    if (!user || !(await comparePassword(input.password, user.passwordHash))) {
      return res.status(401).json({ message: 'Email or password is incorrect.' });
    }

    const safeUser = { id: user.id, name: user.name, email: user.email, role: user.role };
    return res.json({ token: signToken(safeUser), user: safeUser });
  } catch (error) {
    return next(error);
  }
}

export async function me(req, res) {
  return res.json({ user: req.user });
}
