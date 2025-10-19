const { Pool } = require('pg');

// 메뉴를 4개로 업데이트하는 스크립트
async function updateMenus() {
  const pool = new Pool({
    host: 'localhost',
    port: 5432,
    database: 'coffee_order_db',
    user: 'postgres',
    password: 'y5475986!'
  });

  try {
    console.log('🔄 메뉴를 4개로 업데이트합니다...');

    // 기존 메뉴 모두 삭제
    await pool.query('DELETE FROM menus');
    console.log('✅ 기존 메뉴 삭제 완료');

    // 새로운 메뉴 4개 삽입
    const newMenus = [
      { name: '아메리카노(ICE)', description: '깔끔하고 시원한 아이스 아메리카노', price: 4000, category: 'coffee', stock_quantity: 10 },
      { name: '아메리카노(HOT)', description: '따뜻하고 진한 핫 아메리카노', price: 4000, category: 'coffee', stock_quantity: 10 },
      { name: '바닐라라떼', description: '부드러운 바닐라와 에스프레소의 조화', price: 5000, category: 'coffee', stock_quantity: 10 },
      { name: '카페라떼', description: '부드러운 우유와 에스프레소의 조화', price: 5000, category: 'coffee', stock_quantity: 10 }
    ];

    for (const menu of newMenus) {
      await pool.query(
        'INSERT INTO menus (name, description, price, category, stock_quantity) VALUES ($1, $2, $3, $4, $5)',
        [menu.name, menu.description, menu.price, menu.category, menu.stock_quantity]
      );
      console.log(`✅ ${menu.name} 메뉴 추가`);
    }

    // 각 메뉴에 옵션 추가
    const menus = await pool.query('SELECT id FROM menus ORDER BY id');
    
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
    console.log('✅ 옵션 추가 완료');

    console.log('🎉 메뉴 업데이트 완료!');
    
  } catch (error) {
    console.error('❌ 메뉴 업데이트 중 오류 발생:', error);
    throw error;
  } finally {
    await pool.end();
  }
}

// 스크립트가 직접 실행될 때만 실행
if (require.main === module) {
  updateMenus()
    .then(() => {
      console.log('✅ 메뉴 업데이트 완료');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ 메뉴 업데이트 실패:', error);
      process.exit(1);
    });
}

module.exports = updateMenus;
