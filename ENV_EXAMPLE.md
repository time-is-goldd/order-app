# 🔧 Render 배포용 환경 변수 설정

## 📋 백엔드 환경 변수 (Render Web Service)

Render Dashboard → 해당 서비스 → Environment 탭에서 다음 변수들을 추가하세요:

```env
NODE_ENV=production
DATABASE_URL=postgresql://username:password@hostname:port/database_name
PORT=3001
```

## 🎨 프론트엔드 환경 변수 (Render Static Site)

Render Dashboard → 해당 서비스 → Environment 탭에서 다음 변수들을 추가하세요:

```env
VITE_API_URL=https://coffee-order-backend.onrender.com
```

## 📝 설정 방법

### 1. 백엔드 환경 변수 설정
1. Render Dashboard → Web Service 선택
2. Environment 탭 클릭
3. "Add Environment Variable" 클릭
4. 다음 변수들을 하나씩 추가:

| Key | Value |
|-----|-------|
| `NODE_ENV` | `production` |
| `DATABASE_URL` | `postgresql://username:password@hostname:port/database_name` |
| `PORT` | `3001` |

### 2. 프론트엔드 환경 변수 설정
1. Render Dashboard → Static Site 선택
2. Environment 탭 클릭
3. "Add Environment Variable" 클릭
4. 다음 변수를 추가:

| Key | Value |
|-----|-------|
| `VITE_API_URL` | `https://coffee-order-backend.onrender.com` |

## ⚠️ 중요 사항

### DATABASE_URL 형식
```
postgresql://username:password@hostname:port/database_name
```

예시:
```
postgresql://coffee_user:abc123@dpg-xyz123-a.oregon-postgres.render.com:5432/coffee_order_db
```

### VITE_API_URL 형식
```
https://your-backend-service-name.onrender.com
```

예시:
```
https://coffee-order-backend.onrender.com
```

## 🔍 환경 변수 확인 방법

### 백엔드에서 확인:
```javascript
console.log('DATABASE_URL:', process.env.DATABASE_URL);
console.log('NODE_ENV:', process.env.NODE_ENV);
```

### 프론트엔드에서 확인:
```javascript
console.log('VITE_API_URL:', import.meta.env.VITE_API_URL);
```

## 🚨 문제 해결

### 1. DATABASE_URL 오류
- Render PostgreSQL 서비스에서 External Database URL 복사
- 형식이 정확한지 확인

### 2. VITE_API_URL 오류
- 백엔드 서비스가 먼저 배포되어야 함
- 백엔드 URL이 정확한지 확인

### 3. CORS 오류
- 백엔드 CORS 설정에서 프론트엔드 URL 추가
- 환경 변수에서 URL 형식 확인
