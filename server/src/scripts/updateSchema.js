const { Pool } = require('pg');

// PRD에 맞게 데이터베이스 스키마 업데이트
async function updateSchema() {
  const pool = new Pool({
    host: 'localhost',
    port: 5432,
    database: 'coffee_order_db',
    user: 'postgres',
    password: 'y5475986!'
  });

  try {
    console.log('🔄 데이터베이스 스키마를 업데이트합니다...');

    // 1. menus 테이블에 stock_quantity 컬럼 추가 (없는 경우)
    await pool.query(`
      ALTER TABLE menus 
      ADD COLUMN IF NOT EXISTS stock_quantity INTEGER DEFAULT 10
    `);
    console.log('✅ menus 테이블에 stock_quantity 컬럼 추가');

    // 2. options 테이블 생성
    await pool.query(`
      CREATE TABLE IF NOT EXISTS options (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        price INTEGER NOT NULL DEFAULT 0,
        menu_id INTEGER REFERENCES menus(id) ON DELETE CASCADE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ options 테이블 생성');

    // 3. 기본 옵션 데이터 삽입
    const optionCount = await pool.query('SELECT COUNT(*) FROM options');
    if (optionCount.rows[0].count === '0') {
      // 모든 메뉴에 공통 옵션 추가
      const menus = await pool.query('SELECT id FROM menus');
      
      for (const menu of menus.rows) {
        await pool.query(
          'INSERT INTO options (name, price, menu_id) VALUES ($1, $2, $3)',
          ['샷 추가', 500, menu.id]
        );
        await pool.query(
          'INSERT INTO options (name, price, menu_id) VALUES ($1, $2, $3)',
          ['시럽 추가', 0, menu.id]
        );
      }
      console.log('✅ 기본 옵션 데이터 삽입');
    }

    // 4. 기존 메뉴의 재고를 10으로 설정
    await pool.query(`
      UPDATE menus 
      SET stock_quantity = 10 
      WHERE stock_quantity IS NULL OR stock_quantity = 0
    `);
    console.log('✅ 기존 메뉴 재고 설정');

    // 5. PRD에 맞는 메뉴 데이터 업데이트
    const prdMenus = [
      { name: '아메리카노(ICE)', description: '깔끔하고 시원한 아이스 아메리카노', price: 4000, category: 'coffee' },
      { name: '아메리카노(HOT)', description: '따뜻하고 진한 핫 아메리카노', price: 4000, category: 'coffee' },
      { name: '카페라떼', description: '부드러운 우유와 에스프레소의 조화', price: 5000, category: 'coffee' }
    ];

    for (const menu of prdMenus) {
      const existingMenu = await pool.query(
        'SELECT id FROM menus WHERE name = $1',
        [menu.name]
      );

      if (existingMenu.rows.length === 0) {
        await pool.query(
          'INSERT INTO menus (name, description, price, category, stock_quantity) VALUES ($1, $2, $3, $4, $5)',
          [menu.name, menu.description, menu.price, menu.category, 10]
        );
        console.log(`✅ ${menu.name} 메뉴 추가`);
      }
    }

    console.log('🎉 데이터베이스 스키마 업데이트 완료!');
    
  } catch (error) {
    console.error('❌ 스키마 업데이트 중 오류 발생:', error);
    throw error;
  } finally {
    await pool.end();
  }
}

// 스크립트가 직접 실행될 때만 실행
if (require.main === module) {
  updateSchema()
    .then(() => {
      console.log('✅ 스키마 업데이트 완료');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ 스키마 업데이트 실패:', error);
      process.exit(1);
    });
}

module.exports = updateSchema;
