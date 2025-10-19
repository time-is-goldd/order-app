# 🚀 Render 배포 가이드

## 📋 배포 전 준비사항

### 1. GitHub 저장소 준비
- 코드를 GitHub에 푸시해야 합니다
- `server/` 폴더와 `ui/` 폴더가 루트에 있어야 합니다

### 2. Render 계정 및 서비스 생성
- [Render Dashboard](https://dashboard.render.com)에서 계정 생성
- PostgreSQL 데이터베이스 서비스 생성 (이미 완료)

## 🔧 백엔드 배포 (Node.js)

### 1. Render에서 Web Service 생성
1. Render Dashboard → "New +" → "Web Service"
2. GitHub 저장소 연결
3. **설정값 입력:**

```
Name: coffee-order-backend
Environment: Node
Build Command: npm run build
Start Command: npm start
Root Directory: (비워두기 - 루트 디렉토리 사용)
```

**또는 더 간단한 방법:**

```
Name: coffee-order-backend
Environment: Node
Build Command: npm install
Start Command: npm start
Root Directory: server
```

### 2. 환경 변수 설정
Render Dashboard → 해당 서비스 → Environment 탭에서 추가:

```env
NODE_ENV=production
DATABASE_URL=postgresql://username:password@hostname:port/database_name
PORT=3001
```

### 3. package.json 스크립트 확인
`server/package.json`에 다음이 있는지 확인:
```json
{
  "scripts": {
    "start": "node src/app.js",
    "dev": "nodemon src/app.js"
  }
}
```

## 🎨 프론트엔드 배포 (React/Vite)

### 1. Render에서 Static Site 생성
1. Render Dashboard → "New +" → "Static Site"
2. GitHub 저장소 연결
3. **설정값 입력:**

```
Name: coffee-order-frontend
Build Command: cd ui && npm install && npm run build
Publish Directory: ui/dist
Root Directory: ui
```

### 2. 환경 변수 설정
```env
VITE_API_URL=https://your-backend-url.onrender.com
```

### 3. Vite 설정 확인
`ui/vite.config.js` 파일 생성/수정:
```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    assetsDir: 'assets'
  },
  server: {
    port: 5173,
    host: true
  }
})
```

## 🔗 API 연결 설정

### 1. 프론트엔드 API URL 수정
`ui/src/services/api.js` 파일에서:
```javascript
// 개발 환경
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'

// 프로덕션 환경에서는 Render 백엔드 URL 사용
// 예: https://coffee-order-backend.onrender.com
```

### 2. CORS 설정 확인
`server/src/app.js`에서 CORS 설정:
```javascript
const cors = require('cors');

app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://your-frontend-url.onrender.com'
  ],
  credentials: true
}));
```

## 📁 배포용 파일 구조

```
order-app/
├── server/                 # 백엔드 (Render Web Service)
│   ├── src/
│   ├── package.json
│   └── .env (로컬용)
├── ui/                     # 프론트엔드 (Render Static Site)
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── vite.config.js
└── README.md
```

## 🚀 배포 단계별 가이드

### Step 1: GitHub에 코드 푸시
```bash
git add .
git commit -m "Ready for Render deployment"
git push origin main
```

### Step 2: Render에서 백엔드 배포
1. Web Service 생성
2. GitHub 저장소 연결
3. 설정값 입력
4. 환경 변수 설정
5. Deploy 클릭

### Step 3: Render에서 프론트엔드 배포
1. Static Site 생성
2. GitHub 저장소 연결
3. 설정값 입력
4. 환경 변수 설정 (백엔드 URL 포함)
5. Deploy 클릭

### Step 4: 도메인 연결
- 백엔드: `https://coffee-order-backend.onrender.com`
- 프론트엔드: `https://coffee-order-frontend.onrender.com`

## 🔧 문제 해결

### 1. 빌드 실패
- Node.js 버전 확인 (18.x 권장)
- 의존성 설치 오류 시 `package-lock.json` 삭제 후 재시도

### 2. 데이터베이스 연결 실패
- `DATABASE_URL` 환경 변수 확인
- SSL 설정 확인

### 3. CORS 오류
- 백엔드 CORS 설정에서 프론트엔드 URL 추가
- 프론트엔드 API URL 확인

## 📊 모니터링

### Render Dashboard에서 확인:
- 서비스 상태
- 로그 확인
- 성능 메트릭
- 데이터베이스 연결 상태

## 💰 비용 정보
- **무료 플랜**: 제한된 시간 사용
- **유료 플랜**: 24/7 서비스 가능
- **데이터베이스**: PostgreSQL 무료 플랜 사용 가능

## 🎯 배포 후 확인사항
1. 백엔드 API 엔드포인트 테스트
2. 프론트엔드에서 백엔드 연결 확인
3. 데이터베이스 연결 테스트
4. 주문 기능 테스트
5. 관리자 기능 테스트
