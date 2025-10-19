const { Pool } = require('pg');

// 바닐라라떼 메뉴를 제거하는 스크립트
async function removeVanillaLatte() {
  const pool = new Pool({
    host: 'localhost',
    port: 5432,
    database: 'coffee_order_db',
    user: 'postgres',
    password: 'y5475986!'
  });

  try {
    console.log('🔄 바닐라라떼 메뉴를 제거합니다...');

    // 바닐라라떼 메뉴 찾기
    const menuResult = await pool.query(
      "SELECT id FROM menus WHERE name = '바닐라라떼'"
    );

    if (menuResult.rows.length > 0) {
      const menuId = menuResult.rows[0].id;
      
      // 관련 옵션 삭제
      await pool.query('DELETE FROM options WHERE menu_id = $1', [menuId]);
      console.log('✅ 바닐라라떼 옵션 삭제 완료');
      
      // 메뉴 삭제
      await pool.query('DELETE FROM menus WHERE id = $1', [menuId]);
      console.log('✅ 바닐라라떼 메뉴 삭제 완료');
    } else {
      console.log('⚠️ 바닐라라떼 메뉴를 찾을 수 없습니다.');
    }

    console.log('🎉 바닐라라떼 메뉴 제거 완료!');
    
  } catch (error) {
    console.error('❌ 바닐라라떼 메뉴 제거 중 오류 발생:', error);
    throw error;
  } finally {
    await pool.end();
  }
}

// 스크립트가 직접 실행될 때만 실행
if (require.main === module) {
  removeVanillaLatte()
    .then(() => {
      console.log('✅ 바닐라라떼 메뉴 제거 완료');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ 바닐라라떼 메뉴 제거 실패:', error);
      process.exit(1);
    });
}

module.exports = removeVanillaLatte;
