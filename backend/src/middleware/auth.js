import { prisma } from '../db.js';
import { verifyToken } from '../utils/token.js';

export async function requireAuth(req, res, next) {
  try {
    const header = req.headers.authorization || '';
    const token = header.startsWith('Bearer ') ? header.slice(7) : null;
    if (!token) return res.status(401).json({ message: 'Authentication required.' });

    const payload = verifyToken(token);
    const user = await prisma.user.findUnique({
      where: { id: payload.sub },
      select: { id: true, name: true, email: true, role: true },
    });

    if (!user) return res.status(401).json({ message: 'Session is no longer valid.' });
    req.user = user;
    return next();
  } catch {
    return res.status(401).json({ message: 'Invalid or expired session.' });
  }
}

export function requireAdmin(req, res, next) {
  if (req.user?.role !== 'ADMIN') {
    return res.status(403).json({ message: 'Admin access required.' });
  }
  return next();
}
