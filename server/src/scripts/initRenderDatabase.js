const { Pool } = require('pg');

// Render 데이터베이스 초기화 스크립트
async function initRenderDatabase() {
  // Render 데이터베이스 연결 설정
  const pool = new Pool(
    process.env.DATABASE_URL 
      ? {
          connectionString: process.env.DATABASE_URL,
          ssl: process.env.NODE_ENV === 'production' ? {
            rejectUnauthorized: false
          } : false
        }
      : {
          host: process.env.DB_HOST || 'localhost',
          port: process.env.DB_PORT || 5432,
          database: process.env.DB_NAME || 'coffee_order_db',
          user: process.env.DB_USER || 'postgres',
          password: process.env.DB_PASSWORD || 'y5475986!',
        }
  );

  try {
    console.log('🔄 Render 데이터베이스 초기화를 시작합니다...');

    // 기존 테이블 삭제 (순서 중요: 외래키 참조 순서대로)
    await pool.query('DROP TABLE IF EXISTS order_details CASCADE');
    await pool.query('DROP TABLE IF EXISTS orders CASCADE');
    await pool.query('DROP TABLE IF EXISTS options CASCADE');
    await pool.query('DROP TABLE IF EXISTS menus CASCADE');
    await pool.query('DROP TABLE IF EXISTS admin CASCADE');
    console.log('✅ 기존 테이블 삭제 완료');

    // 1. 메뉴 테이블 생성
    await pool.query(`
      CREATE TABLE IF NOT EXISTS menus (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        price INTEGER NOT NULL,
        description TEXT,
        stock_quantity INTEGER DEFAULT 0,
        is_available BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ menus 테이블 생성 완료');

    // 2. 옵션 테이블 생성
    await pool.query(`
      CREATE TABLE IF NOT EXISTS options (
        id SERIAL PRIMARY KEY,
        menu_id INTEGER REFERENCES menus(id) ON DELETE CASCADE,
        name VARCHAR(50) NOT NULL,
        price INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ options 테이블 생성 완료');

    // 3. 주문 테이블 생성
    await pool.query(`
      CREATE TABLE IF NOT EXISTS orders (
        id SERIAL PRIMARY KEY,
        order_number VARCHAR(20) UNIQUE NOT NULL,
        customer_name VARCHAR(100),
        customer_phone VARCHAR(20),
        total_amount INTEGER NOT NULL,
        status VARCHAR(20) DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ orders 테이블 생성 완료');

    // 4. 주문 상세 테이블 생성
    await pool.query(`
      CREATE TABLE IF NOT EXISTS order_details (
        id SERIAL PRIMARY KEY,
        order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
        menu_id INTEGER REFERENCES menus(id),
        option_id INTEGER REFERENCES options(id),
        quantity INTEGER NOT NULL,
        price INTEGER NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ order_details 테이블 생성 완료');

    // 5. 관리자 테이블 생성
    await pool.query(`
      CREATE TABLE IF NOT EXISTS admin (
        id SERIAL PRIMARY KEY,
        username VARCHAR(50) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ admin 테이블 생성 완료');

    // 6. 초기 메뉴 데이터 삽입
    const menuData = [
      {
        name: '아메리카노(ICE)',
        price: 4000,
        description: '시원한 아메리카노',
        stock_quantity: 10
      },
      {
        name: '아메리카노(HOT)',
        price: 4000,
        description: '따뜻한 아메리카노',
        stock_quantity: 10
      },
      {
        name: '카페라떼',
        price: 5000,
        description: '부드러운 카페라떼',
        stock_quantity: 10
      }
    ];

    for (const menu of menuData) {
      const result = await pool.query(
        'INSERT INTO menus (name, price, description, stock_quantity) VALUES ($1, $2, $3, $4) ON CONFLICT DO NOTHING',
        [menu.name, menu.price, menu.description, menu.stock_quantity]
      );
    }
    console.log('✅ 초기 메뉴 데이터 삽입 완료');

    // 7. 초기 옵션 데이터 삽입
    const menuIds = await pool.query('SELECT id, name FROM menus');
    
    for (const menu of menuIds.rows) {
      const options = [
        { name: '기본', price: 0 },
        { name: '샷 추가', price: 500 },
        { name: '시럽 추가', price: 300 }
      ];

      for (const option of options) {
        await pool.query(
          'INSERT INTO options (menu_id, name, price) VALUES ($1, $2, $3) ON CONFLICT DO NOTHING',
          [menu.id, option.name, option.price]
        );
      }
    }
    console.log('✅ 초기 옵션 데이터 삽입 완료');

    // 8. 초기 관리자 데이터 삽입
    await pool.query(
      'INSERT INTO admin (username, password) VALUES ($1, $2) ON CONFLICT (username) DO NOTHING',
      ['admin', 'admin123']
    );
    console.log('✅ 초기 관리자 데이터 삽입 완료');

    console.log('🎉 Render 데이터베이스 초기화 완료!');

  } catch (error) {
    console.error('❌ 데이터베이스 초기화 중 오류 발생:', error);
    throw error;
  } finally {
    await pool.end();
  }
}

// 스크립트가 직접 실행될 때만 실행
if (require.main === module) {
  initRenderDatabase()
    .then(() => {
      console.log('✅ Render 데이터베이스 초기화 완료');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Render 데이터베이스 초기화 실패:', error);
      process.exit(1);
    });
}

module.exports = initRenderDatabase;
