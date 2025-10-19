// 공통 응답 형식 유틸리티

const sendSuccess = (res, data, message = '성공', statusCode = 200) => {
  res.status(statusCode).json({
    success: true,
    message,
    data
  });
};

const sendError = (res, error, statusCode = 500) => {
  const errorResponse = {
    success: false,
    error: {
      code: error.code || 'INTERNAL_ERROR',
      message: error.message || '서버 내부 오류가 발생했습니다.',
      details: error.details || error.message
    }
  };

  res.status(statusCode).json(errorResponse);
};

const sendValidationError = (res, message, details = null) => {
  res.status(400).json({
    success: false,
    error: {
      code: 'VALIDATION_ERROR',
      message,
      details
    }
  });
};

const sendNotFoundError = (res, resource, id) => {
  res.status(404).json({
    success: false,
    error: {
      code: 'NOT_FOUND',
      message: `${resource}를 찾을 수 없습니다.`,
      details: `ID ${id}에 해당하는 ${resource}가 존재하지 않습니다.`
    }
  });
};

module.exports = {
  sendSuccess,
  sendError,
  sendValidationError,
  sendNotFoundError
};

