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

module.exports = {
  getDashboardStats
};

