// 전역 에러 처리 미들웨어

const errorHandler = (err, req, res, next) => {
  console.error('서버 에러:', err);

  // PostgreSQL 에러 처리
  if (err.code) {
    switch (err.code) {
      case '23505': // unique_violation
        return res.status(400).json({
          success: false,
          error: {
            code: 'DUPLICATE_ENTRY',
            message: '중복된 데이터입니다.',
            details: err.detail || err.message
          }
        });
      
      case '23503': // foreign_key_violation
        return res.status(400).json({
          success: false,
          error: {
            code: 'FOREIGN_KEY_VIOLATION',
            message: '관련 데이터가 존재하지 않습니다.',
            details: err.detail || err.message
          }
        });
      
      case '23502': // not_null_violation
        return res.status(400).json({
          success: false,
          error: {
            code: 'REQUIRED_FIELD_MISSING',
            message: '필수 필드가 누락되었습니다.',
            details: err.detail || err.message
          }
        });
      
      default:
        return res.status(500).json({
          success: false,
          error: {
            code: 'DATABASE_ERROR',
            message: '데이터베이스 오류가 발생했습니다.',
            details: process.env.NODE_ENV === 'development' ? err.message : 'Internal Server Error'
          }
        });
    }
  }

  // 일반적인 서버 오류
  res.status(err.statusCode || 500).json({
    success: false,
    error: {
      code: err.code || 'INTERNAL_ERROR',
      message: err.message || '서버 내부 오류가 발생했습니다.',
      details: process.env.NODE_ENV === 'development' ? err.stack : 'Internal Server Error'
    }
  });
};

module.exports = errorHandler;


