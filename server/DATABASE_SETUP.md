# 데이터베이스 설정 가이드

## PostgreSQL 데이터베이스 연결 설정

### 1. 환경 변수 설정

프로젝트 루트에 `.env` 파일을 생성하고 다음 내용을 추가하세요:

```env
# 데이터베이스 설정
DB_HOST=localhost
DB_PORT=5432
DB_NAME=coffee_order_db
DB_USER=postgres
DB_PASSWORD=your_password_here

# 서버 설정
PORT=3001
NODE_ENV=development

# CORS 설정
CORS_ORIGIN=http://localhost:5173
```

### 2. PostgreSQL 데이터베이스 생성

PostgreSQL에 접속하여 데이터베이스를 생성하세요:

```sql
-- PostgreSQL에 접속 (psql 또는 pgAdmin 사용)
CREATE DATABASE coffee_order_db;
```

### 3. 데이터베이스 연결 테스트

```bash
# 연결 테스트
npm run db:test
```

### 4. 데이터베이스 초기화

```bash
# 테이블 생성 및 기본 데이터 삽입
npm run db:init
```

### 5. 서버 실행

```bash
# 개발 모드로 서버 실행
npm run dev

# 또는 프로덕션 모드로 실행
npm start
```

## 문제 해결

### 연결 오류가 발생하는 경우:

1. **PostgreSQL 서비스 확인**
   ```bash
   # Windows
   services.msc에서 PostgreSQL 서비스 확인
   
   # 또는 명령어로 확인
   sc query postgresql
   ```

2. **포트 확인**
   ```bash
   netstat -an | findstr 5432
   ```

3. **방화벽 설정 확인**
   - PostgreSQL 포트(5432)가 방화벽에서 허용되어 있는지 확인

4. **사용자 권한 확인**
   ```sql
   -- PostgreSQL에서 사용자 권한 확인
   \du
   ```

### 기본 관리자 계정

데이터베이스 초기화 후 다음 계정으로 로그인할 수 있습니다:
- **사용자명**: admin
- **비밀번호**: admin123

> ⚠️ **보안 주의**: 프로덕션 환경에서는 반드시 기본 비밀번호를 변경하세요!

## 데이터베이스 스키마

### 테이블 구조

1. **menus** - 메뉴 정보
2. **orders** - 주문 정보  
3. **order_items** - 주문 상세 정보
4. **admins** - 관리자 정보

### 관계
- `orders` → `order_items` (1:N)
- `menus` → `order_items` (1:N)
