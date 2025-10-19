# 커피 주문 앱 백엔드 서버

Express.js와 PostgreSQL을 사용한 커피 주문 앱의 백엔드 API 서버입니다.

## 🚀 시작하기

### 필수 요구사항
- Node.js (v14 이상)
- PostgreSQL (v12 이상)
- npm 또는 yarn

### 설치 및 실행

1. **의존성 설치**
   ```bash
   npm install
   ```

2. **환경 변수 설정**
   ```bash
   # .env 파일 생성
   PORT=3001
   NODE_ENV=development
   
   # 데이터베이스 설정
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=coffee_order_db
   DB_USER=postgres
   DB_PASSWORD=password
   ```

3. **데이터베이스 설정**
   ```bash
   # PostgreSQL에서 데이터베이스 생성
   createdb coffee_order_db
   
   # 초기 데이터 삽입
   psql -d coffee_order_db -f src/config/init-db.sql
   ```

4. **서버 실행**
   ```bash
   # 개발 모드 (nodemon 사용)
   npm run dev
   
   # 프로덕션 모드
   npm start
   ```

## 📚 API 문서

### 기본 정보
- **Base URL**: `http://localhost:3001`
- **Content-Type**: `application/json`

### 메뉴 관련 API

#### GET /api/menus
메뉴 목록을 조회합니다.

**응답 예시:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "아메리카노(ICE)",
      "description": "깔끔하고 시원한 아이스 아메리카노",
      "price": 4000,
      "image": "🧊☕",
      "stock_quantity": 10,
      "options": [
        {
          "id": 1,
          "name": "샷 추가",
          "price": 500
        }
      ]
    }
  ]
}
```

#### GET /api/menus/:id
특정 메뉴의 상세 정보를 조회합니다.

#### PUT /api/menus/:id/stock
메뉴의 재고 수량을 수정합니다.

**요청 본문:**
```json
{
  "stock_quantity": 15
}
```

### 주문 관련 API

#### POST /api/orders
새로운 주문을 생성합니다.

**요청 본문:**
```json
{
  "order_items": [
    {
      "menu_id": 1,
      "menu_name": "아메리카노(ICE)",
      "quantity": 2,
      "options": ["샷 추가"],
      "item_price": 4500,
      "total_price": 9000
    }
  ],
  "total_amount": 9000
}
```

#### GET /api/orders
주문 목록을 조회합니다.

**쿼리 파라미터:**
- `status`: 주문 상태 필터 (pending, accepted, completed)
- `page`: 페이지 번호 (기본값: 1)
- `limit`: 페이지당 항목 수 (기본값: 10)

#### GET /api/orders/:id
특정 주문의 상세 정보를 조회합니다.

#### PUT /api/orders/:id/status
주문 상태를 변경합니다.

**요청 본문:**
```json
{
  "status": "accepted"
}
```

### 관리자 관련 API

#### GET /api/admin/dashboard
관리자 대시보드 통계 정보를 조회합니다.

**응답 예시:**
```json
{
  "success": true,
  "data": {
    "total_orders": 25,
    "pending_orders": 3,
    "accepted_orders": 5,
    "completed_orders": 17
  }
}
```

## 🗄️ 데이터베이스 스키마

### Menus 테이블
- `id`: 메뉴 고유 ID (SERIAL PRIMARY KEY)
- `name`: 커피 이름 (VARCHAR(100))
- `description`: 메뉴 설명 (TEXT)
- `price`: 가격 (INTEGER)
- `image`: 이미지 URL 또는 이모지 (VARCHAR(255))
- `stock_quantity`: 재고 수량 (INTEGER)
- `created_at`: 생성 시간 (TIMESTAMP)
- `updated_at`: 수정 시간 (TIMESTAMP)

### Options 테이블
- `id`: 옵션 고유 ID (SERIAL PRIMARY KEY)
- `name`: 옵션 이름 (VARCHAR(100))
- `price`: 옵션 추가 가격 (INTEGER)
- `menu_id`: 연결할 메뉴 ID (FOREIGN KEY)
- `created_at`: 생성 시간 (TIMESTAMP)

### Orders 테이블
- `id`: 주문 고유 ID (SERIAL PRIMARY KEY)
- `order_time`: 주문 일시 (TIMESTAMP)
- `order_items`: 주문 내용 (JSONB)
- `total_amount`: 총 주문 금액 (INTEGER)
- `status`: 주문 상태 (VARCHAR(20))
- `created_at`: 생성 시간 (TIMESTAMP)
- `updated_at`: 수정 시간 (TIMESTAMP)

## 🔧 개발

### 프로젝트 구조
```
server/
├── src/
│   ├── controllers/     # 컨트롤러 (비즈니스 로직)
│   ├── routes/         # 라우트 정의
│   ├── models/         # 데이터 모델
│   ├── middleware/     # 미들웨어
│   ├── config/         # 설정 파일
│   ├── utils/          # 유틸리티 함수
│   └── app.js          # 메인 애플리케이션 파일
├── package.json
└── README.md
```

### 에러 처리
모든 API 응답은 일관된 형식을 따릅니다:

**성공 응답:**
```json
{
  "success": true,
  "data": { ... },
  "message": "성공 메시지"
}
```

**에러 응답:**
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "에러 메시지",
    "details": "상세 정보"
  }
}
```

## 🚀 배포

1. **환경 변수 설정**
   - `NODE_ENV=production`
   - 데이터베이스 연결 정보 설정

2. **서버 시작**
   ```bash
   npm start
   ```

## 📝 라이선스

ISC

