# Render 데이터베이스 설정 가이드

## 🚀 Render PostgreSQL 데이터베이스 설정

### 1. Render에서 PostgreSQL 데이터베이스 생성
1. [Render Dashboard](https://dashboard.render.com)에 로그인
2. "New +" → "PostgreSQL" 선택
3. 데이터베이스 이름 설정 (예: `coffee-order-db`)
4. 데이터베이스 생성 완료 후 **External Database URL** 복사

### 2. 환경 변수 설정
`.env` 파일에 다음 내용 추가:

```env
# Render PostgreSQL 데이터베이스 URL
DATABASE_URL=postgresql://username:password@hostname:port/database_name

# 또는 개별 설정 (선택사항)
DB_HOST=your-render-host
DB_PORT=5432
DB_NAME=your-database-name
DB_USER=your-username
DB_PASSWORD=your-password
```

### 3. 데이터베이스 스키마 초기화
```bash
# Render 데이터베이스 초기화 실행
npm run db:init-render
```

### 4. 생성되는 테이블들

#### 📋 **menus** 테이블
- `id`: 메뉴 ID (Primary Key)
- `name`: 메뉴명
- `price`: 가격 (INTEGER)
- `description`: 설명
- `stock_quantity`: 재고 수량
- `is_available`: 판매 가능 여부
- `created_at`, `updated_at`: 생성/수정 시간

#### 🎛️ **options** 테이블
- `id`: 옵션 ID (Primary Key)
- `menu_id`: 메뉴 ID (Foreign Key)
- `name`: 옵션명
- `price`: 옵션 가격
- `created_at`: 생성 시간

#### 📦 **orders** 테이블
- `id`: 주문 ID (Primary Key)
- `order_number`: 주문번호 (Unique)
- `customer_name`: 고객명
- `customer_phone`: 고객 전화번호
- `total_amount`: 총 금액
- `status`: 주문 상태
- `created_at`, `updated_at`: 생성/수정 시간

#### 📝 **order_details** 테이블
- `id`: 주문 상세 ID (Primary Key)
- `order_id`: 주문 ID (Foreign Key)
- `menu_id`: 메뉴 ID (Foreign Key)
- `option_id`: 옵션 ID (Foreign Key)
- `quantity`: 수량
- `price`: 가격
- `created_at`: 생성 시간

#### 👤 **admin** 테이블
- `id`: 관리자 ID (Primary Key)
- `username`: 관리자 아이디
- `password`: 관리자 비밀번호
- `created_at`: 생성 시간

### 5. 초기 데이터
- **메뉴**: 아메리카노(ICE), 아메리카노(HOT), 카페라떼
- **옵션**: 기본, 샷 추가, 시럽 추가
- **관리자**: admin / admin123

### 6. 연결 테스트
```bash
# 데이터베이스 연결 테스트
npm run db:test
```

### 7. 문제 해결
- **SSL 오류**: `ssl: { rejectUnauthorized: false }` 설정 확인
- **연결 실패**: `DATABASE_URL` 형식 확인
- **권한 오류**: Render 데이터베이스 사용자 권한 확인

## 🔧 유용한 명령어들

```bash
# 데이터베이스 초기화
npm run db:init-render

# 연결 테스트
npm run db:test

# 메뉴 업데이트
npm run db:menus

# 가격 형식 수정
npm run db:price
```

## 📊 데이터베이스 모니터링
- Render Dashboard에서 데이터베이스 상태 확인
- 쿼리 성능 및 연결 상태 모니터링
- 백업 및 복원 기능 활용
