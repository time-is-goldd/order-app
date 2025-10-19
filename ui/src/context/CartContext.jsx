import { createContext, useContext, useReducer, useEffect } from 'react'
import { useLocalStorage } from '../hooks/useLocalStorage'

const CartContext = createContext()

const cartReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_TO_CART':
      const existingItem = state.items.find(
        item => item.id === action.payload.id && 
        JSON.stringify(item.options) === JSON.stringify(action.payload.options)
      )
      
      if (existingItem) {
        return {
          ...state,
          items: state.items.map(item =>
            item.id === action.payload.id && 
            JSON.stringify(item.options) === JSON.stringify(action.payload.options)
              ? { ...item, quantity: item.quantity + 1 }
              : item
          )
        }
      } else {
        return {
          ...state,
          items: [...state.items, action.payload]
        }
      }
    
    case 'REMOVE_FROM_CART':
      return {
        ...state,
        items: state.items.filter((_, index) => index !== action.payload)
      }
    
    case 'UPDATE_QUANTITY':
      return {
        ...state,
        items: state.items.map((item, index) =>
          index === action.payload.index
            ? { ...item, quantity: action.payload.quantity }
            : item
        )
      }
    
    case 'CLEAR_CART':
      return {
        ...state,
        items: []
      }
    
    default:
      return state
  }
}

export const CartProvider = ({ children }) => {
  const [storedItems, setStoredItems] = useLocalStorage('cartItems', [])
  const [state, dispatch] = useReducer(cartReducer, {
    items: storedItems
  })

  // 로컬 스토리지와 동기화
  useEffect(() => {
    setStoredItems(state.items)
  }, [state.items, setStoredItems])

  const addToCart = (item) => {
    dispatch({ type: 'ADD_TO_CART', payload: item })
  }

  const removeFromCart = (index) => {
    dispatch({ type: 'REMOVE_FROM_CART', payload: index })
  }

  const updateQuantity = (index, quantity) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { index, quantity } })
  }

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' })
  }

  const getTotalPrice = () => {
    return state.items.reduce((total, item) => total + (item.totalPrice * item.quantity), 0)
  }

  const getCartItemQuantity = (productId) => {
    return state.items
      .filter(item => item.id === productId)
      .reduce((total, item) => total + item.quantity, 0)
  }

  const value = {
    ...state,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getTotalPrice,
    getCartItemQuantity
  }

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}
