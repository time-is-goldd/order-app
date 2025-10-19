const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// 미들웨어 설정
app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://coffee-order-frontend.onrender.com' // Render 프론트엔드 URL
  ],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 기본 라우트
app.get('/', (req, res) => {
  res.json({
    message: '커피 주문 앱 백엔드 서버가 실행 중입니다.',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

// API 라우트들
app.use('/api/menus', require('./routes/menus'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/admin', require('./routes/admin'));

// 404 에러 처리
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: '요청한 API 엔드포인트를 찾을 수 없습니다.'
  });
});

// 전역 에러 처리 미들웨어
app.use((err, req, res, next) => {
  console.error('서버 에러:', err);
  res.status(500).json({
    success: false,
    message: '서버 내부 오류가 발생했습니다.',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Internal Server Error'
  });
});

// 서버 시작
app.listen(PORT, () => {
  console.log(`🚀 서버가 포트 ${PORT}에서 실행 중입니다.`);
  console.log(`📱 프론트엔드: http://localhost:5173`);
  console.log(`🔧 백엔드 API: http://localhost:${PORT}`);
});

module.exports = app;
