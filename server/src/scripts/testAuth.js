const { Pool } = require('pg');

// 다양한 인증 방법을 시도하는 스크립트
async function testAuth() {
  const configs = [
    {
      name: '기본 postgres 사용자',
      config: {
        host: 'localhost',
        port: 5432,
        database: 'postgres',
        user: 'postgres',
        password: 'y5475986!'
      }
    },
    {
      name: '비밀번호 없이 시도',
      config: {
        host: 'localhost',
        port: 5432,
        database: 'postgres',
        user: 'postgres'
      }
    },
    {
      name: '기본 데이터베이스로 연결',
      config: {
        host: 'localhost',
        port: 5432,
        database: 'postgres',
        user: 'postgres',
        password: 'y5475986!'
      }
    }
  ];

  for (const { name, config } of configs) {
    try {
      console.log(`\n🔄 ${name} 시도 중...`);
      const pool = new Pool(config);
      
      const result = await pool.query('SELECT current_user, current_database()');
      console.log(`✅ ${name} 성공!`);
      console.log(`   사용자: ${result.rows[0].current_user}`);
      console.log(`   데이터베이스: ${result.rows[0].current_database}`);
      
      await pool.end();
      return true;
      
    } catch (error) {
      console.log(`❌ ${name} 실패: ${error.message}`);
    }
  }
  
  return false;
}

// 스크립트가 직접 실행될 때만 실행
if (require.main === module) {
  testAuth()
    .then((success) => {
      if (success) {
        console.log('\n🎉 인증 성공! 이제 데이터베이스를 생성할 수 있습니다.');
      } else {
        console.log('\n❌ 모든 인증 방법이 실패했습니다.');
        console.log('\n🔧 해결 방법:');
        console.log('1. PostgreSQL이 올바르게 설치되었는지 확인');
        console.log('2. PostgreSQL 서비스가 실행 중인지 확인');
        console.log('3. 비밀번호가 올바른지 확인');
        console.log('4. pgAdmin을 사용하여 수동으로 연결 테스트');
      }
      process.exit(success ? 0 : 1);
    })
    .catch((error) => {
      console.error('❌ 인증 테스트 실패:', error);
      process.exit(1);
    });
}

module.exports = testAuth;
