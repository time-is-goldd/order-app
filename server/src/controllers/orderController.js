const { query, getClient } = require('../config/database');

// POST /api/orders - 새 주문 생성
const createOrder = async (req, res) => {
  const client = await getClient();
  
  try {
    await client.query('BEGIN');
    
    const { order_items, total_amount } = req.body;

    // 입력 데이터 검증
    if (!order_items || !Array.isArray(order_items) || order_items.length === 0) {
      throw new Error('주문 아이템이 필요합니다.');
    }

    if (!total_amount || typeof total_amount !== 'number' || total_amount <= 0) {
      throw new Error('유효한 총 금액이 필요합니다.');
    }

    // 재고 확인 및 차감
    for (const item of order_items) {
      const menuResult = await client.query(
        'SELECT stock_quantity FROM menus WHERE id = $1',
        [item.menu_id]
      );

      if (menuResult.rows.length === 0) {
        throw new Error(`메뉴 ID ${item.menu_id}를 찾을 수 없습니다.`);
      }

      const currentStock = menuResult.rows[0].stock_quantity;
      if (currentStock < item.quantity) {
        throw new Error(`${item.menu_name}의 재고가 부족합니다. (재고: ${currentStock}개, 주문: ${item.quantity}개)`);
      }

      // 재고 차감
      await client.query(
        'UPDATE menus SET stock_quantity = stock_quantity - $1, updated_at = NOW() WHERE id = $2',
        [item.quantity, item.menu_id]
      );
    }

    // 주문 생성
    const orderResult = await client.query(
      `INSERT INTO orders (order_items, total_amount, status, order_time) 
       VALUES ($1, $2, 'pending', NOW()) 
       RETURNING *`,
      [JSON.stringify(order_items), total_amount]
    );

    await client.query('COMMIT');

    res.status(201).json({
      success: true,
      data: {
        order_id: orderResult.rows[0].id,
        order_time: orderResult.rows[0].order_time,
        total_amount: orderResult.rows[0].total_amount,
        status: orderResult.rows[0].status
      },
      message: '주문이 성공적으로 생성되었습니다.'
    });

  } catch (error) {
    await client.query('ROLLBACK');
    console.error('주문 생성 오류:', error);
    
    res.status(400).json({
      success: false,
      error: {
        code: 'ORDER_CREATE_ERROR',
        message: error.message.includes('재고') ? error.message : '주문 생성에 실패했습니다.',
        details: error.message
      }
    });
  } finally {
    client.release();
  }
};

// GET /api/orders - 주문 목록 조회
const getOrders = async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    
    let whereClause = '';
    let queryParams = [];
    
    if (status) {
      whereClause = 'WHERE status = $1';
      queryParams.push(status);
    }

    const offset = (page - 1) * limit;
    
    const result = await query(`
      SELECT * FROM orders 
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
    console.error('주문 목록 조회 오류:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'ORDER_FETCH_ERROR',
        message: '주문 목록을 불러오는데 실패했습니다.',
        details: error.message
      }
    });
  }
};

// GET /api/orders/:id - 특정 주문 상세 조회
const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await query(
      'SELECT * FROM orders WHERE id = $1',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'ORDER_NOT_FOUND',
          message: '주문을 찾을 수 없습니다.',
          details: `ID ${id}에 해당하는 주문이 존재하지 않습니다.`
        }
      });
    }

    res.json({
      success: true,
      data: result.rows[0]
    });
  } catch (error) {
    console.error('주문 상세 조회 오류:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'ORDER_FETCH_ERROR',
        message: '주문 정보를 불러오는데 실패했습니다.',
        details: error.message
      }
    });
  }
};

// PUT /api/orders/:id/status - 주문 상태 변경
const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ['pending', 'accepted', 'completed'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'INVALID_STATUS',
          message: '유효하지 않은 주문 상태입니다.',
          details: `허용되는 상태: ${validStatuses.join(', ')}`
        }
      });
    }

    const result = await query(
      'UPDATE orders SET status = $1, updated_at = NOW() WHERE id = $2 RETURNING *',
      [status, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'ORDER_NOT_FOUND',
          message: '주문을 찾을 수 없습니다.',
          details: `ID ${id}에 해당하는 주문이 존재하지 않습니다.`
        }
      });
    }

    res.json({
      success: true,
      data: result.rows[0],
      message: '주문 상태가 성공적으로 업데이트되었습니다.'
    });
  } catch (error) {
    console.error('주문 상태 업데이트 오류:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'STATUS_UPDATE_ERROR',
        message: '주문 상태 업데이트에 실패했습니다.',
        details: error.message
      }
    });
  }
};

module.exports = {
  createOrder,
  getOrders,
  getOrderById,
  updateOrderStatus
};

