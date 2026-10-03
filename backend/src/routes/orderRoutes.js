import { Router } from 'express';
import { createOrder, getOrder, listAllOrders, listMyOrders, updateOrderStatus } from '../controllers/orderController.js';
import { requireAdmin, requireAuth } from '../middleware/auth.js';

const router = Router();
router.use(requireAuth);
router.post('/', createOrder);
router.get('/mine', listMyOrders);
router.get('/:orderNumber', getOrder);
router.get('/admin/all', requireAdmin, listAllOrders);
router.patch('/admin/:id/status', requireAdmin, updateOrderStatus);
export default router;
