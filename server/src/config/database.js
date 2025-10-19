const { Pool } = require('pg');

// 데이터베이스 연결 설정 (Render 우선, 로컬 폴백)
const dbConfig = process.env.DATABASE_URL 
  ? {
      connectionString: process.env.DATABASE_URL,
      ssl: {
        rejectUnauthorized: false
      }
    }
  : {
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 5432,
      database: process.env.DB_NAME || 'coffee_order_db',
      user: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASSWORD || 'y5475986!',
    };

// PostgreSQL 연결 풀 생성
const pool = new Pool(dbConfig);

// 연결 테스트
pool.on('connect', () => {
  console.log('✅ PostgreSQL 데이터베이스에 연결되었습니다.');
});

pool.on('error', (err) => {
  console.error('❌ PostgreSQL 연결 오류:', err);
});

// 데이터베이스 쿼리 헬퍼 함수
const query = async (text, params) => {
  const start = Date.now();
  try {
    const res = await pool.query(text, params);
    const duration = Date.now() - start;
    console.log('📊 쿼리 실행:', { text, duration, rows: res.rowCount });
    return res;
  } catch (error) {
    console.error('❌ 쿼리 오류:', error);
    throw error;
  }
};

// 트랜잭션 헬퍼 함수
const getClient = async () => {
  return await pool.connect();
};

module.exports = {
  query,
  getClient,
  pool
};

