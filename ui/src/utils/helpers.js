// 유틸리티 함수들
export const formatPrice = (price) => {
  return price.toLocaleString('ko-KR')
}

export const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('ko-KR', {
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

export const generateOrderId = () => {
  return Date.now().toString()
}

export const validateOrder = (items) => {
  if (!items || items.length === 0) {
    return { isValid: false, message: '장바구니가 비어있습니다.' }
  }
  return { isValid: true }
}

export const calculateTotalPrice = (items) => {
  return items.reduce((total, item) => total + (item.totalPrice * item.quantity), 0)
}

export const getInventoryStatus = (count) => {
  if (count === 0) return '품절'
  if (count < 5) return '주의'
  return '정상'
}
