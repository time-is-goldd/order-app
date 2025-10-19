const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

// GET /api/admin/dashboard - 관리자 대시보드 통계 조회
router.get('/dashboard', adminController.getDashboardStats);

module.exports = router;

