// API 서비스 파일
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api'

// 공통 API 요청 함수
const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  }

  try {
    const response = await fetch(url, config)
    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error?.message || `HTTP error! status: ${response.status}`)
    }

    return data
  } catch (error) {
    console.error('API 요청 오류:', error)
    throw error
  }
}

// 메뉴 관련 API
export const menuAPI = {
  // 메뉴 목록 조회
  getMenus: () => apiRequest('/menus'),
  
  // 특정 메뉴 상세 조회
  getMenuById: (id) => apiRequest(`/menus/${id}`),
  
  // 메뉴 재고 수정
  updateStock: (id, stockQuantity) => 
    apiRequest(`/menus/${id}/stock`, {
      method: 'PUT',
      body: JSON.stringify({ stock_quantity: stockQuantity })
    })
}

// 주문 관련 API
export const orderAPI = {
  // 새 주문 생성
  createOrder: (orderData) => 
    apiRequest('/orders', {
      method: 'POST',
      body: JSON.stringify(orderData)
    }),
  
  // 주문 목록 조회
  getOrders: (params = {}) => {
    const queryString = new URLSearchParams(params).toString()
    return apiRequest(`/orders${queryString ? `?${queryString}` : ''}`)
  },
  
  // 특정 주문 상세 조회
  getOrderById: (id) => apiRequest(`/orders/${id}`),
  
  // 주문 상태 변경
  updateOrderStatus: (id, status) => 
    apiRequest(`/orders/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status })
    })
}

// 관리자 관련 API
export const adminAPI = {
  // 대시보드 통계 조회
  getDashboardStats: () => apiRequest('/admin/dashboard'),
  
  // 재고 현황 조회
  getInventory: () => apiRequest('/admin/inventory'),
  
  // 재고 수량 수정
  updateInventory: (id, stockQuantity) => 
    apiRequest(`/admin/inventory/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ stock_quantity: stockQuantity })
    }),
  
  // 관리자용 주문 목록 조회
  getAdminOrders: (params = {}) => {
    const queryString = new URLSearchParams(params).toString()
    return apiRequest(`/admin/orders${queryString ? `?${queryString}` : ''}`)
  }
}

export default {
  menuAPI,
  orderAPI,
  adminAPI
}
