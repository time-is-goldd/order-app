import { createContext, useContext, useReducer, useEffect, useState } from 'react'
import { orderAPI, adminAPI } from '../services/api'

const OrderContext = createContext()

const orderReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_ORDER':
      const newOrder = {
        ...action.payload,
        id: Date.now().toString(),
        status: 'pending',
        createdAt: new Date().toISOString()
      }
      return {
        ...state,
        orders: [...state.orders, newOrder]
      }
    
    case 'UPDATE_ORDER_STATUS':
      return {
        ...state,
        orders: state.orders.map(order =>
          order.id === action.payload.orderId
            ? { ...order, status: action.payload.status }
            : order
        )
      }
    
    case 'REMOVE_ORDER':
      return {
        ...state,
        orders: state.orders.filter(order => order.id !== action.payload)
      }
    
    case 'SET_ORDERS':
      return {
        ...state,
        orders: action.payload
      }
    
    default:
      return state
  }
}

export const OrderProvider = ({ children }) => {
  const [state, dispatch] = useReducer(orderReducer, {
    orders: []
  })
  const [loading, setLoading] = useState(false)

  // 서버에서 주문 데이터 로드
  useEffect(() => {
    const loadOrders = async () => {
      try {
        setLoading(true)
        const response = await adminAPI.getAdminOrders()
        if (response.success) {
          dispatch({ type: 'SET_ORDERS', payload: response.data })
        }
      } catch (error) {
        console.error('주문 데이터 로드 실패:', error)
      } finally {
        setLoading(false)
      }
    }

    loadOrders()
  }, [])

  const addOrder = async (orderData) => {
    try {
      const response = await orderAPI.createOrder(orderData)
      if (response.success) {
        dispatch({ type: 'ADD_ORDER', payload: response.data })
        return response.data
      }
    } catch (error) {
      console.error('주문 생성 실패:', error)
      throw error
    }
  }

  const updateOrderStatus = async (orderId, status) => {
    try {
      const response = await orderAPI.updateOrderStatus(orderId, status)
      if (response.success) {
        dispatch({ type: 'UPDATE_ORDER_STATUS', payload: { orderId, status } })
      }
    } catch (error) {
      console.error('주문 상태 업데이트 실패:', error)
      throw error
    }
  }

  const removeOrder = (orderId) => {
    dispatch({ type: 'REMOVE_ORDER', payload: orderId })
  }

  const getOrdersByStatus = (status) => {
    return state.orders.filter(order => order.status === status)
  }

  const getOrderStats = () => {
    const total = state.orders.length
    const pending = getOrdersByStatus('pending').length  // 주문 접수
    const accepted = getOrdersByStatus('accepted').length  // 제조 중
    const completed = getOrdersByStatus('completed').length  // 제조 완료

    return { total, pending, accepted, completed }
  }

  const value = {
    ...state,
    loading,
    addOrder,
    updateOrderStatus,
    removeOrder,
    getOrdersByStatus,
    getOrderStats
  }

  return (
    <OrderContext.Provider value={value}>
      {children}
    </OrderContext.Provider>
  )
}

export const useOrders = () => {
  const context = useContext(OrderContext)
  if (!context) {
    throw new Error('useOrders must be used within an OrderProvider')
  }
  return context
}
