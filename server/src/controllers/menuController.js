const { query } = require('../config/database');

// GET /api/menus - 메뉴 목록 조회
const getMenus = async (req, res) => {
  try {
    const result = await query(`
      SELECT 
        m.*,
        COALESCE(
          json_agg(
            json_build_object(
              'id', o.id,
              'name', o.name,
              'price', o.price
            )
          ) FILTER (WHERE o.id IS NOT NULL),
          '[]'
        ) as options
      FROM menus m
      LEFT JOIN options o ON m.id = o.menu_id
      GROUP BY m.id
      ORDER BY m.id
    `);

    res.json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    console.error('메뉴 목록 조회 오류:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'MENU_FETCH_ERROR',
        message: '메뉴 목록을 불러오는데 실패했습니다.',
        details: error.message
      }
    });
  }
};

// GET /api/menus/:id - 특정 메뉴 상세 조회
const getMenuById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await query(`
      SELECT 
        m.*,
        COALESCE(
          json_agg(
            json_build_object(
              'id', o.id,
              'name', o.name,
              'price', o.price
            )
          ) FILTER (WHERE o.id IS NOT NULL),
          '[]'
        ) as options
      FROM menus m
      LEFT JOIN options o ON m.id = o.menu_id
      WHERE m.id = $1
      GROUP BY m.id
    `, [id]);

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
      data: result.rows[0]
    });
  } catch (error) {
    console.error('메뉴 상세 조회 오류:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'MENU_FETCH_ERROR',
        message: '메뉴 정보를 불러오는데 실패했습니다.',
        details: error.message
      }
    });
  }
};

// PUT /api/menus/:id/stock - 메뉴 재고 수정
const updateStock = async (req, res) => {
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
        code: 'STOCK_UPDATE_ERROR',
        message: '재고 업데이트에 실패했습니다.',
        details: error.message
      }
    });
  }
};

module.exports = {
  getMenus,
  getMenuById,
  updateStock
};

