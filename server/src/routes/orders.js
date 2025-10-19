const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');

// POST /api/orders - 새 주문 생성
router.post('/', orderController.createOrder);

// GET /api/orders - 주문 목록 조회
router.get('/', orderController.getOrders);

// GET /api/orders/:id - 특정 주문 상세 조회
router.get('/:id', orderController.getOrderById);

// PUT /api/orders/:id/status - 주문 상태 변경
router.put('/:id/status', orderController.updateOrderStatus);

module.exports = router;

