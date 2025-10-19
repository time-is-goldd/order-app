const { query } = require('../config/database');

// 데이터베이스 연결 테스트 스크립트
async function testConnection() {
  try {
    console.log('🔄 PostgreSQL 데이터베이스 연결을 테스트합니다...');
    
    // 1. 기본 연결 테스트
    const result = await query('SELECT NOW() as current_time, version() as postgres_version');
    console.log('✅ 데이터베이스 연결 성공!');
    console.log('📅 현재 시간:', result.rows[0].current_time);
    console.log('🐘 PostgreSQL 버전:', result.rows[0].postgres_version.split(' ')[0]);
    
    // 2. 데이터베이스 정보 확인
    const dbInfo = await query(`
      SELECT 
        current_database() as database_name,
        current_user as current_user,
        inet_server_addr() as server_address,
        inet_server_port() as server_port
    `);
    
    console.log('\n📊 데이터베이스 정보:');
    console.log('   데이터베이스명:', dbInfo.rows[0].database_name);
    console.log('   사용자:', dbInfo.rows[0].current_user);
    console.log('   서버 주소:', dbInfo.rows[0].server_address || 'localhost');
    console.log('   서버 포트:', dbInfo.rows[0].server_port);
    
    // 3. 테이블 존재 여부 확인
    const tables = await query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name
    `);
    
    console.log('\n📋 존재하는 테이블:');
    if (tables.rows.length === 0) {
      console.log('   (테이블이 없습니다. 데이터베이스 초기화를 실행하세요)');
    } else {
      tables.rows.forEach(row => {
        console.log(`   - ${row.table_name}`);
      });
    }
    
    console.log('\n🎉 데이터베이스 연결 테스트가 완료되었습니다!');
    
  } catch (error) {
    console.error('❌ 데이터베이스 연결 테스트 실패:', error.message);
    console.error('\n🔧 해결 방법:');
    console.error('1. PostgreSQL이 실행 중인지 확인하세요');
    console.error('2. 데이터베이스가 생성되었는지 확인하세요');
    console.error('3. 환경 변수 설정을 확인하세요 (.env 파일)');
    console.error('4. 사용자 권한을 확인하세요');
    throw error;
  }
}

// 스크립트가 직접 실행될 때만 테스트 실행
if (require.main === module) {
  testConnection()
    .then(() => {
      console.log('✅ 연결 테스트 완료');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ 연결 테스트 실패:', error.message);
      process.exit(1);
    });
}

module.exports = testConnection;
