const express = require('express');
const router = express.Router();
const menuController = require('../controllers/menuController');

// GET /api/menus - 메뉴 목록 조회
router.get('/', menuController.getMenus);

// GET /api/menus/:id - 특정 메뉴 상세 조회
router.get('/:id', menuController.getMenuById);

// PUT /api/menus/:id/stock - 메뉴 재고 수정
router.put('/:id/stock', menuController.updateStock);

module.exports = router;

