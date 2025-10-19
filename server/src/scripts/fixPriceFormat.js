const { Pool } = require('pg');

// 가격 형식을 INTEGER로 수정하는 스크립트
async function fixPriceFormat() {
  const pool = new Pool({
    host: 'localhost',
    port: 5432,
    database: 'coffee_order_db',
    user: 'postgres',
    password: 'y5475986!'
  });

  try {
    console.log('🔄 가격 형식을 수정합니다...');

    // menus 테이블의 price 컬럼을 INTEGER로 변경
    await pool.query('ALTER TABLE menus ALTER COLUMN price TYPE INTEGER');
    console.log('✅ menus 테이블 가격 형식 수정 완료');

    // orders 테이블의 total_amount 컬럼을 INTEGER로 변경
    await pool.query('ALTER TABLE orders ALTER COLUMN total_amount TYPE INTEGER');
    console.log('✅ orders 테이블 가격 형식 수정 완료');

    // order_items 테이블의 price 컬럼을 INTEGER로 변경 (있다면)
    try {
      await pool.query('ALTER TABLE order_items ALTER COLUMN price TYPE INTEGER');
      console.log('✅ order_items 테이블 가격 형식 수정 완료');
    } catch (error) {
      console.log('⚠️ order_items 테이블이 없거나 이미 수정됨');
    }

    // options 테이블의 price 컬럼을 INTEGER로 변경
    await pool.query('ALTER TABLE options ALTER COLUMN price TYPE INTEGER');
    console.log('✅ options 테이블 가격 형식 수정 완료');

    console.log('🎉 가격 형식 수정 완료!');
    
  } catch (error) {
    console.error('❌ 가격 형식 수정 중 오류 발생:', error);
    throw error;
  } finally {
    await pool.end();
  }
}

// 스크립트가 직접 실행될 때만 실행
if (require.main === module) {
  fixPriceFormat()
    .then(() => {
      console.log('✅ 가격 형식 수정 완료');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ 가격 형식 수정 실패:', error);
      process.exit(1);
    });
}

module.exports = fixPriceFormat;
