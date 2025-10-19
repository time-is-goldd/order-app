const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

// GET /api/admin/dashboard - 관리자 대시보드 통계 조회
router.get('/dashboard', adminController.getDashboardStats);

// GET /api/admin/inventory - 재고 현황 조회
router.get('/inventory', adminController.getInventory);

// PUT /api/admin/inventory/:id - 재고 수량 수정
router.put('/inventory/:id', adminController.updateInventory);

// GET /api/admin/orders - 관리자용 주문 목록 조회
router.get('/orders', adminController.getAdminOrders);

module.exports = router;

