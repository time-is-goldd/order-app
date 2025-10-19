const { Pool } = require('pg');

// 데이터베이스 생성 스크립트
async function createDatabase() {
  // 먼저 postgres 데이터베이스에 연결
  const adminPool = new Pool({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    database: 'postgres', // 기본 postgres 데이터베이스에 연결
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'password',
  });

  try {
    console.log('🔄 데이터베이스 생성을 시도합니다...');
    
    // 데이터베이스 존재 여부 확인
    const checkDb = await adminPool.query(
      "SELECT 1 FROM pg_database WHERE datname = $1",
      [process.env.DB_NAME || 'coffee_order_db']
    );

    if (checkDb.rows.length === 0) {
      // 데이터베이스 생성
      await adminPool.query(`CREATE DATABASE ${process.env.DB_NAME || 'coffee_order_db'}`);
      console.log('✅ 데이터베이스가 생성되었습니다.');
    } else {
      console.log('✅ 데이터베이스가 이미 존재합니다.');
    }

    // 연결 테스트
    const testPool = new Pool({
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 5432,
      database: process.env.DB_NAME || 'coffee_order_db',
      user: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASSWORD || 'password',
    });

    const result = await testPool.query('SELECT NOW() as current_time');
    console.log('✅ 데이터베이스 연결 성공!');
    console.log('📅 현재 시간:', result.rows[0].current_time);

    await testPool.end();
    await adminPool.end();
    
  } catch (error) {
    console.error('❌ 데이터베이스 생성/연결 오류:', error.message);
    throw error;
  }
}

// 스크립트가 직접 실행될 때만 실행
if (require.main === module) {
  createDatabase()
    .then(() => {
      console.log('✅ 데이터베이스 생성 완료');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ 데이터베이스 생성 실패:', error.message);
      process.exit(1);
    });
}

module.exports = createDatabase;
