const { Pool } = require('pg');

// 직접 데이터베이스 생성 스크립트
async function createDatabaseDirect() {
  const pool = new Pool({
    host: 'localhost',
    port: 5432,
    database: 'postgres', // 기본 postgres 데이터베이스에 연결
    user: 'postgres',
    password: 'y5475986!'
  });

  try {
    console.log('🔄 데이터베이스 생성을 시도합니다...');
    
    // 데이터베이스 존재 여부 확인
    const checkDb = await pool.query(
      "SELECT 1 FROM pg_database WHERE datname = 'coffee_order_db'"
    );

    if (checkDb.rows.length === 0) {
      // 데이터베이스 생성
      await pool.query('CREATE DATABASE coffee_order_db');
      console.log('✅ coffee_order_db 데이터베이스가 생성되었습니다.');
    } else {
      console.log('✅ coffee_order_db 데이터베이스가 이미 존재합니다.');
    }

    // 새 데이터베이스에 연결 테스트
    const testPool = new Pool({
      host: 'localhost',
      port: 5432,
      database: 'coffee_order_db',
      user: 'postgres',
      password: 'y5475986!'
    });

    const result = await testPool.query('SELECT NOW() as current_time, current_database() as db_name');
    console.log('✅ coffee_order_db 데이터베이스 연결 성공!');
    console.log('📅 현재 시간:', result.rows[0].current_time);
    console.log('🗄️ 데이터베이스:', result.rows[0].db_name);

    await testPool.end();
    await pool.end();
    
  } catch (error) {
    console.error('❌ 데이터베이스 생성/연결 오류:', error.message);
    throw error;
  }
}

// 스크립트가 직접 실행될 때만 실행
if (require.main === module) {
  createDatabaseDirect()
    .then(() => {
      console.log('✅ 데이터베이스 생성 완료');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ 데이터베이스 생성 실패:', error.message);
      process.exit(1);
    });
}

module.exports = createDatabaseDirect;
