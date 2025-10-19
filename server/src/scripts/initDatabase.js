const { query } = require('../config/database');

// 데이터베이스 초기화 스크립트
async function initDatabase() {
  try {
    console.log('🔄 데이터베이스 초기화를 시작합니다...');

    // 1. 메뉴 테이블 생성
    await query(`
      CREATE TABLE IF NOT EXISTS menus (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        description TEXT,
        price DECIMAL(10,2) NOT NULL,
        category VARCHAR(50) NOT NULL,
        image_url VARCHAR(255),
        is_available BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ 메뉴 테이블이 생성되었습니다.');

    // 2. 주문 테이블 생성
    await query(`
      CREATE TABLE IF NOT EXISTS orders (
        id SERIAL PRIMARY KEY,
        order_number VARCHAR(20) UNIQUE NOT NULL,
        customer_name VARCHAR(100) NOT NULL,
        customer_phone VARCHAR(20),
        total_amount DECIMAL(10,2) NOT NULL,
        status VARCHAR(20) DEFAULT 'pending',
        order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ 주문 테이블이 생성되었습니다.');

    // 3. 주문 상세 테이블 생성
    await query(`
      CREATE TABLE IF NOT EXISTS order_items (
        id SERIAL PRIMARY KEY,
        order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
        menu_id INTEGER REFERENCES menus(id),
        quantity INTEGER NOT NULL,
        price DECIMAL(10,2) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ 주문 상세 테이블이 생성되었습니다.');

    // 4. 관리자 테이블 생성
    await query(`
      CREATE TABLE IF NOT EXISTS admins (
        id SERIAL PRIMARY KEY,
        username VARCHAR(50) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        email VARCHAR(100),
        role VARCHAR(20) DEFAULT 'admin',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ 관리자 테이블이 생성되었습니다.');

    // 5. 기본 메뉴 데이터 삽입
    const menuCount = await query('SELECT COUNT(*) FROM menus');
    if (menuCount.rows[0].count === '0') {
      const defaultMenus = [
        ['아메리카노', '진한 에스프레소에 뜨거운 물을 부어 만든 커피', 4500, 'coffee'],
        ['카페라떼', '에스프레소에 스팀밀크를 넣은 부드러운 커피', 5000, 'coffee'],
        ['카푸치노', '에스프레소에 스팀밀크와 우유 거품을 넣은 커피', 5000, 'coffee'],
        ['카라멜 마키아토', '에스프레소에 바닐라 시럽과 카라멜을 넣은 커피', 5500, 'coffee'],
        ['모카', '에스프레소에 초콜릿 시럽과 스팀밀크를 넣은 커피', 5500, 'coffee'],
        ['바닐라 라떼', '에스프레소에 바닐라 시럽과 스팀밀크를 넣은 커피', 5000, 'coffee'],
        ['아이스 아메리카노', '시원한 아메리카노', 4000, 'coffee'],
        ['아이스 카페라떼', '시원한 카페라떼', 4500, 'coffee'],
        ['초콜릿 케이크', '진한 초콜릿으로 만든 케이크', 6000, 'dessert'],
        ['치즈케이크', '부드러운 치즈케이크', 5500, 'dessert'],
        ['크로와상', '바삭한 크로와상', 3000, 'dessert'],
        ['머핀', '다양한 맛의 머핀', 3500, 'dessert']
      ];

      for (const [name, description, price, category] of defaultMenus) {
        await query(
          'INSERT INTO menus (name, description, price, category) VALUES ($1, $2, $3, $4)',
          [name, description, price, category]
        );
      }
      console.log('✅ 기본 메뉴 데이터가 삽입되었습니다.');
    }

    // 6. 기본 관리자 계정 생성 (비밀번호: admin123)
    const adminCount = await query('SELECT COUNT(*) FROM admins');
    if (adminCount.rows[0].count === '0') {
      // 실제 프로덕션에서는 bcrypt를 사용해야 합니다
      const bcrypt = require('bcrypt');
      const hashedPassword = await bcrypt.hash('admin123', 10);
      
      await query(
        'INSERT INTO admins (username, password_hash, email) VALUES ($1, $2, $3)',
        ['admin', hashedPassword, 'admin@coffee.com']
      );
      console.log('✅ 기본 관리자 계정이 생성되었습니다. (username: admin, password: admin123)');
    }

    console.log('🎉 데이터베이스 초기화가 완료되었습니다!');
    
  } catch (error) {
    console.error('❌ 데이터베이스 초기화 중 오류 발생:', error);
    throw error;
  }
}

// 스크립트가 직접 실행될 때만 초기화 실행
if (require.main === module) {
  initDatabase()
    .then(() => {
      console.log('✅ 데이터베이스 초기화 완료');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ 데이터베이스 초기화 실패:', error);
      process.exit(1);
    });
}

module.exports = initDatabase;
