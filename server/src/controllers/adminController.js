const { query } = require('../config/database');

// GET /api/admin/dashboard - 관리자 대시보드 통계 조회
const getDashboardStats = async (req, res) => {
  try {
    const result = await query(`
      SELECT 
        COUNT(*) as total_orders,
        COUNT(*) FILTER (WHERE status = 'pending') as pending_orders,
        COUNT(*) FILTER (WHERE status = 'accepted') as accepted_orders,
        COUNT(*) FILTER (WHERE status = 'completed') as completed_orders
      FROM orders
    `);

    const stats = result.rows[0];

    res.json({
      success: true,
      data: {
        total_orders: parseInt(stats.total_orders),
        pending_orders: parseInt(stats.pending_orders),
        accepted_orders: parseInt(stats.accepted_orders),
        completed_orders: parseInt(stats.completed_orders)
      }
    });
  } catch (error) {
    console.error('대시보드 통계 조회 오류:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'DASHBOARD_FETCH_ERROR',
        message: '대시보드 통계를 불러오는데 실패했습니다.',
        details: error.message
      }
    });
  }
};

// GET /api/admin/inventory - 재고 현황 조회
const getInventory = async (req, res) => {
  try {
    const result = await query(`
      SELECT 
        m.id,
        m.name,
        m.stock_quantity,
        m.price,
        m.category
      FROM menus m
      WHERE m.is_available = true
      ORDER BY m.category, m.name
    `);

    res.json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    console.error('재고 현황 조회 오류:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'INVENTORY_FETCH_ERROR',
        message: '재고 현황을 불러오는데 실패했습니다.',
        details: error.message
      }
    });
  }
};

// PUT /api/admin/inventory/:id - 재고 수량 수정
const updateInventory = async (req, res) => {
  try {
    const { id } = req.params;
    const { stock_quantity } = req.body;

    if (typeof stock_quantity !== 'number' || stock_quantity < 0) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'INVALID_STOCK_QUANTITY',
          message: '유효하지 않은 재고 수량입니다.',
          details: '재고 수량은 0 이상의 숫자여야 합니다.'
        }
      });
    }

    const result = await query(
      'UPDATE menus SET stock_quantity = $1, updated_at = NOW() WHERE id = $2 RETURNING *',
      [stock_quantity, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'MENU_NOT_FOUND',
          message: '메뉴를 찾을 수 없습니다.',
          details: `ID ${id}에 해당하는 메뉴가 존재하지 않습니다.`
        }
      });
    }

    res.json({
      success: true,
      data: result.rows[0],
      message: '재고가 성공적으로 업데이트되었습니다.'
    });
  } catch (error) {
    console.error('재고 업데이트 오류:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'INVENTORY_UPDATE_ERROR',
        message: '재고 업데이트에 실패했습니다.',
        details: error.message
      }
    });
  }
};

// GET /api/admin/orders - 관리자용 주문 목록 조회
const getAdminOrders = async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    
    let whereClause = '';
    let queryParams = [];
    
    if (status) {
      whereClause = 'WHERE status = $1';
      queryParams.push(status);
    }

    const offset = (page - 1) * limit;
    
    const result = await query(`
      SELECT 
        id,
        order_number,
        order_items,
        total_amount,
        status,
        order_time,
        created_at
      FROM orders 
      ${whereClause}
      ORDER BY order_time DESC 
      LIMIT $${queryParams.length + 1} OFFSET $${queryParams.length + 2}
    `, [...queryParams, limit, offset]);

    // 총 개수 조회
    const countResult = await query(`
      SELECT COUNT(*) as total FROM orders ${whereClause}
    `, queryParams);

    res.json({
      success: true,
      data: result.rows,
      pagination: {
        current_page: parseInt(page),
        total_pages: Math.ceil(countResult.rows[0].total / limit),
        total_items: parseInt(countResult.rows[0].total),
        items_per_page: parseInt(limit)
      }
    });
  } catch (error) {
    console.error('관리자 주문 목록 조회 오류:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'ADMIN_ORDER_FETCH_ERROR',
        message: '주문 목록을 불러오는데 실패했습니다.',
        details: error.message
      }
    });
  }
};

module.exports = {
  getDashboardStats,
  getInventory,
  updateInventory,
  getAdminOrders
};

