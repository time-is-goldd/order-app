import { createContext, useContext, useReducer } from 'react'

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
    
    default:
      return state
  }
}

export const OrderProvider = ({ children }) => {
  const [state, dispatch] = useReducer(orderReducer, {
    orders: []
  })

  const addOrder = (orderData) => {
    dispatch({ type: 'ADD_ORDER', payload: orderData })
  }

  const updateOrderStatus = (orderId, status) => {
    dispatch({ type: 'UPDATE_ORDER_STATUS', payload: { orderId, status } })
  }

  const removeOrder = (orderId) => {
    dispatch({ type: 'REMOVE_ORDER', payload: orderId })
  }

  const getOrdersByStatus = (status) => {
    return state.orders.filter(order => order.status === status)
  }

  const getOrderStats = () => {
    const total = state.orders.length
    const pending = getOrdersByStatus('pending').length
    const accepted = getOrdersByStatus('accepted').length
    const completed = getOrdersByStatus('completed').length

    return { total, pending, accepted, completed }
  }

  const value = {
    ...state,
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
